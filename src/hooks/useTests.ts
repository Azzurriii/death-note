import { useState, useEffect } from "react";
import { testService } from "@/services/testService";
import { TestSummary } from "@/types/test";

interface UseTestsResult {
  tests: TestSummary[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTests(userId: number = 0): UseTestsResult {
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testService.getAllTests(userId);
      setTests(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [userId]);

  return {
    tests,
    loading,
    error,
    refetch: fetchTests,
  };
}
