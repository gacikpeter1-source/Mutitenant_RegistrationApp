import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
  requireSuperAdmin?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireSuperAdmin = false 
}: ProtectedRouteProps) {
  const { userData, loading, isSuperAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!userData) {
    return <Navigate to="/login" replace />
  }

  // SuperAdmin check
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />
  }

  // Skip approval check for SuperAdmins
  if (!isSuperAdmin && userData.status !== 'approved') {
    return (
      <div className="content-container py-8">
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Pending Approval</h2>
          <p>Your account is awaiting approval from an administrator.</p>
        </div>
      </div>
    )
  }

  // Admin check (but SuperAdmin can also access admin routes)
  if (requireAdmin && userData.role !== 'admin' && !isSuperAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
