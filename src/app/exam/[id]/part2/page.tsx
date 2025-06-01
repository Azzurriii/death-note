"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import { TimerDisplay } from "@/components/timer-display";
import { WordCountDisplay } from "@/components/word-count-display";

// Mock data for Part 2 email prompts
const part2Prompts = [
  "You are organizing a company event. Write an email to your colleagues inviting them to the event. Include details about the date, time, location, and what they should bring.",
  "You received a complaint from a customer about a delayed order. Write a response email apologizing for the delay and explaining how you will resolve the issue.",
];

export default function Part2Page() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const [currentEmail, setCurrentEmail] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", ""]);
  const [timeRemaining, setTimeRemaining] = useState(10 * 60); // 10 minutes per email

  // Timer countdown effect
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
            router.push(`/exam/${examId}/part3`);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentEmail, examId, router]);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentEmail] = value;
    setAnswers(newAnswers);
  };

  const handleNextEmail = () => {
    if (currentEmail === 0) {
      setCurrentEmail(1);
      setTimeRemaining(10 * 60); // Reset timer for next email
    }
  };

  const handleProceedToPart3 = () => {
    // Save answers to localStorage for demo purposes
    localStorage.setItem(`exam-${examId}-part2`, JSON.stringify(answers));
    router.push(`/exam/${examId}/part3`);
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
            <TimerDisplay timeRemaining={timeRemaining} label="Part 2" />
            <div className="text-sm text-gray-600">Part 2/3</div>
            <Progress value={66.66} className="w-24" />
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Part 2: Responding to a Written Request
            </h2>
            <p className="text-gray-600">Email {currentEmail + 1} of 2</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Email {currentEmail + 1} Prompt:
            </h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 leading-relaxed">
                {part2Prompts[currentEmail]}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Your Response:
              </label>
              <Textarea
                placeholder="Type your email response here..."
                value={answers[currentEmail]}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              <WordCountDisplay text={answers[currentEmail]} />
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
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
