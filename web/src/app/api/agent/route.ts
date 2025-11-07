import { NextResponse } from "next/server";
import { runSelfCallingAgent } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const goal = typeof payload.goal === "string" ? payload.goal.trim() : "";

    if (!goal) {
      return NextResponse.json({ message: "Goal is required" }, { status: 400 });
    }

    const maxDepth = Number(payload.maxDepth);
    const maxIterations = Number(payload.maxIterations);

    const run = await runSelfCallingAgent(goal, {
      maxDepth: Number.isFinite(maxDepth) ? maxDepth : undefined,
      maxIterations: Number.isFinite(maxIterations) ? maxIterations : undefined,
    });

    return NextResponse.json({ status: "ok", run });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
