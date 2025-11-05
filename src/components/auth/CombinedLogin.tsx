"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

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

  const renderTabButtons = () => (
    <div className="mx-auto mb-6 flex w-fit justify-center rounded-full bg-black/5 p-1">
      {TAB_VALUES.map((value) => {
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={`rounded-full px-6 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-white text-black"
                : "text-black/60 hover:text-black"
            }`}
          >
            {value === "user-login" ? "Customer" : "Admin"}
          </button>
        );
      })}
    </div>
  );

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
      <div className="w-full">
        {activeTab === "user-login" ? (
          <div className="w-full">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-black">
                Welcome back!
              </h3>
              <p className="text-sm text-black/60">Sign in to continue</p>
            </div>
            {renderTabButtons()}

            <div className="flex justify-center">
              <SignIn
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
        ) : (
          <div className="w-full">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-semibold text-black">Admin access</h3>
              <p className="text-sm text-black/60">Team accounts only</p>
            </div>
            {renderTabButtons()}

            <div className="rounded-xl bg-white p-8 shadow-lg shadow-black/10">
              <form className="space-y-4" onSubmit={handleAdminLogin}>
                <label className="block space-y-2 text-sm font-medium text-black/75">
                  <span>Email address</span>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    placeholder="admin@brewcommerce.com"
                    value={adminEmail}
                    onChange={(event) => setAdminEmail(event.target.value)}
                    disabled={adminLoading}
                    className="w-full rounded border border-black/10 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black/20"
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium text-black/75">
                  <span>Password</span>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={adminPassword}
                    onChange={(event) => setAdminPassword(event.target.value)}
                    disabled={adminLoading}
                    className="w-full rounded border border-black/10 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black/20"
                  />
                </label>

                <button
                  type="submit"
                  disabled={adminLoading}
                  className="w-full rounded-lg border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60"
                >
                  {adminLoading ? "Signing in..." : "Sign in to Admin"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
