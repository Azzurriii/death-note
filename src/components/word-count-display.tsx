interface WordCountDisplayProps {
  text: string;
}

export function WordCountDisplay({ text }: WordCountDisplayProps) {
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  return <div className="text-sm text-gray-500">Word count: {wordCount}</div>;
}
