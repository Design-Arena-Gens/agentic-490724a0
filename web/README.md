# Self-Calling Agent

Autonomous recursive planner built with Next.js. Provide a goal and the agent decomposes it into subtasks, calls itself to handle each branch, and synthesizes a final answer. Works out-of-the-box with a heuristic engine and can optionally leverage OpenAI for richer reasoning.

## Prerequisites

- Node 18+
- npm
- *(Optional)* `OPENAI_API_KEY` environment variable for high quality completions

## Local Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to interact with the agent.

## Configuration

Create a `.env.local` file when you want model-backed reasoning:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini # optional override
```

Without a key, the agent falls back to a deterministic strategy that still demonstrates recursive self-calling behaviour.

## Deployment

The project is optimized for Vercel. After setting environment variables in the Vercel dashboard, deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-490724a0
```
