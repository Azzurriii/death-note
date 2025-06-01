export interface TestSummary {
  id: number;
  title: string;
  description: string;
  created_at: string;
  question_count: number;
}

export interface Question {
  id: number;
  test_id: number;
  title: string;
  prompt: string;
  type: "sentence_picture" | "email_response" | "opinion_essay";
  order_in_test: number;
  max_score: number;
  image_url?: string;
  given_word1?: string;
  given_word2?: string;
}

export interface TestResponse {
  id: number;
  title: string;
  description: string;
  created_at: string;
  questions: Question[];
}

export interface QuestionCreateDTO {
  title: string;
  prompt: string;
  type: "sentence_picture" | "email_response" | "opinion_essay";
  order_in_test: number;
  max_score: number;
  image_url?: string;
  given_word1?: string;
  given_word2?: string;
}

export interface TestCreateDTO {
  title: string;
  description: string;
  questions: QuestionCreateDTO[];
}

export interface UserAnswerDTO {
  question_id: number;
  user_answer: string;
}

export interface TestAttemptSubmitDTO {
  answers: UserAnswerDTO[];
  user_id?: number;
}

export interface AnswerResponseDTO {
  id: number;
  question_id: number;
  question: Question;
  user_answer: string;
  ai_score: number;
  ai_feedback: string;
}

export interface TestAttemptDetailDTO {
  id: number;
  test_id: number;
  test_title: string;
  user_id: number;
  submitted_at: string;
  status: string;
  total_score: number;
  answers: AnswerResponseDTO[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}

export interface TestAttemptSummaryDTO {
  id: number;
  test_id: number;
  user_id: number;
  submitted_at: string;
  status: string;
  total_score: number;
}

export interface ErrorResponse {
  message: string;
  details?: string[];
}
