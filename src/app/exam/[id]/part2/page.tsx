"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LoadingSpinner } from "@/components/ui/loading";
import { TimerDisplay } from "@/components/timer-display";
import { WordCountDisplay } from "@/components/word-count-display";
import { useTestDetail } from "@/hooks/useTestDetail";
import { Question } from "@/types/test";
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
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function Part2Page() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  const { test, loading, error } = useTestDetail(testId);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentEmail, setCurrentEmail] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes per email

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-proceed when time runs out
          if (currentEmail === 0) {
            // Move to next email
            setCurrentEmail(1);
            return 10 * 60; // Reset timer for next email
          } else {
            // Move to Part 3
            router.push(`/exam/${testId}/part3`);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEmail, testId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">{error || "Test not found"}</p>
        </div>
      </div>
    );
  }

  const part2Questions = test.questions
    .filter((q: Question) => q.order_in_test >= 6 && q.order_in_test <= 7)
    .sort((a, b) => a.order_in_test - b.order_in_test);

  const currentQuestion = part2Questions[currentEmail];

  const handleAnswerChange = (value: string) => {
    if (currentQuestion) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    }
  };

  const handleNextEmail = () => {
    if (currentEmail === 0) {
      setCurrentEmail(1);
      setTimeRemaining(10 * 60); // Reset timer for next email
    }
  };

  const handleProceedToPart3 = () => {
    // Convert answers to UserAnswerDTO format and save to localStorage
    const submitAnswers = Object.entries(answers).map(
      ([questionId, answer]) => ({
        question_id: parseInt(questionId),
        user_answer: answer,
      })
    );
    localStorage.setItem(`exam-${testId}-part2`, JSON.stringify(submitAnswers));
    router.push(`/exam/${testId}/part3`);
  };

  const handleExit = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border px-6 py-4 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground no-underline"
          >
            <Image
              src="/images/death-note.svg"
              alt="Death Note"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold font-death-note">
              Death Note
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <TimerDisplay timeRemaining={timeRemaining} label="Part 2" />
            <div className="text-sm text-muted-foreground">Part 2/3</div>
            <Progress value={66.67} className="w-24" />
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Part 2: Responding to a Written Request
            </h2>
            <p className="text-muted-foreground">
              Email {currentEmail + 1} of 2
            </p>
          </div>

          {currentQuestion && (
            <div className="bg-card rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 p-8 hover:border-muted">
              <h3 className="text-xl font-bold mb-6 text-foreground border-b border-border pb-3">
                {currentQuestion.title}
              </h3>

              <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm prose prose-base max-w-none">
                <ReactMarkdown>{currentQuestion.prompt}</ReactMarkdown>
              </div>

              <div className="space-y-4">
                <label className="block text-base font-semibold text-foreground">
                  Your Response:
                </label>
                <textarea
                  placeholder="Type your email response here..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-full min-h-[320px] p-4 border border-border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none shadow-sm hover:shadow-md transition-shadow duration-200"
                />
                <WordCountDisplay text={answers[currentQuestion.id] || ""} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-4">
        <div className="max-w-4xl mx-auto text-center">
          {currentEmail === 0 ? (
            <Button size="lg" onClick={handleNextEmail}>
              Proceed to Next Email
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg">Complete Part 2 & Continue</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Proceed to Part 3?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will not be able to return to Part 1 or Part 2 after
                    proceeding. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleProceedToPart3}>
                    Proceed to Part 3
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </footer>
    </div>
  );
}
