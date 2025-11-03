"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AUTH_SIGNUP_IMAGE } from "@/lib/images/auth";

export default function SignUpPage() {
  const searchParams = useSearchParams();

  const redirectUrl =
    searchParams.get("redirect_url") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("returnAfterLogin")
      : null) ||
    "/homepage";

  return (
    <AuthLayout
      imageUrl={AUTH_SIGNUP_IMAGE}
      imageAlt="A woman drinking coffee and looking out the window"
      quote={{
        text: (
          <>
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.”
          </>
        ),
        author: "Charlotte Park",
      }}
    >
      <div className="w-full px-8">
        <div className="mb-4 text-center">
          <h3 className="leading-tight!">Join brew.</h3>
          <p>It only takes a minute to unlock personalised recommendations.</p>
        </div>

        <div className="flex justify-center">
          <SignUp
            forceRedirectUrl={redirectUrl}
            appearance={{
              elements: {
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
          />
        </div>
      </div>
    </AuthLayout>
  );
}
