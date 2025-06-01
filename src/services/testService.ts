import { apiRequest } from "@/lib/api";
import {
  TestSummary,
  TestResponse,
  TestCreateDTO,
  TestAttemptSubmitDTO,
  TestAttemptDetailDTO,
  TestAttemptSummaryDTO,
} from "@/types/test";

export const testService = {
  async getAllTests(): Promise<TestSummary[]> {
    const endpoint = `/tests`;
    return apiRequest<TestSummary[]>(endpoint);
  },

  async getTestWithQuestions(id: string | number): Promise<TestResponse> {
    const endpoint = `/tests/${id}`;
    return apiRequest<TestResponse>(endpoint);
  },

  async createTest(testData: TestCreateDTO): Promise<TestResponse> {
    const endpoint = `/admin/tests`;
    return apiRequest<TestResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(testData),
    });
  },

  async submitTest(
    testId: string | number,
    submitData: TestAttemptSubmitDTO
  ): Promise<TestAttemptDetailDTO> {
    const endpoint = `/tests/${testId}/attempts`;
    return apiRequest<TestAttemptDetailDTO>(endpoint, {
      method: "POST",
      body: JSON.stringify(submitData),
    });
  },

  async getTestAttempt(attemptId: string | number): Promise<TestAttemptDetailDTO> {
    const endpoint = `/test-attempts/${attemptId}`;
    return apiRequest<TestAttemptDetailDTO>(endpoint);
  },
  
  async getUserTestAttempts(
    testId: string | number,
    userId?: number
  ): Promise<TestAttemptSummaryDTO[]> {
    let endpoint = `/tests/${testId}/my-attempts`;
    if (userId !== undefined) {
      endpoint += `?user_id=${userId}`;
    }
    return apiRequest<TestAttemptSummaryDTO[]>(endpoint);
  },

  // Helper method to store attempt ID locally (for demo purposes)
  storeAttemptIdLocally(
    testId: string | number,
    userId: number,
    attemptId: number
  ): void {
    localStorage.setItem(
      `attempt-${testId}-${userId}`,
      attemptId.toString()
    );
  },
  
  // Helper method to get stored attempt ID
  getStoredAttemptId(
    testId: string | number,
    userId: number = 0
  ): number | null {
    const stored = localStorage.getItem(`attempt-${testId}-${userId}`);
    return stored ? parseInt(stored, 10) : null;
  },
};
