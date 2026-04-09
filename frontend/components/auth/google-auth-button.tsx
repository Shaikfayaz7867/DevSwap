'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { googleLoginRequest } from '@/services/auth-service';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // useGoogleLogin with default settings gives an accessToken.
        // But our backend expects an idToken (verifyIdToken).
        // Let's use the 'implicit' flow or better yet, the 'code' flow if needed.
        // Actually, @react-oauth/google's GoogleLogin component (the standard button)
        // is easier for idTokens. But many prefer the custom button.
        // For idToken, we can use the 'useGoogleLogin' with 'implicit' and then fetch user info,
        // or use the standard <GoogleLogin /> component.
        console.warn('Implicit flow used. Backend usually expects idToken.');
      } catch (error) {
        console.error('Google login error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    flow: 'implicit',
  });

  return (
    <Button
      variant="outline"
      className="w-full h-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 gap-3"
      onClick={() => login()}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-semibold">Sign in with Google</span>
        </>
      )}
    </Button>
  );
}

import { GoogleLogin } from '@react-oauth/google';

export function GoogleSignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  return (
    <div className="flex justify-center w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (credentialResponse.credential) {
            setIsLoading(true);
            try {
              const res = await googleLoginRequest({ idToken: credentialResponse.credential });
              setSession(res.token, res.user);
              router.push('/home');
            } catch (error) {
              console.error('Google login failed:', error);
            } finally {
              setIsLoading(false);
            }
          }
        }}
        onError={() => {
          console.error('Login Failed');
        }}
        useOneTap
        theme="filled_black"
        shape="pill"
        width="100%"
      />
    </div>
  );
}
