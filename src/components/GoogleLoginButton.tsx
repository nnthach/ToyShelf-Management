"use client";

import { useCallback, useEffect, useRef } from "react";
import { Button } from "../styles/components/ui/button";
import Image from "next/image";
import { loginGoogleAPI } from "../services/user.service";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

interface GoogleCredentialResponse {
  credential: string;
}

export default function GoogleLoginButton() {
  const { handleLoginSuccess } = useAuth();

  const initialized = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        const idToken = response.credential;

        if (!idToken) {
          throw new Error("Missing idToken from Google");
        }

        const res = await loginGoogleAPI({ idToken });
        await handleLoginSuccess(res);
      } catch (error) {
        console.error("Google login error:", error);
        toast.error("Đăng nhập thất bại");
      }
    },
    [],
  );

  useEffect(() => {
    if (initialized.current) return;

    const interval = setInterval(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: handleCredentialResponse,
        });
        initialized.current = true;
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [handleCredentialResponse]);

  const handleLogin = () => {
    if (!window.google) {
      console.log("Google chưa load xong");
      return;
    }

    window.google.accounts.id.prompt();
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="w-[50%]"
      onClick={handleLogin}
    >
      <Image
        src="/icons/google.png"
        width={18}
        height={18}
        sizes="100vw"
        alt="Google Icon"
      />
      Google
    </Button>
  );
}
