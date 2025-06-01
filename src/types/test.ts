export interface Test {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  test_id: number;
  title: string;
  prompt: string;
  type: "sentence_picture" | "email_response" | "opinion_essay";
  order_in_test: number;
  image_url?: string;
  given_word1?: string;
  given_word2?: string;
  created_at: string;
  updated_at: string;
}

export interface TestWithQuestions extends Test {
  questions: Question[];
}

export interface CreateQuestionRequest {
  title: string;
  prompt: string;
  type: "sentence_picture" | "email_response" | "opinion_essay";
  order_in_test: number;
  image_url?: string;
  given_word1?: string;
  given_word2?: string;
}

export interface CreateTestRequest {
  title: string;
  description: string;
  questions: CreateQuestionRequest[];
}

export interface SubmitAnswerRequest {
  question_id: number;
  user_answer: string;
}

export interface SubmitTestRequest {
  answers: SubmitAnswerRequest[];
  user_id: number;
}

export interface Attempt {
  id: number;
  user_id: number;
  question_id: number;
  question: Question;
  user_answer: string;
  ai_feedback: string;
  submitted_at: string;
  created_at: string;
}

export interface SubmitTestResponse {
  test_id: number;
  user_id: number;
  submitted_count: number;
  attempts: Attempt[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}
