"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AuthLayout } from "./AuthLayout";
import { AUTH_LOGIN_IMAGE } from "@/lib/images/auth";

type TabValue = "user-login" | "admin-login";
const TAB_VALUES: TabValue[] = ["user-login", "admin-login"];

export default function CombinedLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { showToast } = useToast();

  const initialTab =
    (TAB_VALUES.find((tab) => tab === searchParams.get("tab")) as
      | TabValue
      | undefined) ?? "user-login";
  const [activeTab, setActiveTab] = React.useState<TabValue>(initialTab);

  React.useEffect(() => {
    const paramTab = searchParams.get("tab");
    if (paramTab && TAB_VALUES.includes(paramTab as TabValue)) {
      setActiveTab(paramTab as TabValue);
    }
  }, [searchParams]);

  const redirectUrl = React.useMemo(() => {
    const direct = searchParams.get("redirect_url");
    if (direct) return direct;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("returnAfterLogin") || "/homepage";
    }
    return "/homepage";
  }, [searchParams]);

  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");
  const [adminLoading, setAdminLoading] = React.useState(false);

  const handleAdminLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminLoading(true);
    try {
      await login(adminEmail, adminPassword);
      router.replace("/admin");
    } catch (err) {
      const message =
        (err as Error).message || "Login failed. Please try again.";
      showToast(message, "error");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <AuthLayout
      imageUrl={AUTH_LOGIN_IMAGE}
      imageAlt="A man drinking coffee and laughing"
      quote={{
        text: (
          <>
            “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.”
          </>
        ),
        author: "Jamie Ortega",
      }}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="w-full"
      >
        <TabsContent value="user-login" className="w-fit">
          <div className="mb-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold leading-tight">
              Welcome back!
            </h2>
            <p className="text-sm text-black/50">Sign in to continue</p>
          </div>

          <TabsList className="mx-auto mb-6 flex w-fit justify-center gap-2 rounded-full bg-black/5 py-5 text-xs sm:text-sm">
            <TabsTrigger
              value="user-login"
              className="rounded-full px-5 py-2 font-medium text-black/70 transition data-[state=active]:bg-white"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="admin-login"
              className="rounded-full px-5 py-2 font-medium text-black/70 transition data-[state=active]:bg-white"
            >
              Admin
            </TabsTrigger>
          </TabsList>

          <SignIn
            forceRedirectUrl={redirectUrl}
            appearance={{
              elements: {
                card: "rounded-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
          />
        </TabsContent>

        <TabsContent value="admin-login" className="w-full">
          <div className="mb-5 text-center">
            <h2 className="text-2xl font-semibold leading-tight text-black sm:text-3xl">
              Admin access
            </h2>
            <p className="mt-1 text-sm text-black/50">Team accounts only</p>
          </div>

          <TabsList className="mx-auto mb-6 flex w-fit justify-center gap-2 rounded-full bg-black/5 py-5 text-xs sm:text-sm">
            <TabsTrigger
              value="user-login"
              className="rounded-full px-5 py-2 font-medium text-black/70 transition data-[state=active]:bg-white"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="admin-login"
              className="rounded-full px-5 py-2 font-medium text-black/70 transition data-[state=active]:bg-white"
            >
              Admin
            </TabsTrigger>
          </TabsList>

          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <form className="space-y-5" onSubmit={handleAdminLogin}>
              <div className="space-y-2">
                <Label
                  htmlFor="admin-email"
                  className="text-sm font-medium text-black/70"
                >
                  Email address
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  required
                  placeholder="admin@brewcommerce.com"
                  value={adminEmail}
                  onChange={(event) => setAdminEmail(event.target.value)}
                  disabled={adminLoading}
                  className="rounded border-black/10 focus:border-black/50 focus:ring-black/10"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="admin-password"
                  className="text-sm font-medium text-black/70"
                >
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  disabled={adminLoading}
                  className="rounded border-black/10 focus:border-black/50 focus:ring-black/10"
                />
              </div>

              <Button
                type="submit"
                disabled={adminLoading}
                className="w-full rounded bg-black text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {adminLoading ? "Signing in..." : "Sign in to Admin"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
