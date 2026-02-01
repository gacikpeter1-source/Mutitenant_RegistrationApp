import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User } from '@/types'
import { useTheme } from './ThemeContext'

interface AuthContextType {
  currentUser: FirebaseUser | null
  userData: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAdmin: boolean
  isTrainer: boolean
  isSuperAdmin: boolean
  userTenantId: string | null
  currentTenantId: string | null // Based on current domain OR TenantSwitcher selection
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTenantId, setCurrentTenantId] = useState<string | null>(null)
  const { tenant } = useTheme()

  // MULTI-TENANT FIX: Sync currentTenantId with TenantSwitcher selections
  // When tenant changes in ThemeContext (via TenantSwitcher), update currentTenantId
  useEffect(() => {
    if (tenant && tenant.id) {
      console.log('🔄 Tenant switched to:', tenant.name, tenant.id)
      setCurrentTenantId(tenant.id)
    }
  }, [tenant])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData({
            uid: user.uid,
            email: data.email,
            name: data.name,
            phone: data.phone,
            description: data.description,
            photoURL: data.photoURL,
            role: data.role,
            status: data.status,
            tenantId: data.tenantId, // NEW: Tenant assignment
            createdAt: data.createdAt?.toDate() || new Date(),
            permissions: data.permissions
          })
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signIn,
    signOut,
    isAdmin: userData?.role === 'admin' && userData?.status === 'approved',
    isTrainer: (userData?.role === 'trainer' || userData?.role === 'admin') && userData?.status === 'approved',
    isSuperAdmin: userData?.role === 'superadmin',
    userTenantId: userData?.tenantId || null,
    currentTenantId
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
