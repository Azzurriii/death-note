"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";

type PasswordFormMode = "reset" | "change";

function PasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = (searchParams.get("mode") as PasswordFormMode) || "reset";

  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const pageTitle =
    mode === "reset" ? "Create new password" : "Change your password";
  const pageDescription =
    mode === "reset"
      ? "Your new password must be different from previous passwords"
      : "Update your password to keep your account secure";
  const submitButtonText =
    mode === "reset" ? "Reset password" : "Update password";
  const loadingText =
    mode === "reset" ? "Resetting password..." : "Updating password...";
  const successRedirect = mode === "reset" ? "/login" : "/settings";

  const validatePassword = () => {
    setPasswordError("");

    // Validate password length
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    // For change password mode, validate current password is provided
    if (mode === "change" && !currentPassword) {
      setPasswordError("Current password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      // Different API calls based on mode
      if (mode === "reset") {
        // You might need to pass a token from the URL
        console.log("Reset password:", password);
        // await resetPassword(token, password)
      } else {
        // For change password (from user settings)
        console.log(
          "Change password - Current:",
          currentPassword,
          "New:",
          password
        );
        // await changePassword(currentPassword, password)
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect after successful password update
      router.push(successRedirect);
    } catch (error) {
      console.error("Password update failed:", error);
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md px-4 py-8 sm:px-6 md:max-w-sm lg:px-8">
      {/* Logo and Header */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Death Note</h1>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">{pageTitle}</h2>
        <p className="mt-2 text-sm text-gray-500">{pageDescription}</p>
      </div>

      {/* Password Form */}
      <div className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password Field (only for change password mode) */}
          {mode === "change" && (
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium"
              >
                Current password
              </label>
              <div className="mt-1">
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>
          )}

          {/* New Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              {mode === "change" ? "New password" : "Password"}
            </label>
            <div className="mt-1">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={isLoading}
                className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm {mode === "change" ? "new " : ""}
              password
            </label>
            <div className="mt-1">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={isLoading}
                className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Error Message */}
          {passwordError && (
            <div className="text-sm text-red-500">{passwordError}</div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-10 w-full rounded-md bg-black text-sm font-medium text-white transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? loadingText : submitButtonText}
          </Button>
        </form>
      </div>

      {/* Back Link */}
      <div className="mt-8 text-center text-sm">
        <p className="text-gray-500">
          <Link
            href={mode === "reset" ? "/login" : "/settings"}
            className="font-medium text-black hover:underline"
          >
            {mode === "reset" ? "Back to login" : "Back to settings"}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PasswordFormPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <PasswordForm />
      </Suspense>
    </div>
  );
}
