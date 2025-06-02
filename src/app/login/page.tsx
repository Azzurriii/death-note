"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { users } from "@/store/users";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  // Check if user is already logged in
  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      // User is already logged in, redirect to home
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (username && password) {
      const userId = users.find(
        (user) => user.username === username && user.password === password
      )?.id;
      if (!userId) {
        setIsLoading(false);
        toast.error("Invalid username or password");
        return;
      }

      localStorage.setItem("userId", userId.toString());
      localStorage.setItem("username", username);

      setTimeout(() => {
        setIsLoading(false);
        // Redirect to home after successful login
        router.push("/");
      }, 1000);
    } else {
      setIsLoading(false);
      toast.error("Please enter both username and password");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="w-full max-w-md px-4 py-8 sm:px-6 md:max-w-sm lg:px-8">
        {/* Logo and Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Death Note</h1>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email to sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Username
              </label>
              <div className="mt-1">
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  required
                  disabled={isLoading}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-gray-500 hover:text-black"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-10 w-full rounded-md bg-black text-sm font-medium text-white transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              type="button"
              className="h-10 w-full rounded-md border border-gray-200 bg-white text-sm font-normal text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Google</title>
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              type="button"
              className="h-10 w-full rounded-md border border-gray-200 bg-white text-sm font-normal text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              <svg
                className="mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <title>Apple</title>
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-3.405 1.88-2.87 6.27.572 8.04z" />
              </svg>
              Apple
            </Button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center text-sm">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-black hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
