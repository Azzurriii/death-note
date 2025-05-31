"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, X, ImageIcon, Save, ArrowLeft } from "lucide-react";

export default function AddExamPage() {
  const router = useRouter();
  const [examTitle, setExamTitle] = useState("");
  const [part1Questions, setPart1Questions] = useState<
    Array<{ keywords: string; imageFile: File | null; imagePreview: string }>
  >(
    Array(5)
      .fill(null)
      .map(() => ({ keywords: "", imageFile: null, imagePreview: "" }))
  );
  const [part2Prompts, setPart2Prompts] = useState(["", ""]);
  const [part3Prompt, setPart3Prompt] = useState("");

  const handlePart1Change = (
    index: number,
    field: "keywords",
    value: string
  ) => {
    const newQuestions = [...part1Questions];
    newQuestions[index][field] = value;
    setPart1Questions(newQuestions);
  };

  const handleImageUpload = (index: number, file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newQuestions = [...part1Questions];
        newQuestions[index].imageFile = file;
        newQuestions[index].imagePreview = e.target?.result as string;
        setPart1Questions(newQuestions);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newQuestions = [...part1Questions];
    newQuestions[index].imageFile = null;
    newQuestions[index].imagePreview = "";
    setPart1Questions(newQuestions);
  };

  const handlePart2Change = (index: number, value: string) => {
    const newPrompts = [...part2Prompts];
    newPrompts[index] = value;
    setPart2Prompts(newPrompts);
  };

  const handleSaveExam = () => {
    if (!examTitle.trim()) {
      alert("Please enter an exam title");
      return;
    }

    // Convert files to base64 for storage (in a real app, upload to cloud storage)
    const examData = {
      id: Date.now().toString(),
      title: examTitle,
      part1Questions: part1Questions.map((q) => ({
        keywords: q.keywords,
        imageData: q.imagePreview, // Store base64 data
      })),
      part2Prompts,
      part3Prompt,
      created: new Date().toISOString(),
    };

    const exams = JSON.parse(localStorage.getItem("customExams") || "[]");
    exams.push(examData);
    localStorage.setItem("customExams", JSON.stringify(exams));

    alert("Exam saved successfully!");
    router.push("/");
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
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Exam
              </h1>
              <p className="text-sm text-gray-600">
                Design a custom exam with multiple parts
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
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="examTitle" className="text-sm font-medium">
                  Exam Title *
                </Label>
                <Input
                  id="examTitle"
                  placeholder="e.g., IELTS Practice Test - Academic Module"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Part 1 Questions */}
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                2. Part 1: Image Description Questions
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create 5 questions with keywords and images for students to
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
                          htmlFor={`q${index + 1}-keywords`}
                          className="text-sm font-medium"
                        >
                          Keywords
                        </Label>
                        <Input
                          id={`q${index + 1}-keywords`}
                          placeholder="e.g., frame, but, however"
                          value={question.keywords}
                          onChange={(e) =>
                            handlePart1Change(index, "keywords", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Image</Label>
                        {question.imagePreview ? (
                          <div className="mt-2 relative">
                            <img
                              src={question.imagePreview || "/placeholder.svg"}
                              alt={`Question ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 h-8 w-8 p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "image/*";
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) handleImageUpload(index, file);
                              };
                              input.click();
                            }}
                          >
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload image
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Part 2 Prompts */}
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                3. Part 2: Email Writing Tasks
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create 2 email prompts for students to respond to
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {part2Prompts.map((prompt, index) => (
                  <div key={index} className="space-y-2">
                    <Label
                      htmlFor={`part2-prompt-${index + 1}`}
                      className="text-sm font-medium"
                    >
                      Email {index + 1} Prompt
                    </Label>
                    <Textarea
                      id={`part2-prompt-${index + 1}`}
                      placeholder={`Enter email ${
                        index + 1
                      } scenario and requirements...`}
                      value={prompt}
                      onChange={(e) => handlePart2Change(index, e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Part 3 Prompt */}
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                4. Part 3: Essay Writing Task
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create an essay prompt for the final writing task
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="part3-prompt" className="text-sm font-medium">
                  Essay Prompt
                </Label>
                <Textarea
                  id="part3-prompt"
                  placeholder="Enter the essay topic, requirements, and any specific instructions..."
                  value={part3Prompt}
                  onChange={(e) => setPart3Prompt(e.target.value)}
                  className="min-h-[140px] resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <Button
              size="lg"
              onClick={handleSaveExam}
              className="gap-2 px-8 py-3 text-base"
            >
              <Save className="w-5 h-5" />
              Save Exam
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
