"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

function AdminLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sign-in?tab=admin-login");
  }, [router]);

  return null;
}

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <AdminLoginRedirect />
    </Suspense>
  );
}
