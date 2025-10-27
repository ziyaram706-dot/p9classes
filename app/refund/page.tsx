'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Home, ChevronRight, AlertTriangle, CheckCircle, XCircle, Clock, Shield } from 'lucide-react'
import Link from 'next/link'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="flex items-center hover:text-gray-700">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Refund Policy</span>
          </nav>
        </div>
      </div>
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Refund Policy</h1>
              <p className="text-lg text-gray-600">
                Our commitment to fair and transparent refund practices
              </p>
            </div>
            
            <div className="prose max-w-none">
              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h3>
                    <p className="text-yellow-700">
                      Please read this refund policy carefully before enrolling in any course. 
                      By enrolling, you agree to the terms outlined below.
                    </p>
                  </div>
                </div>
              </div>

              {/* General Policy */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                  General Refund Policy
                </h2>
                <p className="text-gray-600 mb-4">
                  At Planet Nine Classes, we strive to provide the best learning experience for our students. 
                  However, we have a strict no-refund policy for course enrollments once payment has been processed.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">No Refunds for Standard Enrollments</h4>
                      <p className="text-red-700">
                        Once you have enrolled in a course and payment has been processed, 
                        no refunds will be provided under normal circumstances.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exception Cases */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="h-6 w-6 text-blue-600 mr-3" />
                  Exception Cases
                </h2>
                <p className="text-gray-600 mb-4">
                  Refunds may be considered only in the following exceptional circumstances:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Course Cancellation by Admin</h4>
                    <p className="text-green-700">
                      If a course is cancelled by Planet Nine Classes due to technical issues, 
                      instructor unavailability, or other administrative reasons, a full refund 
                      will be provided within 7-10 business days.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Technical Issues</h4>
                    <p className="text-blue-700">
                      If you experience persistent technical issues that prevent you from accessing 
                      course materials and our support team cannot resolve them within 48 hours, 
                      a refund may be considered on a case-by-case basis.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Duplicate Payments</h4>
                    <p className="text-purple-700">
                      If you accidentally make duplicate payments for the same course, 
                      the duplicate payment will be refunded immediately upon verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Process */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Refund Process</h2>
                <p className="text-gray-600 mb-4">
                  If you believe you qualify for a refund under the exception cases above, 
                  please follow these steps:
                </p>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <ol className="list-decimal list-inside space-y-3 text-gray-700">
                    <li>
                      <strong>Contact Support:</strong> Email us at support@planetnineclasses.com 
                      with your enrollment details and reason for refund request.
                    </li>
                    <li>
                      <strong>Provide Documentation:</strong> Include any relevant documentation 
                      supporting your refund request (screenshots of technical issues, etc.).
                    </li>
                    <li>
                      <strong>Review Process:</strong> Our team will review your request within 
                      3-5 business days and respond with our decision.
                    </li>
                    <li>
                      <strong>Refund Processing:</strong> If approved, refunds will be processed 
                      within 7-10 business days to your original payment method.
                    </li>
                  </ol>
                </div>
              </div>

              {/* What's Not Covered */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">What's Not Covered</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-700 mb-4">
                    The following situations do not qualify for refunds:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-red-700">
                    <li>Change of mind after enrollment</li>
                    <li>Inability to attend live sessions due to personal schedule conflicts</li>
                    <li>Dissatisfaction with course content or teaching style</li>
                    <li>Technical issues on your end (slow internet, device problems, etc.)</li>
                    <li>Failure to complete the course within the specified timeframe</li>
                    <li>Request for refund after course completion</li>
                    <li>Enrollment in the wrong course due to user error</li>
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-700 mb-4">
                    For refund requests or questions about this policy, please contact us:
                  </p>
                  <div className="space-y-2 text-blue-700">
                    <p><strong>Email:</strong> support@planetnineclasses.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Response Time:</strong> 24-48 hours</p>
                  </div>
                </div>
              </div>

              {/* Policy Updates */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Policy Updates</h2>
                <p className="text-gray-600">
                  Planet Nine Classes reserves the right to update this refund policy at any time. 
                  Any changes will be posted on this page with an updated revision date. 
                  Continued use of our services after any such changes constitutes your acceptance 
                  of the new refund policy.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
