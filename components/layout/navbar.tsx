'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  User, 
  LogOut, 
  Menu,
  X,
  GraduationCap,
  Calendar,
  BarChart3
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface NavbarProps {
  variant?: 'default' | 'transparent'
}

export function Navbar({ variant = 'default' }: NavbarProps) {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // Debug session status
  console.log('Navbar session status:', status, 'session:', session, 'pathname:', pathname)

  // Check if we're on an auth page
  const isAuthPage = pathname?.startsWith('/auth/')
  
  // Avoid rendering incorrect auth state while loading
  const isAuthenticated = status === 'authenticated'

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const getDashboardLink = () => {
    if (!session?.user?.role) return '/dashboard'
    
    switch (session.user.role) {
      case 'ADMIN':
        return '/admin'
      case 'TUTOR':
        return '/tutor'
      case 'STUDENT':
        return '/dashboard'
      default:
        return '/dashboard'
    }
  }

  const getDashboardIcon = () => {
    if (!session?.user?.role) return <User className="h-4 w-4" />
    
    switch (session.user.role) {
      case 'ADMIN':
        return <BarChart3 className="h-4 w-4" />
      case 'TUTOR':
        return <Calendar className="h-4 w-4" />
      case 'STUDENT':
        return <GraduationCap className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const isTransparent = variant === 'transparent'

  return (
    <nav className={`${isTransparent ? 'bg-transparent absolute top-0 left-0 right-0 z-50 border-b border-white/10' : 'bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/logo.png" 
                alt="Planet Nine Classes" 
                width={40} 
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-white font-bold text-lg">Planet Nine Classes</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
              Home
            </Link>
            <Link href="/courses" className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
              Courses
            </Link>
            <Link href="/about" className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
              About
            </Link>
            <Link href="/contact" className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
              Contact
            </Link>
            <Link href="/refund" className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'} transition-colors`}>
              Refund Policy
            </Link>
            
            {isAuthenticated && !isAuthPage ? (
              <div className="flex items-center space-x-4">
                <Link href={getDashboardLink()}>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    {getDashboardIcon()}
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">{session!.user.name}</span>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : status === 'unauthenticated' ? (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              // Loading state placeholder to avoid flashing wrong buttons
              <div className="flex items-center space-x-4">
                <div className="h-8 w-20 bg-gray-700 rounded animate-pulse" />
                <div className="h-8 w-20 bg-gray-700 rounded animate-pulse" />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 rounded-lg mt-2 ${isTransparent ? 'bg-black/50 backdrop-blur' : 'bg-gray-800'}`}>
              <Link 
                href="/courses" 
                className={`block px-3 py-2 transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link 
                href="/about" 
                className={`block px-3 py-2 transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`block px-3 py-2 transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {isAuthenticated && !isAuthPage ? (
                <div className="pt-4 border-t border-gray-600">
                  <Link 
                    href={getDashboardLink()}
                    className={`block px-3 py-2 transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className={`px-3 py-2 text-sm ${isTransparent ? 'text-white/80' : 'text-gray-400'}`}>
                    {session!.user.name}
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className={`block w-full text-left px-3 py-2 transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'}`}
                  >
                    Sign Out
                  </button>
                </div>
              ) : status === 'unauthenticated' ? (
                <div className="pt-4 border-t border-gray-600 space-y-2">
                  <Link 
                    href="/auth/signin"
                    className={`block px-3 py-2 transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className={`block px-3 py-2 transition-colors ${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-300 hover:text-white'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-600 space-y-2">
                  <div className="h-8 w-full bg-gray-700 rounded animate-pulse" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
