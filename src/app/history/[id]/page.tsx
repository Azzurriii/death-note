"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { useTestSubmission } from "@/hooks/useTestSubmission";
import { useTestDetail } from "@/hooks/useTestDetail";
import { Attempt } from "@/types/test";
import Link from "next/link";

export default function ExamDetailPage() {
  const params = useParams();
  const testId = params.id as string;
  const { test, loading: testLoading } = useTestDetail(testId);
  const {
    submission,
    loading: submissionLoading,
    error,
  } = useTestSubmission(testId, 0);

  const loading = testLoading || submissionLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !submission || !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-500 text-lg mb-4">
            {error || "No submission found for this test."}
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

  // Group attempts by part
  const sortedAttempts = submission.attempts.sort(
    (a, b) => a.question.order_in_test - b.question.order_in_test
  );
  const part1Attempts = sortedAttempts.filter(
    (a) => a.question.order_in_test >= 1 && a.question.order_in_test <= 5
  );
  const part2Attempts = sortedAttempts.filter(
    (a) => a.question.order_in_test >= 6 && a.question.order_in_test <= 7
  );
  const part3Attempts = sortedAttempts.filter(
    (a) => a.question.order_in_test === 8
  );

  const renderAttempt = (attempt: Attempt) => (
    <div
      key={attempt.id}
      className="border-b border-gray-200 pb-6 last:border-b-0"
    >
      <h4 className="font-semibold mb-3">
        Question {attempt.question.order_in_test}: {attempt.question.title}
      </h4>

      {/* Show image for picture questions */}
      {attempt.question.type === "sentence_picture" && (
        <div className="mb-4">
          {attempt.question.image_url && (
            <div className="mb-3">
              <img
                src={attempt.question.image_url}
                alt={`Question ${attempt.question.order_in_test}`}
                className="w-full max-w-md h-48 object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          {attempt.question.given_word1 && attempt.question.given_word2 && (
            <div className="bg-yellow-50 p-3 rounded-lg mb-3">
              <p className="text-sm font-medium text-yellow-800 mb-1">
                Required words:
              </p>
              <div className="flex gap-2">
                <span className="bg-yellow-200 px-2 py-1 rounded text-yellow-800 text-sm">
                  {attempt.question.given_word1}
                </span>
                <span className="bg-yellow-200 px-2 py-1 rounded text-yellow-800 text-sm">
                  {attempt.question.given_word2}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Show prompt for email and essay questions */}
      {(attempt.question.type === "email_response" ||
        attempt.question.type === "opinion_essay") && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Prompt:</p>
          <div className="text-gray-700 bg-gray-50 p-3 rounded border whitespace-pre-line">
            {attempt.question.prompt}
          </div>
        </div>
      )}

      {/* User Answer */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Your Answer:</p>
        <div className="text-gray-900 bg-gray-50 p-3 rounded border whitespace-pre-wrap">
          {attempt.user_answer || "No answer provided"}
        </div>
      </div>

      {/* AI Feedback */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">AI Feedback:</p>
        <div className="bg-blue-50 border-blue-200 border p-3 rounded whitespace-pre-wrap">
          {attempt.ai_feedback || "No feedback available"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Test Results: {test.title}
              </h1>
              <p className="text-gray-600">
                Submitted on{" "}
                {formatDate(
                  submission.attempts[0]?.submitted_at ||
                    new Date().toISOString()
                )}
              </p>
              <p className="text-sm text-gray-500">
                Total Questions Answered: {submission.submitted_count}
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
        {part1Attempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Part 1: Picture Description (Questions 1-5)</CardTitle>
              <p className="text-sm text-gray-600">
                Write one sentence based on each picture using the given words.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {part1Attempts.map(renderAttempt)}
            </CardContent>
          </Card>
        )}

        {/* Part 2 Results */}
        {part2Attempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Part 2: Email Response (Questions 6-7)</CardTitle>
              <p className="text-sm text-gray-600">
                Respond to written requests with appropriate emails.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {part2Attempts.map(renderAttempt)}
            </CardContent>
          </Card>
        )}

        {/* Part 3 Results */}
        {part3Attempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Part 3: Opinion Essay (Question 8)</CardTitle>
              <p className="text-sm text-gray-600">
                Write a well-structured essay expressing your opinion.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {part3Attempts.map(renderAttempt)}
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {part1Attempts.length}
                </div>
                <div className="text-sm text-gray-600">Part 1 Questions</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {part2Attempts.length}
                </div>
                <div className="text-sm text-gray-600">Part 2 Questions</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {part3Attempts.length}
                </div>
                <div className="text-sm text-gray-600">Part 3 Questions</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {submission.submitted_count}
                </div>
                <div className="text-sm text-gray-600">Total Submitted</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
