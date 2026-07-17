"use client";

import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import type { AuthUser } from "@/types";

interface UseAuthReturn {
    user: AuthUser | null;
    loading: boolean;
    isConfigured: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    error: string | null;
}

const MOCK_USER: AuthUser = {
  uid: "mock-operator-001",
  email: "operator@novasync.isro.in",
  displayName: "NOVA-SYNC Operator",
  photoURL: null,
};

function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {

      const timer = setTimeout(() => {
        setUser(MOCK_USER);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setUser(mapFirebaseUser(firebaseUser));

          firebaseUser.getIdToken().then((token) => {
            localStorage.setItem("nova_sync_token", token);
          });
          
          // Sync user to MongoDB
          fetch("/api/auth/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mapFirebaseUser(firebaseUser)),
          }).catch(err => console.error("Failed to sync user to MongoDB:", err));
        } else {
          setUser(null);
          localStorage.removeItem("nova_sync_token");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    setError(null);

    if (!isFirebaseConfigured || !auth || !googleProvider) {

      setUser(MOCK_USER);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("nova_sync_token", token);

      // Sync user to MongoDB
      await fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapFirebaseUser(result.user)),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);

    if (!isFirebaseConfigured || !auth) {
      setUser(null);
      return;
    }

    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("nova_sync_token");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      setError(message);
    }
  }, []);

  return {
    user,
    loading,
    isConfigured: isFirebaseConfigured,
    signIn,
    signOut,
    error,
  };
}
