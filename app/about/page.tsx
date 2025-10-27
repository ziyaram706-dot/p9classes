'use client'

import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  BookOpen, 
  Award, 
  Target,
  Lightbulb,
  Heart,
  Globe,
  Shield,
  Zap,
  Star,
  Play,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Clock,
  MessageCircle,
  Home,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const { data: session } = useSession()
  
  const values = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Student-Centered',
      description: 'Every decision we make is focused on enhancing the learning experience and outcomes for our students.',
      color: 'from-blue-50 to-blue-100'
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-600" />,
      title: 'Quality Education',
      description: 'We provide high-quality, industry-relevant courses designed by experts and updated regularly.',
      color: 'from-green-50 to-green-100'
    },
    {
      icon: <Award className="h-8 w-8 text-purple-600" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from course content to student support.',
      color: 'from-purple-50 to-purple-100'
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: 'Results-Driven',
      description: 'Our courses are designed to deliver real-world skills that lead to career advancement.',
      color: 'from-orange-50 to-orange-100'
    }
  ]

  const stats = [
    { number: '50,000+', label: 'Students Enrolled', icon: <Users className="h-6 w-6" /> },
    { number: '200+', label: 'Live Courses', icon: <BookOpen className="h-6 w-6" /> },
    { number: '98%', label: 'Completion Rate', icon: <CheckCircle className="h-6 w-6" /> },
    { number: '4.9/5', label: 'Student Rating', icon: <Star className="h-6 w-6" /> }
  ]

  const features = [
    {
      icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
      title: 'Innovative Learning',
      description: 'Cutting-edge teaching methods and interactive content that keeps you engaged',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: 'Passionate Instructors',
      description: 'Industry experts who love teaching and sharing their knowledge with students',
      gradient: 'from-red-400 to-pink-500'
    },
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: 'Global Community',
      description: 'Connect with learners from around the world and build lasting professional networks',
      gradient: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: 'Secure Platform',
      description: 'Your data and progress are protected with enterprise-grade security measures',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      title: 'Fast Learning',
      description: 'Accelerated courses designed for busy professionals who want quick results',
      gradient: 'from-purple-400 to-violet-500'
    },
    {
      icon: <Star className="h-8 w-8 text-orange-500" />,
      title: 'Certified Programs',
      description: 'Industry-recognized certificates that boost your career prospects',
      gradient: 'from-orange-400 to-red-500'
    }
  ]

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      description: 'Former Google engineer with 15+ years in tech education',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      description: 'Full-stack developer and education technology expert',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Curriculum',
      description: 'Education specialist with PhD in Learning Sciences',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face'
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
            <span className="text-white font-medium">About</span>
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
              🎓 Empowering 50,000+ Students Worldwide
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              About <span className="text-white">Planet Nine Classes</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed max-w-4xl mx-auto">
              We're passionate about empowering individuals with the skills they need 
              to succeed in today's rapidly evolving job market. Our mission is to make 
              quality education accessible to everyone, everywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-4 hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Play className="w-5 h-5 mr-2" />
                  Explore Courses
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4">
                  Get In Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful students who have transformed their careers with us
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const colors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600', 
                'from-purple-500 to-purple-600',
                'from-orange-500 to-orange-600'
              ]
              const bgColors = [
                'bg-blue-50',
                'bg-green-50',
                'bg-purple-50', 
                'bg-orange-50'
              ]
              
              return (
                <div key={index} className={`${bgColors[index]} rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50`}>
                  <div className="flex justify-center mb-6">
                    <div className={`p-4 bg-gradient-to-r ${colors[index]} rounded-2xl shadow-lg`}>
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="bg-gray-800 border-gray-700 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Target className="h-6 w-6 text-blue-500 mr-3" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  To democratize education by providing high-quality, accessible, and affordable 
                  learning opportunities that empower individuals to achieve their career goals 
                  and personal aspirations. We believe that everyone deserves access to world-class 
                  education regardless of their background or circumstances.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">
                  To become the leading global platform for skill development and career advancement, 
                  where millions of learners can access cutting-edge courses, connect with industry 
                  experts, and transform their lives through education. We envision a world where 
                  learning never stops and opportunities are limitless.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do at Planet Nine Classes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className={`bg-gradient-to-br ${value.color} border-0 animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-white/20 rounded-full">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-700">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Planet Nine Classes?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover what makes us the preferred choice for professional development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`p-3 bg-gradient-to-r ${feature.gradient} rounded-lg`}>
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-center text-white text-3xl">Our Story</CardTitle>
              <CardDescription className="text-center text-gray-300 text-lg">
                From humble beginnings to global impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-500 mb-2">2020</div>
                    <div className="text-gray-300">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-500 mb-2">2022</div>
                    <div className="text-gray-300">10K Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-500 mb-2">2024</div>
                    <div className="text-gray-300">50K+ Students</div>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-6">
                  Planet Nine Classes was founded in 2020 by a group of passionate educators and industry 
                  professionals who recognized the growing gap between traditional education and the 
                  skills needed in today's job market. We started with a simple mission: to make 
                  quality education accessible to everyone.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  What began as a small team teaching web development has grown into a comprehensive 
                  learning platform offering courses in technology, business, design, and more. 
                  Today, we're proud to have helped thousands of students advance their careers 
                  and achieve their dreams.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Our success is measured not just by the number of courses we offer, but by the 
                  real-world impact we have on our students' lives. From landing dream jobs to 
                  starting successful businesses, our students' achievements are our greatest 
                  accomplishments.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The visionaries behind Planet Nine Classes' success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-300 text-sm">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
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
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}