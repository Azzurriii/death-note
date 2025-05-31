"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import {
  ExamRecord,
  mockExams,
  mockExamHistory,
  part1Questions,
  part2Prompts,
  part3Prompt,
} from "@/lib/mock-data";

export function ExamDetailPageClient({ examId }: { examId: string }) {
  const [examRecord, setExamRecord] = useState<ExamRecord | null>(null);

  useEffect(() => {
    // Load specific exam record from localStorage
    const history = JSON.parse(localStorage.getItem("examHistory") || "[]");
    let record = history.find((r: ExamRecord) => r.examId === examId);

    // If no record found in localStorage, check mock data
    if (!record) {
      record = mockExamHistory.find((r: ExamRecord) => r.examId === examId);
    }

    setExamRecord(record || null);
  }, [examId]);

  const getExamTitle = (examId: string) => {
    const exam = mockExams.find((e) => e.id === examId);
    return exam ? exam.title : `Exam ${examId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!examRecord) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Exam record not found.</p>
          <Link href="/history">
            <Button>Back to History</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Exam Details: {getExamTitle(examRecord.examId)}
            </h1>
            <p className="text-gray-600">
              Taken on {formatDate(examRecord.dateTaken)}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Part 1 Results */}
        <Card>
          <CardHeader>
            <CardTitle>Part 1: Writing a Sentence based on a Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {part1Questions.map((question, index) => (
              <div
                key={question.id}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <h4 className="font-semibold mb-3">
                  Question {question.id}: {question.keywords}
                </h4>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <Image
                    src={question.imageUrl || "/placeholder.svg"}
                    alt={`Question ${question.id} image`}
                    width={300}
                    height={200}
                    className="rounded border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Your Answer:
                    </p>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded border">
                      {examRecord.part1Answers[index] || "No answer provided"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    AI Feedback:
                  </p>
                  <Textarea
                    readOnly
                    value="Feedback will be provided after review by our AI system."
                    className="bg-blue-50 border-blue-200"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Part 2 Results */}
        <Card>
          <CardHeader>
            <CardTitle>Part 2: Responding to a Written Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {part2Prompts.map((prompt, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <h4 className="font-semibold mb-3">Email {index + 1}</h4>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Original Prompt:
                  </p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                    {prompt}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Your Answer:
                  </p>
                  <Textarea
                    readOnly
                    value={
                      examRecord.part2Answers[index] || "No answer provided"
                    }
                    className="min-h-[120px] bg-gray-50"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    AI Feedback:
                  </p>
                  <Textarea
                    readOnly
                    value="Feedback will be provided after review by our AI system."
                    className="bg-blue-50 border-blue-200"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Part 3 Results */}
        <Card>
          <CardHeader>
            <CardTitle>Part 3: Writing an Opinion Essay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Original Prompt:
              </p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                {part3Prompt}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Your Essay:
              </p>
              <Textarea
                readOnly
                value={examRecord.part3Answer || "No answer provided"}
                className="min-h-[300px] bg-gray-50"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                AI Feedback:
              </p>
              <Textarea
                readOnly
                value="Feedback will be provided after review by our AI system."
                className="bg-blue-50 border-blue-200"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
