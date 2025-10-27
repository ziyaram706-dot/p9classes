'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, CheckCircle, XCircle, Clock, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Enquiry {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  status: 'PENDING' | 'RESOLVED' | 'REJECTED'
  createdAt: string
}

export default function AdminEnquiriesPage() {
  const { data: session, status } = useSession()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchEnquiries()
    }
  }, [status, session])

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/admin/enquiries')
      if (response.ok) {
        const data = await response.json()
        setEnquiries(data.enquiries || [])
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateEnquiryStatus = async (id: string, status: 'RESOLVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        setEnquiries(enquiries.map(enquiry => 
          enquiry.id === id ? { ...enquiry, status } : enquiry
        ))
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-800 mb-4">You need admin privileges to access this page.</p>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-700">
            <Link href="/" className="flex items-center hover:text-gray-700">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/admin" className="hover:text-gray-700">Admin Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Enquiries</span>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Enquiry Management
          </h1>
          <p className="text-gray-800 text-lg">
            Manage course enquiries from potential students
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {enquiries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Enquiries Found</h3>
                <p className="text-gray-700">There are no enquiries to display.</p>
              </CardContent>
            </Card>
          ) : (
            enquiries.map((enquiry) => (
              <Card key={enquiry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{enquiry.name}</CardTitle>
                    <Badge variant={
                      enquiry.status === 'RESOLVED' ? 'default' : 
                      enquiry.status === 'REJECTED' ? 'destructive' : 'secondary'
                    }>
                      {enquiry.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="ml-2 text-gray-900">{enquiry.email}</span>
                    </div>
                    {enquiry.phone && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{enquiry.phone}</span>
                      </div>
                    )}
                    {enquiry.subject && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Subject:</span>
                        <span className="ml-2 text-gray-900">{enquiry.subject}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium text-gray-600">Message:</span>
                      <p className="mt-1 text-gray-900">{enquiry.message}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm text-gray-600">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </span>
                      {enquiry.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => updateEnquiryStatus(enquiry.id, 'RESOLVED')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateEnquiryStatus(enquiry.id, 'REJECTED')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
