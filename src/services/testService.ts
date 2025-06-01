import { apiRequest } from "@/lib/api";
import {
  Test,
  TestWithQuestions,
  CreateTestRequest,
  SubmitTestRequest,
  SubmitTestResponse,
} from "@/types/test";

export const testService = {
  async getAllTests(withQuestions: boolean = false): Promise<Test[]> {
    const endpoint = `/tests?with_questions=${withQuestions}`;
    return apiRequest<Test[]>(endpoint);
  },

  async getTestWithQuestions(id: string | number): Promise<TestWithQuestions> {
    const endpoint = `/tests/${id}`;
    return apiRequest<TestWithQuestions>(endpoint);
  },

  async createTest(testData: CreateTestRequest): Promise<TestWithQuestions> {
    const endpoint = `/tests`;
    return apiRequest<TestWithQuestions>(endpoint, {
      method: "POST",
      body: JSON.stringify(testData),
    });
  },

  async submitTest(
    testId: string | number,
    submitData: SubmitTestRequest
  ): Promise<SubmitTestResponse> {
    const endpoint = `/tests/${testId}/submit`;
    return apiRequest<SubmitTestResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(submitData),
    });
  },

  async getTestSubmission(
    testId: string | number,
    userId: number = 0
  ): Promise<SubmitTestResponse> {
    // Try to get from localStorage first (for demo purposes)
    const stored = localStorage.getItem(`submission-${testId}-${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }

    // If not found, throw error to indicate no submission exists
    throw new Error("No submission found for this test");
  },

  // Helper method to store submission locally (will be called after successful submit)
  storeSubmissionLocally(
    testId: string | number,
    userId: number,
    submission: SubmitTestResponse
  ): void {
    localStorage.setItem(
      `submission-${testId}-${userId}`,
      JSON.stringify(submission)
    );
  },
};
