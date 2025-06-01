/**
 *
 * @param scores - an array of scores (q1, q2, q3, q4, q5, q6, q7, q8)
 * @returns - a number between 0 and 200
 */
export function calculateToeicWritingScore(scores: number[]): number {
  // Check if the array has exactly 8 elements
  if (scores.length !== 8) {
    throw new Error("The scores array must contain exactly 8 elements.");
  }

  // Check if the scores are within the valid range
  const [q1, q2, q3, q4, q5, q6, q7, q8] = scores;
  const part1Scores = [q1, q2, q3, q4, q5];
  const part2Scores = [q6, q7];
  const part3Score = q8;

  // Check if the scores are within the valid range
  for (const score of part1Scores) {
    if (!Number.isInteger(score) || score < 0 || score > 3) {
      throw new Error("The scores must be integers between 0 and 3.");
    }
  }

  // Check if the scores are within the valid range
  for (const score of part2Scores) {
    if (!Number.isInteger(score) || score < 0 || score > 4) {
      throw new Error("The score must be an integer between 0 and 4.");
    }
  }

  // Check if the scores are within the valid range
  if (!Number.isInteger(part3Score) || part3Score < 0 || part3Score > 5) {
    throw new Error("The score must be an integer between 0 and 5.");
  }

  // Calculate the weighted raw score
  const RS1 = part1Scores.reduce((sum, score) => sum + score, 0); // Part 1
  const RS2 = part2Scores.reduce((sum, score) => sum + score, 0); // Part 2
  const RS3 = part3Score; // Part 3

  const w1 = 0.4; // Weight for Part 1
  const w2 = 0.8; // Weight for Part 2
  const w3 = 1.2; // Weight for Part 3
  const k = 0.3; // Adjustment factor for the slope
  const b = 10; // Adjustment constant

  const weightedRawScore = w1 * RS1 + w2 * RS2 + w3 * RS3;
  const exponent = -k * (weightedRawScore - b);

  // Calculate the scaled score using the logistic function
  const scaledScore = 200 / (1 + Math.exp(exponent));

  // Round to the nearest 10 (according to ETS)
  return Math.round(scaledScore / 10) * 10;
}
