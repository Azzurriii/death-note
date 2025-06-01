"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingCard, LoadingSpinner } from "@/components/ui/loading";
import { TestAttemptsModal } from "@/components/ui/test-attempts-modal";
import { useTests } from "@/hooks/useTests";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function ExamListPage() {
  // Read userId immediately during initialization
  const [userId, setUserId] = React.useState<number>(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      return storedUserId ? parseInt(storedUserId, 10) || 0 : 0;
    }
    return 0;
  });

  const { tests, loading, error, refetch } = useTests(userId);
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = React.useState(true);
  const [selectedTest, setSelectedTest] = React.useState<{
    id: number;
    title: string;
  } | null>(null);

  // Check authentication status
  React.useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      // User is not logged in, redirect to login
      router.push("/login");
    } else {
      // User is logged in, allow access
      const parsedUserId = parseInt(storedUserId, 10) || 0;
      setUserId(parsedUserId);
      setIsAuthenticating(false);
    }
  }, [router]);

  // Simple reload once when component mounts
  React.useEffect(() => {
    if (userId > 0) {
      refetch();
    }
  }, [userId]); // Only when userId changes

  // Show loading while checking authentication
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Available Exams
            </h1>
            <p className="text-gray-600">
              Choose an exam to start practicing your TOEIC Writing skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Available Exams
            </h1>
            <p className="text-gray-600">
              Choose an exam to start practicing your TOEIC Writing skills
            </p>
          </div>
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Exams
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={refetch}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleShowAttempts = (testId: number, testTitle: string) => {
    setSelectedTest({ id: testId, title: testTitle });
  };

  const handleCloseModal = () => {
    setSelectedTest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Exams
          </h1>
          <p className="text-gray-600">
            Choose an exam to start practicing your TOEIC Writing skills
          </p>
        </div>

        {tests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No exams available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Card
                key={test.id}
                className="hover:shadow-md transition-shadow h-full flex flex-col"
              >
                <CardHeader className="flex-grow">
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {test.description}
                  </CardDescription>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500">
                      Questions: {test.question_count}
                    </p>
                    {test.has_attempted_by_user && test.last_attempt_status && (
                      <>
                        <p className="text-xs text-gray-500">
                          Last Status:
                          <span
                            className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              test.last_attempt_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {test.last_attempt_status}
                          </span>
                        </p>
                        {test.last_attempt_raw_score !== undefined && (
                          <p className="text-xs text-gray-500">
                            Last Score: {test.last_attempt_raw_score} (Scaled:{" "}
                            {test.last_attempt_scaled_score})
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <Link href={`/exam/${test.id}/part1`} className="block">
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      Start Exam
                    </Button>
                  </Link>
                  {test.has_attempted_by_user && (
                    <Button
                      onClick={() => handleShowAttempts(test.id, test.title)}
                      variant="outline"
                      className="w-full"
                    >
                      See Attempts
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Test Attempts Modal */}
      {selectedTest && (
        <TestAttemptsModal
          isOpen={!!selectedTest}
          onClose={handleCloseModal}
          testId={selectedTest.id}
          testTitle={selectedTest.title}
          userId={userId}
        />
      )}
    </div>
  );
}
