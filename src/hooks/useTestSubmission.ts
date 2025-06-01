import { useState, useEffect } from "react";
import { testService } from "@/services/testService";
import { TestAttemptDetailDTO } from "@/types/test";

interface UseTestSubmissionResult {
  submission: TestAttemptDetailDTO | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTestSubmission(
  attemptId: string | number
): UseTestSubmissionResult {
  const [submission, setSubmission] = useState<TestAttemptDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testService.getTestAttempt(attemptId);
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
    if (attemptId) {
      fetchSubmission();
    }
  }, [attemptId]);

  return {
    submission,
    loading,
    error,
    refetch: fetchSubmission,
  };
}
