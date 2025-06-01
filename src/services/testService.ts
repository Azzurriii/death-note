import { apiRequest } from "@/lib/api";
import { Test, TestWithQuestions } from "@/types/test";

export const testService = {
  async getAllTests(withQuestions: boolean = false): Promise<Test[]> {
    const endpoint = `/tests?with_questions=${withQuestions}`;
    return apiRequest<Test[]>(endpoint);
  },

  async getTestWithQuestions(id: string | number): Promise<TestWithQuestions> {
    const endpoint = `/tests/${id}`;
    return apiRequest<TestWithQuestions>(endpoint);
  },
};
