interface TimerDisplayProps {
  timeRemaining: number;
  label: string;
}

export function TimerDisplay({ timeRemaining, label }: TimerDisplayProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const isLowTime = timeRemaining <= 60; // Last minute warning

  return (
    <div
      className={`text-lg font-bold ${
        isLowTime ? "text-red-600" : "text-gray-900"
      }`}
    >
      {label}: {formatTime(timeRemaining)}
    </div>
  );
}
