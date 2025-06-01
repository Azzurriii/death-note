"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading";
import { testService } from "@/services/testService";
import { TestAttemptSummaryDTO } from "@/types/test";
import { useRouter } from "next/navigation";

interface TestAttemptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  testId: number;
  testTitle: string;
  userId?: number;
}

export function TestAttemptsModal({
  isOpen,
  onClose,
  testId,
  testTitle,
  userId = 1,
}: TestAttemptsModalProps) {
  const [attempts, setAttempts] = useState<TestAttemptSummaryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && testId) {
      fetchAttempts();
    }
  }, [isOpen, testId, userId]);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testService.getUserTestAttempts(testId, userId);
      setAttempts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attempts");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAttemptClick = (attemptId: number) => {
    router.push(`/history/${attemptId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Test Attempts: {testTitle}</DialogTitle>
          <DialogDescription>
            View your previous attempts for this test
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchAttempts} variant="outline">
                Try Again
              </Button>
            </div>
          ) : attempts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No attempts found for this test.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleAttemptClick(attempt.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">
                          Attempt #{attempt.id}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            attempt.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {attempt.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Submitted: {formatDate(attempt.submitted_at)}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Raw Score:{" "}
                          <span className="font-medium">
                            {attempt.total_raw_score}
                          </span>
                        </span>
                        <span className="text-gray-600">
                          Scaled Score:{" "}
                          <span className="font-medium">
                            {attempt.scaled_score}
                          </span>
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
