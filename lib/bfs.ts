import { edges } from "@/data/edges";
import { Line } from "@/data/stations";


export type Step = {
  stationId: string;
  line: Line | null; 
};

export type Segment = {
  line: Line;
  stations: string[]; 
};

export type RouteResult = {
  found: boolean;
  segments: Segment[]; 
  totalStops: number;
  transfers: number;
};

const TRANSFER_PENALTY = 2.5;


type Neighbor = { id: string; line: Line };
type AdjacencyList = Record<string, Neighbor[]>;

function buildAdjacencyList(): AdjacencyList {
  const adj: AdjacencyList = {};

  for (const edge of edges) {
    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];

    adj[edge.from].push({ id: edge.to, line: edge.line });
    adj[edge.to].push({ id: edge.from, line: edge.line });
  }

  return adj;
}

type QueueItem = {
  path: Step[];
  cost: number;
  transfers: number;
  currentLine: Line | null;
};



function bfs(originId: string, destinationId: string): Step[] | null {
  const adj = buildAdjacencyList();

  const queue: QueueItem[] = [
    {
      path: [{ stationId: originId, line: null }],
      cost: 0,
      transfers: 0,
      currentLine: null,
    },
  ];

  const bestCost: Record<string, number> = { [originId]: 0 };

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost);
    const { path, cost, transfers, currentLine } = queue.shift()!;
    const current = path[path.length - 1];

    if (current.stationId === destinationId) {
      return path;
    }

    for (const neighbor of adj[current.stationId] ?? []) {
      const isTransfer = currentLine !== null && neighbor.line !== currentLine;
      const newCost = cost + 1 + (isTransfer ? TRANSFER_PENALTY : 0);

      if (
        bestCost[neighbor.id] === undefined ||
        newCost < bestCost[neighbor.id]
      ) {
        bestCost[neighbor.id] = newCost;
        queue.push({
          path: [...path, { stationId: neighbor.id, line: neighbor.line }],
          cost: newCost,
          transfers: transfers + (isTransfer ? 1 : 0),
          currentLine: neighbor.line,
        });
      }
    }
  }

  return null;
}


function groupIntoSegments(path: Step[]): Segment[] {
  const segments: Segment[] = [];
  let currentSegment: Segment | null = null;

  for (const step of path) {
    if (step.line === null) {
      currentSegment = null;
      continue;
    }

    if (!currentSegment || currentSegment.line !== step.line) {
      const prevStation = path[path.indexOf(step) - 1]?.stationId;

      currentSegment = {
        line: step.line,
        stations: prevStation
          ? [prevStation, step.stationId]
          : [step.stationId],
      };
      segments.push(currentSegment);
    } else {
      currentSegment.stations.push(step.stationId);
    }
  }

  return segments;
}


export function findRoute(
  originId: string,
  destinationId: string,
): RouteResult {
  if (originId === destinationId) {
    return { found: false, segments: [], totalStops: 0, transfers: 0 };
  }

  const path = bfs(originId, destinationId);

  if (!path) {
    return { found: false, segments: [], totalStops: 0, transfers: 0 };
  }

  const segments = groupIntoSegments(path);

  return {
    found: true,
    segments,
    totalStops: path.length - 1,
    transfers: segments.length - 1,
  };
}
