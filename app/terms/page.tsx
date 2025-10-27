'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="flex items-center hover:text-gray-700">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Terms of Service</span>
          </nav>
        </div>
      </div>
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-6">
                By accessing and using Planet Nine Classes, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use License</h2>
              <p className="text-gray-600 mb-6">
                Permission is granted to temporarily download one copy of the materials on Planet Nine Classes 
                for personal, non-commercial transitory viewing only.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Enrollment</h2>
              <p className="text-gray-600 mb-6">
                Course enrollment is subject to availability and payment terms. All course materials 
                are provided for educational purposes only.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Responsibilities</h2>
              <p className="text-gray-600 mb-6">
                Users are responsible for maintaining the confidentiality of their account information 
                and for all activities that occur under their account.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 mb-6">
                In no event shall Planet Nine Classes or its suppliers be liable for any damages arising 
                out of the use or inability to use the materials on Planet Nine Classes.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms of Service, please contact us at 
                legal@planetnineclasses.com
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
