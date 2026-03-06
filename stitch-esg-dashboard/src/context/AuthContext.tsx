import React, { useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AuthContext } from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDiagnosticCompleted, setIsDiagnosticCompleted] = useState(false);

  const fetchDiagnosticStatus = useCallback(async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const companyId = userDoc.data().companyId;
        const companyDoc = await getDoc(doc(db, 'companies', companyId));
        if (companyDoc.exists()) {
          // Check if esgScores are not zero or if lastDiagnosticDate exists
          const data = companyDoc.data();
          const completed = !!data.lastDiagnosticDate || 
            (data.esgScores?.environmental > 0 || 
             data.esgScores?.social > 0 || 
             data.esgScores?.governance > 0);
          setIsDiagnosticCompleted(completed);
        }
      }
    } catch (err) {
      console.error("Error fetching diagnostic status:", err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await fetchDiagnosticStatus(u.uid);
      } else {
        setIsDiagnosticCompleted(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchDiagnosticStatus]);

  const signOut = () => firebaseSignOut(auth);
  
  const refreshAuth = async () => {
    if (user) {
      await fetchDiagnosticStatus(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDiagnosticCompleted, signOut, refreshAuth }}>
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
