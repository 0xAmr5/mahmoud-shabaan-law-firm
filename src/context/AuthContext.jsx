import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // 1. محاولة جلب البروفايل بالـ UID
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserProfile({
              id: userSnap.id,
              ...data,
              role: (data.role || 'CLIENT').toString().trim().toUpperCase(),
            });
          } else {
            // 2. محاولة جلب البروفايل بالإيميل لو الـ Doc ID مش هو الـ UID
            const q = query(collection(db, 'users'), where('email', '==', firebaseUser.email));
            const snap = await getDocs(q);
            if (!snap.empty) {
              const data = snap.docs[0].data();
              setUserProfile({
                id: snap.docs[0].id,
                ...data,
                role: (data.role || 'CLIENT').toString().trim().toUpperCase(),
              });
            } else {
              setUserProfile({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'CLIENT' });
            }
          }
        } catch (err) {
          console.error('Profile fetch error:', err);
          setUserProfile({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'CLIENT' });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  // تنظيف الرول وإزالة أي مسافات
  const role = (userProfile?.role || 'CLIENT').toString().trim().toUpperCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        role,
        isAdmin: role === 'ADMIN',
        isLawyer: role === 'LAWYER',
        isClient: role === 'CLIENT',
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;