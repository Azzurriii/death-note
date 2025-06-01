"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { testService } from "@/services/testService";
import { TestCreateDTO } from "@/types/test";

export default function AddExamPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [examTitle, setExamTitle] = useState("");
  const [examDescription, setExamDescription] = useState("");

  const [part1Questions, setPart1Questions] = useState<
    Array<{ title: string; imageUrl: string; word1: string; word2: string }>
  >(
    Array(5)
      .fill(null)
      .map((_, index) => ({
        title: `Task 1 - Question ${index + 1}`,
        imageUrl: "",
        word1: "",
        word2: "",
      }))
  );

  const [part2Questions, setPart2Questions] = useState<
    Array<{ title: string; prompt: string }>
  >([
    { title: "Task 2 - Question 6: Respond to an Email", prompt: "" },
    { title: "Task 2 - Question 7: Respond to an Email", prompt: "" },
  ]);

  const [part3Question, setPart3Question] = useState({
    title: "Task 3 - Question 8: Opinion Essay",
    prompt: "",
  });

  // Check authentication status first
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // User is not logged in, redirect to login
      router.push("/login");
    } else {
      // User is logged in, allow access
      setIsAuthenticating(false);
    }
  }, [router]);

  // Show loading while checking authentication
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handlePart1Change = (
    index: number,
    field: "title" | "imageUrl" | "word1" | "word2",
    value: string
  ) => {
    const newQuestions = [...part1Questions];
    newQuestions[index][field] = value;
    setPart1Questions(newQuestions);
  };

  const handlePart2Change = (
    index: number,
    field: "title" | "prompt",
    value: string
  ) => {
    const newQuestions = [...part2Questions];
    newQuestions[index][field] = value;
    setPart2Questions(newQuestions);
  };

  const handleSaveExam = async () => {
    if (!examTitle.trim()) {
      alert("Please enter an exam title");
      return;
    }

    if (!examDescription.trim()) {
      alert("Please enter an exam description");
      return;
    }

    // Validate Part 1 questions
    for (let i = 0; i < part1Questions.length; i++) {
      const q = part1Questions[i];
      if (!q.word1 || !q.word2) {
        alert(`Please enter both words for Question ${i + 1}`);
        return;
      }
    }

    // Validate Part 2 questions
    for (let i = 0; i < part2Questions.length; i++) {
      if (!part2Questions[i].prompt.trim()) {
        alert(`Please enter prompt for Email ${i + 1}`);
        return;
      }
    }

    // Validate Part 3 question
    if (!part3Question.prompt.trim()) {
      alert("Please enter the essay prompt");
      return;
    }

    setIsLoading(true);

    try {
      const testData: TestCreateDTO = {
        title: examTitle,
        description: examDescription,
        questions: [
          // Part 1 questions (1-5)
          ...part1Questions.map((q, index) => ({
            title: q.title,
            prompt:
              "Write ONE sentence based on the picture using the two words or phrases.",
            type: "sentence_picture" as const,
            order_in_test: index + 1,
            max_score: 5.0, // Default max score for sentence_picture questions
            image_url: q.imageUrl || undefined,
            given_word1: q.word1,
            given_word2: q.word2,
          })),
          // Part 2 questions (6-7)
          ...part2Questions.map((q, index) => ({
            title: q.title,
            prompt: q.prompt,
            type: "email_response" as const,
            order_in_test: index + 6,
            max_score: 10.0, // Default max score for email_response questions
          })),
          // Part 3 question (8)
          {
            title: part3Question.title,
            prompt: part3Question.prompt,
            type: "opinion_essay" as const,
            order_in_test: 8,
            max_score: 15.0, // Default max score for opinion_essay question
          },
        ],
      };

      const result = await testService.createTest(testData);
      alert(`Exam "${result.title}" created successfully!`);
      router.push("/");
    } catch (error) {
      console.error("Error creating exam:", error);
      alert(
        `Failed to create exam: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Exam
              </h1>
              <p className="text-sm text-gray-600">
                Design a custom TOEIC Writing exam
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <Badge variant="secondary" className="gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Step 1 of 1
            </Badge>
            <span className="text-sm text-gray-600">
              Complete all sections to save your exam
            </span>
          </div>

          {/* Basic Info */}
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                1. Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="examTitle" className="text-sm font-medium">
                  Exam Title *
                </Label>
                <Input
                  id="examTitle"
                  placeholder="e.g., TOEIC Writing Practice Test 001"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="h-11"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="examDescription"
                  className="text-sm font-medium"
                >
                  Description *
                </Label>
                <Textarea
                  id="examDescription"
                  placeholder="e.g., A complete TOEIC Writing practice test covering all tasks."
                  value={examDescription}
                  onChange={(e) => setExamDescription(e.target.value)}
                  className="min-h-[80px]"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Part 1 Questions */}
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                2. Part 1: Picture Description Questions (1-5)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create 5 questions with keywords and image URLs for students to
                describe
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {part1Questions.map((question, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 bg-white/50"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {index + 1}
                        </span>
                      </div>
                      <h4 className="font-semibold">Question {index + 1}</h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor={`q${index + 1}-title`}
                          className="text-sm font-medium"
                        >
                          Question Title
                        </Label>
                        <Input
                          id={`q${index + 1}-title`}
                          placeholder={`Task 1 - Question ${
                            index + 1
                          }: Scene Description`}
                          value={question.title}
                          onChange={(e) =>
                            handlePart1Change(index, "title", e.target.value)
                          }
                          className="mt-1"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor={`q${index + 1}-imageUrl`}
                          className="text-sm font-medium"
                        >
                          Image URL
                        </Label>
                        <Input
                          id={`q${index + 1}-imageUrl`}
                          placeholder="https://example.com/image.jpg"
                          value={question.imageUrl}
                          onChange={(e) =>
                            handlePart1Change(index, "imageUrl", e.target.value)
                          }
                          className="mt-1"
                          disabled={isLoading}
                        />
                        {question.imageUrl && (
                          <div className="mt-2">
                            <img
                              src={question.imageUrl}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label
                            htmlFor={`q${index + 1}-word1`}
                            className="text-sm font-medium"
                          >
                            Word 1 *
                          </Label>
                          <Input
                            id={`q${index + 1}-word1`}
                            placeholder="e.g., presentation"
                            value={question.word1}
                            onChange={(e) =>
                              handlePart1Change(index, "word1", e.target.value)
                            }
                            className="mt-1"
                            disabled={isLoading}
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor={`q${index + 1}-word2`}
                            className="text-sm font-medium"
                          >
                            Word 2 *
                          </Label>
                          <Input
                            id={`q${index + 1}-word2`}
                            placeholder="e.g., colleagues"
                            value={question.word2}
                            onChange={(e) =>
                              handlePart1Change(index, "word2", e.target.value)
                            }
                            className="mt-1"
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Part 2 Questions */}
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                3. Part 2: Email Response Tasks (6-7)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create 2 email scenarios for students to respond to
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {part2Questions.map((question, index) => (
                  <div
                    key={index}
                    className="space-y-4 p-6 border border-gray-200 rounded-xl bg-white/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {index + 6}
                        </span>
                      </div>
                      <h4 className="font-semibold">Email {index + 1}</h4>
                    </div>

                    <div>
                      <Label
                        htmlFor={`part2-title-${index + 1}`}
                        className="text-sm font-medium"
                      >
                        Question Title
                      </Label>
                      <Input
                        id={`part2-title-${index + 1}`}
                        placeholder={`Task 2 - Question ${
                          index + 6
                        }: Email Response`}
                        value={question.title}
                        onChange={(e) =>
                          handlePart2Change(index, "title", e.target.value)
                        }
                        className="mt-1"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`part2-prompt-${index + 1}`}
                        className="text-sm font-medium"
                      >
                        Email Scenario & Instructions *
                      </Label>
                      <Textarea
                        id={`part2-prompt-${index + 1}`}
                        placeholder={`Enter the email content and response instructions...`}
                        value={question.prompt}
                        onChange={(e) =>
                          handlePart2Change(index, "prompt", e.target.value)
                        }
                        className="min-h-[120px] resize-none mt-1"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Part 3 Question */}
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                4. Part 3: Opinion Essay Task (8)
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create an essay prompt for the final writing task
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="part3-title" className="text-sm font-medium">
                  Question Title
                </Label>
                <Input
                  id="part3-title"
                  placeholder="Task 3 - Question 8: Opinion Essay"
                  value={part3Question.title}
                  onChange={(e) =>
                    setPart3Question({
                      ...part3Question,
                      title: e.target.value,
                    })
                  }
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="part3-prompt" className="text-sm font-medium">
                  Essay Prompt *
                </Label>
                <Textarea
                  id="part3-prompt"
                  placeholder="Enter the essay topic, question, and any specific instructions..."
                  value={part3Question.prompt}
                  onChange={(e) =>
                    setPart3Question({
                      ...part3Question,
                      prompt: e.target.value,
                    })
                  }
                  className="min-h-[140px] resize-none mt-1"
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <Button
              size="lg"
              onClick={handleSaveExam}
              disabled={isLoading}
              className="gap-2 px-8 py-3 text-base"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isLoading ? "Creating Exam..." : "Create Exam"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
