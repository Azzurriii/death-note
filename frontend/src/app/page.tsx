import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const mockExams = [
  {
    id: "1",
    title: "Mock Test 1",
    description: "Practice test with standard TOEIC Writing format",
  },
  {
    id: "2",
    title: "October Sample Exam",
    description: "Official sample questions from October test",
  },
  {
    id: "3",
    title: "Advanced Practice Test",
    description: "Challenging questions for advanced learners",
  },
  {
    id: "4",
    title: "Business Writing Test",
    description: "Focus on professional communication skills",
  },
  {
    id: "5",
    title: "Academic Writing Test",
    description: "University-level writing exercises",
  },
  {
    id: "6",
    title: "Quick Practice Test",
    description: "Short format for quick skill assessment",
  },
];

export default function ExamListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
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
          {mockExams.map((exam) => (
            <Card
              key={exam.id}
              className="hover:shadow-md transition-shadow h-full flex flex-col"
            >
              <CardHeader className="flex-grow">
                <CardTitle className="text-lg">{exam.title}</CardTitle>
                <CardDescription className="text-sm">
                  {exam.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={`/exam/${exam.id}/part1`} className="block">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Start Exam
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
