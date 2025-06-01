import { useState, useEffect } from "react";
import { testService } from "@/services/testService";
import { TestResponse } from "@/types/test";

interface UseTestDetailResult {
  test: TestResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTestDetail(testId: string | number): UseTestDetailResult {
  const [test, setTest] = useState<TestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTest = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testService.getTestWithQuestions(testId);
      setTest(data);
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
      fetchTest();
    }
  }, [testId]);

  return {
    test,
    loading,
    error,
    refetch: fetchTest,
  };
}
