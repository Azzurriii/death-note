"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExamRecord, mockExams, mockExamHistory } from "@/lib/mock-data";

export default function HistoryPage() {
  const [examHistory, setExamHistory] = useState<ExamRecord[]>([]);

  useEffect(() => {
    // Load exam history from localStorage
    const history = JSON.parse(localStorage.getItem("examHistory") || "[]");

    // Always show mock data, merge with localStorage if exists
    const combinedHistory = [...mockExamHistory];

    // Add any additional records from localStorage that aren't in mock data
    history.forEach((record: ExamRecord) => {
      if (!combinedHistory.find((r) => r.examId === record.examId)) {
        combinedHistory.push(record);
      }
    });

    // Sort by date (newest first)
    combinedHistory.sort(
      (a, b) =>
        new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime()
    );

    setExamHistory(combinedHistory);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getExamTitle = (examId: string) => {
    const exam = mockExams.find((e) => e.id === examId);
    return exam ? exam.title : `Exam ${examId}`;
  };

  const getExamDescription = (examId: string) => {
    const exam = mockExams.find((e) => e.id === examId);
    return exam ? exam.description : "Custom exam";
  };

  const getWordCount = (text: string) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  };

  const calculateScore = (record: ExamRecord) => {
    // TOEIC Writing scoring: Part 1 (25 points), Part 2 (50 points), Part 3 (125 points) = 200 total
    let totalScore = 0;

    // Part 1: 5 points per answer (5 answers × 5 points = 25 points)
    const part1Score = record.part1Answers.reduce((score, answer) => {
      const wordCount = getWordCount(answer);
      if (wordCount >= 8 && wordCount <= 15) return score + 5; // Ideal length
      if (wordCount >= 5 && wordCount <= 20) return score + 4; // Good length
      if (wordCount >= 3) return score + 3; // Acceptable
      return score + 1; // Too short
    }, 0);

    // Part 2: 25 points per answer (2 answers × 25 points = 50 points)
    const part2Score = record.part2Answers.reduce((score, answer) => {
      const wordCount = getWordCount(answer);
      if (wordCount >= 80 && wordCount <= 120) return score + 25; // Ideal length
      if (wordCount >= 60 && wordCount <= 140) return score + 22; // Good length
      if (wordCount >= 40) return score + 18; // Acceptable
      return score + 10; // Too short
    }, 0);

    // Part 3: 125 points for essay
    const part3WordCount = getWordCount(record.part3Answer);
    let part3Score = 0;
    if (part3WordCount >= 300) part3Score = 125; // Ideal length
    else if (part3WordCount >= 250) part3Score = 110; // Good length
    else if (part3WordCount >= 200) part3Score = 95; // Acceptable
    else if (part3WordCount >= 150) part3Score = 75; // Below target
    else part3Score = 50; // Too short

    totalScore = part1Score + part2Score + part3Score;
    return Math.min(totalScore, 200); // Cap at 200
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Essays</h1>
          <p className="text-gray-600">
            Review all your completed writing exercises and track your progress
          </p>
        </div>

        {examHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg border border-gray-200 p-12 max-w-md mx-auto">
              <p className="text-gray-500 text-lg mb-4">
                No essays written yet.
              </p>
              <p className="text-gray-400 mb-6">
                Start taking exams to see your writing history here.
              </p>
              <Link href="/">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Take Your First Exam
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examHistory.map((record, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow h-full flex flex-col"
              >
                <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">
                      {getExamTitle(record.examId)}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600 text-xs"
                    >
                      Completed
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {getExamDescription(record.examId)}
                  </CardDescription>
                  <div className="mt-2 text-xs text-gray-500">
                    Taken on {formatDate(record.dateTaken)} •{" "}
                    {calculateScore(record)}/200
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={`/history/${record.examId}`} className="block">
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
