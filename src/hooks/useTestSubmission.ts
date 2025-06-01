import { useState, useEffect } from "react";
import { testService } from "@/services/testService";
import { SubmitTestResponse } from "@/types/test";

interface UseTestSubmissionResult {
  submission: SubmitTestResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTestSubmission(
  testId: string | number,
  userId: number = 0
): UseTestSubmissionResult {
  const [submission, setSubmission] = useState<SubmitTestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testService.getTestSubmission(testId, userId);
      setSubmission(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testId) {
      fetchSubmission();
    }
  }, [testId, userId]);

  return {
    submission,
    loading,
    error,
    refetch: fetchSubmission,
  };
}
