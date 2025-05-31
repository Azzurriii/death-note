"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inputKeysIndex } from "@/lib/utils/inputKeysIndex";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function ForgotPasswordCodePage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // Initialize refs array
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value.slice(-1);
    setVerificationCode(newVerificationCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    const digits = pastedData.replace(/\D/g, "").split("");

    const validDigits = digits.slice(0, 6);

    if (validDigits.length > 0) {
      const newVerificationCode = [...verificationCode];
      validDigits.forEach((digit, index) => {
        newVerificationCode[index] = digit;
      });

      setVerificationCode(newVerificationCode);

      const nextEmptyIndex = validDigits.length < 6 ? validDigits.length : 5;
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const code = verificationCode.join("");

    console.log("Verification code:", code);

    setTimeout(() => {
      setIsLoading(false);
      router.push(`/reset-password?mode=reset&token=${code}`);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="w-full max-w-md px-4 py-8 sm:px-6 md:max-w-sm lg:px-8">
        {/* Logo and Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Death Note</h1>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {/* Verification Form */}
        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="verification-code"
                className="block text-sm font-medium"
              >
                Verification code
              </label>
              <div className="mt-3 flex justify-center gap-2">
                {inputKeysIndex(verificationCode).map((index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      if (el) {
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={verificationCode[index]}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    disabled={isLoading}
                    className="h-12 w-12 rounded-md border border-gray-200 bg-white p-0 text-center text-lg focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="h-10 w-full rounded-md bg-black text-sm font-medium text-white transition-colors hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:opacity-50"
              disabled={isLoading || verificationCode.some((digit) => !digit)}
            >
              {isLoading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </div>

        {/* Resend Code */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive a code?{" "}
            <button
              type="button"
              className="font-medium text-black hover:underline"
              onClick={() => {
                // Implement resend code logic here
                alert("Verification code resent!");
              }}
              disabled={isLoading}
            >
              Resend
            </button>
          </p>
        </div>

        {/* Back to Login */}
        <div className="mt-8 text-center text-sm">
          <p className="text-gray-500">
            <Link
              href="/login"
              className="font-medium text-black hover:underline"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
