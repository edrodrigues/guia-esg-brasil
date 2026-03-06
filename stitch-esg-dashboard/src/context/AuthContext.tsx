import React, { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = () => firebaseSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
