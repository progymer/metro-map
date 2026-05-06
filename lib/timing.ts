import { Segment } from "@/lib/bfs";

const calculateTime = (segments: Segment[], transfers: number): number => {
  let totalTime = 0;

  for (const segment of segments) {
    const stops = segment.stations.length - 1;
    totalTime += stops * (segment.line === "line1" ? 2.3 : 2);
  }

  totalTime += transfers * 5;
  return Math.round(totalTime);
};

export default calculateTime;
