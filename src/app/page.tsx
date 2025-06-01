"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingCard, LoadingSpinner } from "@/components/ui/loading";
import { useTests } from "@/hooks/useTests";
import Link from "next/link";

export default function ExamListPage() {
  const { tests, loading, error, refetch } = useTests();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Available Exams
            </h1>
            <p className="text-gray-600">
              Choose an exam to start practicing your TOEIC Writing skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Available Exams
            </h1>
            <p className="text-gray-600">
              Choose an exam to start practicing your TOEIC Writing skills
            </p>
          </div>
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Exams
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={refetch}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Exams
          </h1>
          <p className="text-gray-600">
            Choose an exam to start practicing your TOEIC Writing skills
          </p>
        </div>

        {tests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No exams available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <Card
                key={test.id}
                className="hover:shadow-md transition-shadow h-full flex flex-col"
              >
                <CardHeader className="flex-grow">
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={`/exam/${test.id}/part1`} className="block">
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      Start Exam
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
