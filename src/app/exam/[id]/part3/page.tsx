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

// Mock data for Part 3 essay prompt
const part3Prompt =
  "Some people believe that working from home is more productive than working in an office, while others think that office work is more effective. Which do you prefer and why? Use specific reasons and examples to support your opinion. Write at least 300 words.";

export default function Part3Page() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;
  const [answer, setAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes

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

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
  };

  const handleSubmitTest = () => {
    // Save answer to localStorage for demo purposes
    localStorage.setItem(`exam-${examId}-part3`, JSON.stringify(answer));

    // Create a complete exam record
    const examRecord = {
      examId: examId,
      dateTaken: new Date().toISOString(),
      part1Answers: JSON.parse(
        localStorage.getItem(`exam-${examId}-part1`) || "[]"
      ),
      part2Answers: JSON.parse(
        localStorage.getItem(`exam-${examId}-part2`) || "[]"
      ),
      part3Answer: answer,
      completed: true,
    };

    // Save to exam history
    const history = JSON.parse(localStorage.getItem("examHistory") || "[]");
    history.push(examRecord);
    localStorage.setItem("examHistory", JSON.stringify(history));

    router.push(`/history/${examId}`);
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
              Part 3: Writing an Opinion Essay
            </h2>
            <p className="text-gray-600">
              Write a well-structured essay expressing your opinion on the given
              topic.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Essay Prompt:</h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 leading-relaxed">{part3Prompt}</p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Your Essay:
              </label>
              <Textarea
                placeholder="Write your essay here..."
                value={answer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="min-h-[400px] resize-none"
              />
              <WordCountDisplay text={answer} />
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg">Submit Test</Button>
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitTest}>
                  Submit Test
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </footer>
    </div>
  );
}
