"use client";

import { useMemo, useState } from "react";

type AgentLogEntry = {
  id: string;
  type: "goal" | "thought" | "action" | "observation" | "result" | "info" | "error";
  message: string;
  depth: number;
  timestamp: string;
};

type AgentRun = {
  goal: string;
  steps: AgentLogEntry[];
  conclusion: string;
  iterations: number;
  depthReached: number;
  usedModel: boolean;
  metadata: {
    startedAt: string;
    finishedAt: string;
    durationMs: number;
  };
};

type AgentResponse = {
  status: "ok";
  run: AgentRun;
};

const DEFAULT_GOAL =
  "Research and outline a practical weekend plan for learning the basics of Rust, including resources and checkpoints.";

const typeLabels: Record<AgentLogEntry["type"], string> = {
  goal: "Goal",
  thought: "Thought",
  action: "Action",
  observation: "Observation",
  result: "Result",
  info: "Info",
  error: "Error",
};

const typeStyles: Record<AgentLogEntry["type"], string> = {
  goal: "bg-indigo-500/20 text-indigo-100 border-indigo-400/60",
  thought: "bg-sky-500/15 text-sky-100 border-sky-400/50",
  action: "bg-emerald-500/15 text-emerald-100 border-emerald-400/50",
  observation: "bg-amber-500/15 text-amber-100 border-amber-400/50",
  result: "bg-purple-500/15 text-purple-100 border-purple-400/50",
  info: "bg-slate-500/15 text-slate-100 border-slate-400/40",
  error: "bg-rose-500/20 text-rose-100 border-rose-400/60",
};

export default function Home() {
  const [goal, setGoal] = useState(DEFAULT_GOAL);
  const [maxDepth, setMaxDepth] = useState(3);
  const [maxIterations, setMaxIterations] = useState(12);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [run, setRun] = useState<AgentRun | null>(null);

  const durationSeconds = useMemo(() => {
    if (!run) return null;
    return Math.round(run.metadata.durationMs) / 1000;
  }, [run]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!goal.trim()) {
      setError("Enter a goal to get started.");
      return;
    }

    setIsRunning(true);
    setError(null);
    setRun(null);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal, maxDepth, maxIterations }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(payload?.message ?? "Failed to run agent");
      }

      const payload = (await response.json()) as AgentResponse;
      setRun(payload.run);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-10 sm:px-10">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Agentic Playground
          </p>
          <h1 className="text-4xl font-semibold sm:text-5xl">Self-Calling AI Agent</h1>
          <p className="max-w-2xl text-lg text-zinc-300">
            Launch an autonomous reasoning loop that decomposes goals into subtasks, solves them
            recursively, and synthesizes a final answer. Tune depth and iteration limits to guide how
            aggressively the agent calls itself.
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-zinc-200" htmlFor="goal">
              Goal
            </label>
            <textarea
              id="goal"
              className="h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-base text-zinc-100 outline-none transition focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
              placeholder="What should the agent accomplish?"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              disabled={isRunning}
            />

            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-300">
                  <span>Max depth</span>
                  <span className="font-semibold text-zinc-100">{maxDepth}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={maxDepth}
                  onChange={(event) => setMaxDepth(Number(event.target.value))}
                  disabled={isRunning}
                />
                <p className="text-xs text-zinc-400">
                  Controls how many levels deep the agent can spawn child tasks.
                </p>
              </div>

              <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-300">
                  <span>Max iterations</span>
                  <span className="font-semibold text-zinc-100">{maxIterations}</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={32}
                  step={1}
                  value={maxIterations}
                  onChange={(event) => setMaxIterations(Number(event.target.value))}
                  disabled={isRunning}
                />
                <p className="text-xs text-zinc-400">
                  Caps the total number of reasoning cycles to prevent runaway recursion.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-2xl bg-emerald-500/90 px-5 py-3 text-base font-semibold text-emerald-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 disabled:cursor-not-allowed disabled:bg-emerald-500/40 sm:w-auto"
                disabled={isRunning}
              >
                {isRunning ? "Running agent..." : "Run agent"}
              </button>

              <div className="flex flex-1 flex-wrap gap-2 text-sm text-zinc-400">
                <button
                  type="button"
                  onClick={() => setGoal("Plan a remote team onboarding experience for a new engineer joining next week.")}
                  className="rounded-full border border-white/10 px-3 py-1 hover:border-emerald-400/50 hover:text-zinc-100"
                  disabled={isRunning}
                >
                  Team onboarding
                </button>
                <button
                  type="button"
                  onClick={() => setGoal("Design a marketing launch plan for a productivity app targeting graduate students.")}
                  className="rounded-full border border-white/10 px-3 py-1 hover:border-emerald-400/50 hover:text-zinc-100"
                  disabled={isRunning}
                >
                  Launch plan
                </button>
                <button
                  type="button"
                  onClick={() => setGoal("Outline a 7-day fitness challenge for someone working from home with limited equipment.")}
                  className="rounded-full border border-white/10 px-3 py-1 hover:border-emerald-400/50 hover:text-zinc-100"
                  disabled={isRunning}
                >
                  Fitness sprint
                </button>
              </div>
            </div>
          </form>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
            {error}
          </div>
        )}

        {run && (
          <section className="space-y-4 rounded-3xl border border-white/10 bg-white/2 p-6">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">Summary</p>
                <h2 className="text-2xl font-semibold text-zinc-100">Conclusion</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                <span className="rounded-full border border-white/10 px-3 py-1">Iterations: {run.iterations}</span>
                <span className="rounded-full border border-white/10 px-3 py-1">Depth reached: {run.depthReached}</span>
                {durationSeconds !== null && (
                  <span className="rounded-full border border-white/10 px-3 py-1">{durationSeconds.toFixed(2)}s</span>
                )}
                <span className="rounded-full border border-white/10 px-3 py-1">
                  {run.usedModel ? "Model-assisted" : "Heuristic-only"}
                </span>
              </div>
            </header>
            <p className="text-base leading-7 text-zinc-200">
              {run.conclusion}
            </p>

            <div className="space-y-3">
              <h3 className="text-sm uppercase tracking-[0.3em] text-zinc-400">Reasoning trace</h3>
              <ul className="space-y-2">
                {run.steps.map((entry) => (
                  <li
                    key={entry.id}
                    className={`relative overflow-hidden rounded-2xl border px-4 py-3 text-sm transition ${typeStyles[entry.type]}`}
                    style={{ marginLeft: `${entry.depth * 1.25}rem` }}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-200/80">
                        <span>{typeLabels[entry.type]}</span>
                        <span className="font-mono text-[10px] text-zinc-300/70">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm leading-6 text-zinc-50/90">{entry.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {!run && !isRunning && !error && (
          <section className="rounded-3xl border border-white/10 bg-white/2 p-6 text-sm text-zinc-300">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-400">How it works</h3>
            <p className="mt-2 leading-7">
              The agent performs a depth-limited search. For each task it decides whether to decompose the
              problem into subtasks or solve it directly. Completed subtasks are fed back into the context so the
              agent can call itself recursively until the goal is met or limits are reached.
            </p>
            <p className="mt-2 leading-7">
              Provide an <span className="font-medium text-zinc-100">OpenAI API key</span> as an environment variable named
              <code className="mx-1 rounded bg-black/40 px-1.5 py-0.5 text-xs text-emerald-200">OPENAI_API_KEY</code> to unlock
              richer reasoning. Without it, the agent falls back to a deterministic heuristic flow.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
