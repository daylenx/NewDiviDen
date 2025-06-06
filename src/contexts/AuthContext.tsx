import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import app from '../config/firebase'

interface AuthContextType {
  currentUser: User | null
  loading: boolean
  userName: string | null
  signup: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const auth = getAuth(app)
  const db = getFirestore(app)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        // Fetch user name from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserName(userDoc.data().name || null)
        } else {
          setUserName(null)
        }
      } else {
        setUserName(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [auth, db])

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: user.email,
        createdAt: new Date().toISOString(),
        portfolio: [],
        settings: {
          theme: 'light',
          currency: 'USD'
        }
      })
      setUserName(name)
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error('Failed to create account')
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      // Fetch user name from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setUserName(userDoc.data().name || null)
      } else {
        setUserName(null)
      }
      toast.success('Logged in successfully!')
    } catch (error) {
      toast.error('Failed to log in')
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUserName(null)
      toast.success('Logged out successfully!')
    } catch (error) {
      toast.error('Failed to log out')
      throw error
    }
  }

  const value = {
    currentUser,
    loading,
    userName,
    signup,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 