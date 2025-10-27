'use client'

import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Headphones,
  Calendar,
  Shield,
  Home,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ContactPage() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Message sent successfully! We\'ll get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        })
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Us',
      description: 'Send us an email anytime',
      contact: 'info@testacademy.com',
      action: 'mailto:info@testacademy.com',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Call Us',
      description: 'Mon-Fri 9AM-7PM',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'WhatsApp',
      description: 'Quick responses',
      contact: '+1 (555) 123-4567',
      action: 'https://wa.me/15551234567',
      color: 'from-green-400 to-green-500'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Visit Us',
      description: 'Our main office',
      contact: '123 Education St, Learning City',
      action: '#',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const features = [
    {
      icon: <Headphones className="h-8 w-8 text-blue-500" />,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for enrolled students'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-500" />,
      title: 'Global Reach',
      description: 'Serving students from over 50 countries worldwide'
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-500" />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experts'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-300">
            <Link href="/" className="flex items-center hover:text-white">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">Contact</span>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient hero-pattern py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-8 glass-effect">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
              📞 We're Here to Help You Succeed
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              Contact <span className="text-white">Planet Nine Classes</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed max-w-4xl mx-auto">
              Have questions about our courses? Need help with enrollment? 
              We're here to help you succeed in your learning journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get In Touch With Us
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose your preferred way to reach us. We're always ready to help!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-gray-900 border-gray-700 hover:bg-gray-850 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-gray-300 mb-3">{method.description}</p>
                  <p className="text-blue-400 font-medium mb-4">{method.contact}</p>
                  <Button 
                    className="w-full bg-primary hover:bg-primary-dark"
                    onClick={() => window.open(method.action)}
                  >
                    Contact Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
                <CardDescription className="text-gray-300">
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ color: '#ffffff' }}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ color: '#ffffff' }}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ color: '#ffffff' }}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        style={{ color: '#ffffff' }}
                      >
                        <option value="" className="text-gray-900 bg-white">Select a subject</option>
                        <option value="course-enquiry" className="text-gray-900 bg-white">Course Enquiry</option>
                        <option value="enrollment-help" className="text-gray-900 bg-white">Enrollment Help</option>
                        <option value="technical-support" className="text-gray-900 bg-white">Technical Support</option>
                        <option value="payment-issue" className="text-gray-900 bg-white">Payment Issue</option>
                        <option value="general" className="text-gray-900 bg-white">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ color: '#ffffff' }}
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Hours */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    Open Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Monday - Friday</span>
                      <span className="font-semibold text-white">9:00 AM - 7:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Saturday</span>
                      <span className="font-semibold text-white">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span className="text-gray-300">Sunday</span>
                      <span className="font-semibold text-white">Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-400 mr-2" />
                      <span className="text-blue-300">
                        Emergency support available 24/7 for enrolled students
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    <Link href="/courses">
                      <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Browse Courses
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Users className="h-4 w-4 mr-2" />
                        Student Dashboard
                      </Button>
                    </Link>
                    <Link href="/about">
                      <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Award className="h-4 w-4 mr-2" />
                        About Us
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Live Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Success Message */}
              <Card className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">Success Message</h3>
                  </div>
                  <p className="text-green-200">
                    Your message has been sent successfully! Our team will review your inquiry and get back to you within 24 hours. Thank you for choosing Planet Nine Classes!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Students Trust Us
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We're committed to providing the best learning experience and support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-700 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students who have already transformed their careers with our courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                Browse Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}