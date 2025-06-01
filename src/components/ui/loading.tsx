import { Card, CardContent, CardHeader } from "./card";

export function LoadingCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </CardContent>
    </Card>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}
