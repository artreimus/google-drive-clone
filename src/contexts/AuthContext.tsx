import React, { useContext, createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import firebase from 'firebase/compat/app';

const AuthContext = createContext({});

function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }: any): JSX.Element {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  } // signups the user

  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password);
  } // logins the user

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email: string) {
    return currentUser?.updateEmail(email);
  }

  function updatePassword(password: string) {
    return currentUser?.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user: firebase.User | null) => {
        setCurrentUser(user); // sets the user whenever auth changes
        setIsLoading(false);
      }
    ); // returns a method for unsbuscribing

    return unsubscribe; // unsub if component unmounts
  }, []);

  // provides the value to the children of AuthContext.Provider
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children} {/* if we are not loading, render children */}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
