import { ExamDetailPageClient } from "@/app/history/[id]/exam-detail-client";

export default async function ExamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return <ExamDetailPageClient examId={id} />;
}
