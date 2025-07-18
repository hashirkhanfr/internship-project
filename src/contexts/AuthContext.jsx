import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUserProfile, clearUserProfile } from '../store/userSlice';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const serializableData = {
              ...data,
              createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
              lastLogin: data.lastLogin ? data.lastLogin.toDate().toISOString() : null,
            };
            console.log('User profile data from Firestore:', serializableData);
            dispatch(setUserProfile(serializableData));
          } else {
            dispatch(clearUserProfile());
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          dispatch(clearUserProfile());
        }
      } else {
        dispatch(clearUserProfile());
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
