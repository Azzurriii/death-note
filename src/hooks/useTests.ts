import { useState, useEffect } from "react";
import { testService } from "@/services/testService";
import { Test } from "@/types/test";

interface UseTestsResult {
  tests: Test[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTests(): UseTestsResult {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await testService.getAllTests(false);
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
  }, []);

  return {
    tests,
    loading,
    error,
    refetch: fetchTests,
  };
}
