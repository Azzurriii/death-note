"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, History, Plus } from "lucide-react";
import Image from "next/image";

export function Navigation() {
  const pathname = usePathname();

  // Don't show navigation during exam taking
  if (
    pathname.includes("/exam/") &&
    (pathname.includes("/part1") ||
      pathname.includes("/part2") ||
      pathname.includes("/part3"))
  ) {
    return null;
  }

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

          <Link href="/history">
            <Button
              variant={pathname.startsWith("/history") ? "default" : "ghost"}
              size="sm"
              className="flex items-center space-x-2"
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Button>
          </Link>

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
        </div>
      </div>
    </nav>
  );
}
