"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

import { AuthLayout } from "./AuthLayout";
import { AUTH_SIGNUP_IMAGE } from "@/lib/images/auth";

type TabValue = "user-signup" | "admin-signup";
const TAB_VALUES: TabValue[] = ["user-signup", "admin-signup"];

export default function CombinedSignup() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { showToast } = useToast();

  const initialTab =
    (TAB_VALUES.find((tab) => tab === searchParams.get("tab")) as
      | TabValue
      | undefined) ?? "user-signup";
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

  const [adminName, setAdminName] = React.useState("");
  const [adminEmail, setAdminEmail] = React.useState("");
  const [adminPassword, setAdminPassword] = React.useState("");
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [adminLoading, setAdminLoading] = React.useState(false);

  const handleAdminSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!termsAccepted) {
      showToast("You must accept the terms before continuing.", "error");
      return;
    }

    setAdminLoading(true);
    try {
      await register({
        name: adminName.trim(),
        email: adminEmail.trim(),
        password: adminPassword,
      });
    } catch {
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
            onClick={() => {
              setActiveTab(value);
              const params = new URLSearchParams(searchParams.toString());
              params.set("tab", value);
              const nextSearch = params.toString();
              router.replace(
                nextSearch ? `${pathname}?${nextSearch}` : pathname,
                { scroll: false }
              );
            }}
            className={`rounded-full px-6 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-white text-black"
                : "text-black/60 hover:text-black"
            }`}
          >
            {value === "user-signup" ? "Customer" : "Admin"}
          </button>
        );
      })}
    </div>
  );

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
      <div className="w-full">
        {activeTab === "user-signup" ? (
          <div className="w-full">
            <div className="mb-6 text-center">
              <h3 className="font-semibold">
                Join the community
              </h3>
              <p className="text-sm text-black/50">
                Create an account to unlock personalised recommendations.
              </p>
            </div>
            {renderTabButtons()}

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
        ) : (
          <div className="w-full px-8">
            <div className="mb-6 text-center">
              <h3 className="font-semibold leading-tight!">
                Create an admin account
              </h3>
              <p className="text-black/50">
                Reserved for team members managing the store.
              </p>
            </div>
            {renderTabButtons()}

            <div className="rounded-xl bg-white p-8 shadow-lg shadow-black/10">
              <form className="space-y-4" onSubmit={handleAdminSignup}>
                <label className="block space-y-2 text-sm font-medium text-black/75">
                  <span>Full name</span>
                  <input
                    id="admin-name"
                    type="text"
                    required
                    placeholder="Full name"
                    value={adminName}
                    onChange={(event) => setAdminName(event.target.value)}
                    disabled={adminLoading}
                    className="w-full rounded border border-black/10 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black/20"
                  />
                </label>

                <label className="block space-y-2 text-sm font-medium text-black/75">
                  <span>Email address</span>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    placeholder="Enter your email address"
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
                    minLength={8}
                    className="w-full rounded border border-black/10 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black/20"
                  />
                </label>

                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    disabled={adminLoading}
                    className="mt-0.5"
                  />
                  <span className="text-xs font-normal text-black/75 leading-tight!">
                    By creating an admin account you confirm that you are
                    authorised to manage Brew Commerce operations.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={adminLoading || !termsAccepted}
                  className="w-full rounded bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-60"
                >
                  {adminLoading
                    ? "Creating account..."
                    : "Create admin account"}
                </button>

                <div className="text-center text-sm text-black/70">
                  <span>Already have an account? </span>
                  <Link
                    href="/sign-in?tab=admin-login"
                    className="font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
