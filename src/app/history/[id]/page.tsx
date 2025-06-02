"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { useTestSubmission } from "@/hooks/useTestSubmission";
import { AnswerResponseDTO } from "@/types/test";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function ExamDetailPage() {
  const params = useParams();
  const attemptId = params.id as string;
  const { submission, loading, error } = useTestSubmission(attemptId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground text-lg mb-4">
            {error || "No submission found for this attempt."}
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group answers by part
  const sortedAnswers = submission.answers.sort(
    (a: AnswerResponseDTO, b: AnswerResponseDTO) =>
      a.question.order_in_test - b.question.order_in_test
  );
  const part1Answers = sortedAnswers.filter(
    (a: AnswerResponseDTO) =>
      a.question.order_in_test >= 1 && a.question.order_in_test <= 5
  );
  const part2Answers = sortedAnswers.filter(
    (a: AnswerResponseDTO) =>
      a.question.order_in_test >= 6 && a.question.order_in_test <= 7
  );
  const part3Answers = sortedAnswers.filter(
    (a: AnswerResponseDTO) => a.question.order_in_test === 8
  );

  const renderAnswer = (answer: AnswerResponseDTO) => (
    <div
      key={answer.id}
      className="border-b border-border pb-6 last:border-b-0"
    >
      <h4 className="font-semibold mb-3 text-foreground">
        Question {answer.question.order_in_test}: {answer.question.title}
      </h4>

      {/* Show image for picture questions */}
      {answer.question.type === "sentence_picture" && (
        <div className="mb-4">
          {answer.question.image_url && (
            <div className="mb-3">
              <img
                src={answer.question.image_url}
                alt={`Question ${answer.question.order_in_test}`}
                className="w-full max-w-md h-48 object-cover rounded-lg border border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          {answer.question.given_word1 && answer.question.given_word2 && (
            <div className="mt-6 bg-card border border-border p-5 rounded-xl shadow-sm">
              <p className="text-base font-semibold text-foreground mb-3">
                Given words:
              </p>
              <div className="flex gap-2">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {answer.question.given_word1}
                </span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                  {answer.question.given_word2}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show prompt for email and essay questions */}
      {(answer.question.type === "email_response" ||
        answer.question.type === "opinion_essay") && (
        <div className="mb-4">
          <p className="text-sm font-medium text-foreground mb-2">Prompt:</p>
          <div className="text-foreground bg-muted p-3 rounded border border-border whitespace-pre-line">
            {answer.question.prompt}
          </div>
        </div>
      )}

      {/* User's answer */}
      <div className="mb-4">
        <h5 className="text-sm font-semibold text-foreground mb-2">
          Your Answer:
        </h5>
        <div className="bg-card border border-border rounded-lg p-3">
          <p className="whitespace-pre-wrap text-foreground">
            {answer.user_answer}
          </p>
        </div>
      </div>

      {/* AI Feedback */}
      <div>
        <h5 className="text-sm font-semibold text-foreground mb-2">
          AI Feedback:
        </h5>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-lg p-3">
          <div className="text-foreground prose prose-sm max-w-none">
            <ReactMarkdown>{answer.ai_feedback}</ReactMarkdown>
          </div>
        </div>
        <div className="mt-2 text-right">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            Score: {answer.ai_score} / {answer.question.max_score}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Test Results: {submission.test_title}
              </h1>
              <p className="text-muted-foreground">
                Submitted on {formatDate(submission.submitted_at)}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Questions Answered: {submission.answers.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Status: {submission.status}
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Part 1 Results */}
        {part1Answers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Part 1: Picture Description (Questions 1-5)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Write one sentence based on each picture using the given words.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {part1Answers.map(renderAnswer)}
            </CardContent>
          </Card>
        )}

        {/* Part 2 Results */}
        {part2Answers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Part 2: Email Response (Questions 6-7)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Respond to written requests with appropriate emails.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {part2Answers.map(renderAnswer)}
            </CardContent>
          </Card>
        )}

        {/* Part 3 Results */}
        {part3Answers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Part 3: Opinion Essay (Question 8)</CardTitle>
              <p className="text-sm text-muted-foreground">
                Write an essay expressing your opinion on the given topic.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {part3Answers.map(renderAnswer)}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {part1Answers.length}
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Part 1 Questions
                </div>
                <div className="text-xs text-muted-foreground">
                  {part1Answers.reduce(
                    (sum, answer) => sum + answer.ai_score,
                    0
                  )}{" "}
                  /{" "}
                  {part1Answers.reduce(
                    (sum, answer) => sum + answer.question.max_score,
                    0
                  )}{" "}
                  points
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {part2Answers.length}
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Part 2 Questions
                </div>
                <div className="text-xs text-muted-foreground">
                  {part2Answers.reduce(
                    (sum, answer) => sum + answer.ai_score,
                    0
                  )}{" "}
                  /{" "}
                  {part2Answers.reduce(
                    (sum, answer) => sum + answer.question.max_score,
                    0
                  )}{" "}
                  points
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {part3Answers.length}
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Part 3 Questions
                </div>
                <div className="text-xs text-muted-foreground">
                  {part3Answers.reduce(
                    (sum, answer) => sum + answer.ai_score,
                    0
                  )}{" "}
                  /{" "}
                  {part3Answers.reduce(
                    (sum, answer) => sum + answer.question.max_score,
                    0
                  )}{" "}
                  points
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-muted-foreground">
                  {submission.total_raw_score} / 28
                </div>
                <div className="text-sm text-muted-foreground mb-1">
                  Total Raw Score
                </div>
                <div className="text-xs text-muted-foreground">
                  API calculated score
                </div>
              </div>
            </div>

            {/* Additional Score Information */}
            <div className="border-t border-border pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <div className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
                    Raw Score: {submission.total_raw_score} / 28
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total raw points
                  </div>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
                  <div className="text-lg font-semibold text-teal-700 dark:text-teal-400">
                    Scaled Score: {submission.scaled_score} / 200
                  </div>
                  <div className="text-sm text-muted-foreground">
                    TOEIC Writing Scale
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
