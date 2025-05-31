"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import Image from "next/image";

// Mock data for Part 1 questions
const part1Questions = [
  {
    id: 1,
    keywords: "frame, but",
    imageUrl: "https://picsum.photos/300/200",
  },
  {
    id: 2,
    keywords: "woman, reading",
    imageUrl: "https://picsum.photos/300/200",
  },
  {
    id: 3,
    keywords: "meeting, discuss",
    imageUrl: "https://picsum.photos/300/200",
  },
  {
    id: 4,
    keywords: "coffee, while",
    imageUrl: "https://picsum.photos/300/200",
  },
  {
    id: 5,
    keywords: "computer, working",
    imageUrl: "https://picsum.photos/300/200",
  },
];

export default function Part1Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [timeRemaining, setTimeRemaining] = useState(8 * 60); // 8 minutes in seconds

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-proceed to Part 2 when time runs out
          router.push(`/exam/${params.id}/part2`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [params.id, router]);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleProceedToPart2 = () => {
    // Save answers to localStorage for demo purposes
    localStorage.setItem(`exam-${params.id}-part1`, JSON.stringify(answers));
    router.push(`/exam/${params.id}/part2`);
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
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold mb-4">
                Question {question.id}: {question.keywords}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Image
                    src={question.imageUrl || "/placeholder.svg"}
                    alt={`Question ${question.id} image`}
                    width={400}
                    height={300}
                    className="rounded-lg border border-gray-200 w-full h-auto"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Type a sentence:
                  </label>
                  <Textarea
                    placeholder="Type your sentence here..."
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <WordCountDisplay text={answers[index]} />
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
