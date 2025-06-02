"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, History, Plus, LogOut } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { users } from "@/store/users";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = React.useState("");

  // Get username from localStorage
  React.useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  // Don't show navigation during exam taking or on login/register pages
  if (
    pathname.includes("/exam/") &&
    (pathname.includes("/part1") ||
      pathname.includes("/part2") ||
      pathname.includes("/part3"))
  ) {
    return null;
  }

  // Don't show navigation on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    // Redirect to login
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">
          <Image
            src="/images/death-note.svg"
            alt="Death Note"
            width={100}
            height={100}
            className="w-10 h-10"
          />
        </Link>

        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Exams</span>
            </Button>
          </Link>

          {/* <Link href="/history">
            <Button
              variant={pathname.startsWith("/history") ? "default" : "ghost"}
              size="sm"
              className="flex items-center space-x-2"
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Button>
          </Link> */}

          <Link href="/add-exam">
            <Button
              variant={pathname === "/add-exam" ? "default" : "ghost"}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Exam</span>
            </Button>
          </Link>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4 border-l border-gray-200 pl-4">
            {username && (
              <span className="text-sm text-gray-600">
                Welcome back,{" "}
                {users.find((user) => user.username === username)?.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
