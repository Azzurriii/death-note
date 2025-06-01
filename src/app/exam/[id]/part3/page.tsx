"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";
import { useTestDetail } from "@/hooks/useTestDetail";
import { Question, TestAttemptSubmitDTO, UserAnswerDTO } from "@/types/test";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { TimerDisplay } from "@/components/timer-display";
import { WordCountDisplay } from "@/components/word-count-display";
import { testService } from "@/services/testService";

export default function Part3Page() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const { test, loading, error } = useTestDetail(testId);
  const [answers, setAnswers] = useState<Record<number, UserAnswerDTO>>({});
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Test not found"}</p>
        </div>
      </div>
    );
  }

  const part3Questions = test.questions
    .filter((q: Question) => q.order_in_test === 8)
    .sort((a, b) => a.order_in_test - b.order_in_test);

  const currentQuestion = part3Questions[0];

  const handleAnswerChange = (value: string) => {
    if (currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          question_id: currentQuestion.id,
          user_answer: value,
        },
      }));
    }
  };

  const collectAllAnswers = (): TestAttemptSubmitDTO => {
    // Get answers from localStorage for part 1 and 2
    const part1Data = JSON.parse(
      localStorage.getItem(`exam-${testId}-part1`) || "[]"
    );
    const part2Data = JSON.parse(
      localStorage.getItem(`exam-${testId}-part2`) || "[]"
    );

    // Handle both old format (Record<number, string>) and new format (UserAnswerDTO[])
    const part1Answers: UserAnswerDTO[] = Array.isArray(part1Data)
      ? part1Data
      : Object.entries(part1Data).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          user_answer: answer as string,
        }));

    const part2Answers: UserAnswerDTO[] = Array.isArray(part2Data)
      ? part2Data
      : Object.entries(part2Data).map(([questionId, answer]) => ({
          question_id: parseInt(questionId),
          user_answer: answer as string,
        }));

    // Convert current part 3 answers
    const part3Answers: UserAnswerDTO[] = Object.values(answers);

    // Combine all answers
    const submitAnswers: UserAnswerDTO[] = [
      ...part1Answers,
      ...part2Answers,
      ...part3Answers,
    ];

    return {
      answers: submitAnswers,
    };
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Save current Part 3 answers to localStorage
      localStorage.setItem(`exam-${testId}-part3`, JSON.stringify(answers));

      // Collect all answers from all parts
      const submitData = collectAllAnswers();

      // Submit to API
      const result = await testService.submitTest(testId, submitData);

      // Store attempt ID locally for history page
      testService.storeAttemptIdLocally(testId, 0, result.id);

      // Clear localStorage for this exam
      localStorage.removeItem(`exam-${testId}-part1`);
      localStorage.removeItem(`exam-${testId}-part2`);
      localStorage.removeItem(`exam-${testId}-part3`);

      // Redirect to history page
      router.push(`/history/${testId}`);
    } catch (error) {
      console.error("Error submitting test:", error);
      alert(
        `Failed to submit test: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsSubmitting(false);
    }
  };

  const handleExit = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            TOEIC Writing Test
          </h1>
          <div className="flex items-center space-x-6">
            <TimerDisplay timeRemaining={timeRemaining} label="Part 3" />
            <div className="text-sm text-gray-600">Part 3/3</div>
            <Progress value={100} className="w-24" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isSubmitting}>
                  Exit
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Exit Exam?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to exit the exam? Your progress will
                    be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleExit}>
                    Exit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Part 3: Writing an Opinion Essay
            </h2>
            <p className="text-gray-600">
              Write a well-structured essay expressing your opinion on the given
              topic.
            </p>
          </div>

          {currentQuestion && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Essay Prompt:</h3>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {currentQuestion.prompt}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Your Essay:
                </label>
                <textarea
                  placeholder="Write your essay here..."
                  value={answers[currentQuestion.id]?.user_answer || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full min-h-[400px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none disabled:opacity-50"
                />
                <WordCountDisplay
                  text={answers[currentQuestion.id]?.user_answer || ""}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Test..." : "Submit Test"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to submit your test? You will not be
                  able to make any changes after submission.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Test"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </footer>
    </div>
  );
}
