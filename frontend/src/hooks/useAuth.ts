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

// ============================================================================
// useAuth Hook
// Supports Firebase Auth when configured, otherwise uses mock auth.
// ============================================================================

interface UseAuthReturn {
  /** Current authenticated user (null if not signed in) */
  user: AuthUser | null;
  /** Whether the auth state is still being determined */
  loading: boolean;
  /** Whether Firebase is configured (false = mock mode) */
  isConfigured: boolean;
  /** Sign in with Google (or mock sign in) */
  signIn: () => Promise<void>;
  /** Sign out */
  signOut: () => Promise<void>;
  /** Any auth error message */
  error: string | null;
}

/** Mock user for development when Firebase is not configured */
const MOCK_USER: AuthUser = {
  uid: "mock-operator-001",
  email: "operator@novasync.isro.in",
  displayName: "NOVA-SYNC Operator",
  photoURL: null,
};

/** Map Firebase User to our AuthUser type */
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

  // ── Firebase Auth Listener ──────────────────────────────────────────────
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Mock mode: auto-login as mock user after a brief delay
      const timer = setTimeout(() => {
        setUser(MOCK_USER);
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Real Firebase: listen for auth state changes
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setUser(mapFirebaseUser(firebaseUser));
          // Store token for API interceptor
          firebaseUser.getIdToken().then((token) => {
            localStorage.setItem("nova_sync_token", token);
          });
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

  // ── Sign In ─────────────────────────────────────────────────────────────
  const signIn = useCallback(async () => {
    setError(null);

    if (!isFirebaseConfigured || !auth || !googleProvider) {
      // Mock mode: instant sign in
      setUser(MOCK_USER);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("nova_sync_token", token);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      setError(message);
      throw err;
    }
  }, []);

  // ── Sign Out ────────────────────────────────────────────────────────────
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
