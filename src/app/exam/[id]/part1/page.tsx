"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/loading";
import { TimerDisplay } from "@/components/timer-display";
import { WordCountDisplay } from "@/components/word-count-display";
import { useTestDetail } from "@/hooks/useTestDetail";
import { Question } from "@/types/test";
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
import Image from "next/image";

export default function Part1Page() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const { test, loading, error } = useTestDetail(testId);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(8 * 60); // 8 minutes

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-proceed to Part 2 when time runs out
          router.push(`/exam/${testId}/part2`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testId, router]);

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

  const part1Questions = test.questions
    .filter((q: Question) => q.order_in_test >= 1 && q.order_in_test <= 5)
    .sort((a, b) => a.order_in_test - b.order_in_test);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleProceedToPart2 = () => {
    // Convert answers to UserAnswerDTO format and save to localStorage
    const submitAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        question_id: parseInt(questionId),
        user_answer: answer,
      })
    );
    localStorage.setItem(`exam-${testId}-part1`, JSON.stringify(submitAnswers));
    router.push(`/exam/${testId}/part2`);
  };

  const handleExit = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              src="/images/death-note.svg"
              alt="TOEIC"
              width={100}
              height={100}
              className="w-10 h-10"
            />
          </Link>

          <div className="flex items-center space-x-6">
            <TimerDisplay timeRemaining={timeRemaining} label="Part 1" />
            <div className="text-sm text-gray-600">Part 1/3</div>
            <Progress value={33.33} className="w-24" />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
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
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Part 1: Writing a Sentence based on a Picture
            </h2>
            <p className="text-gray-600">
              Write one sentence for each question using the given keywords and
              describing the image.
            </p>
          </div>

          {part1Questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-8 hover:border-gray-200"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-3">
                Question {question.order_in_test}: {question.title}
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  {question.image_url && (
                    <img
                      src={question.image_url}
                      alt={`Question ${question.order_in_test}`}
                      className="rounded-xl border border-gray-100 w-full h-auto shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-image.jpg";
                      }}
                    />
                  )}

                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-xl shadow-sm">
                    <p className="text-base font-semibold text-blue-900 mb-3">
                      Use these words in your sentence:
                    </p>
                    <div className="flex gap-3">
                      <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-base font-semibold shadow-sm">
                        {question.given_word1}
                      </span>
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-lg text-base font-semibold shadow-sm">
                        {question.given_word2}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-base font-semibold text-gray-800">
                    Type a sentence:
                  </label>
                  <textarea
                    placeholder="Type your sentence here..."
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      handleAnswerChange(question.id, e.target.value)
                    }
                    className="w-full min-h-[140px] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm hover:shadow-md transition-shadow duration-200"
                  />
                  <WordCountDisplay text={answers[question.id] || ""} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg">Complete Part 1 & Continue</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Proceed to Part 2?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will not be able to return to Part 1 after proceeding. Are
                  you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleProceedToPart2}>
                  Proceed to Part 2
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </footer>
    </div>
  );
}
