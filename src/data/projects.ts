export type DemoKind =
  | "chat"
  | "sources"
  | "matrix"
  | "editor"
  | "evals"
  | "diff"
  | "feed"
  | "chart"
  | "rank";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  problem: string;
  github: string;
  metrics: { label: string; value: string }[];
  screens: { label: string; kind: DemoKind }[];
};

export const projects: Project[] = [
  {
    id: "insight-copilot",
    title: "Insight Copilot",
    description:
      "Turn messy research notes into product decisions with an AI teammate that cites sources and flags tradeoffs.",
    tags: ["Research", "LLM", "B2B"],
    problem:
      "Research teams buried insights in docs and Slack, so PMs spent hours reconstructing the case for a decision—and still shipped without a shared source of truth.",
    github: "https://github.com/hswil/insight-copilot",
    metrics: [
      { label: "Time to brief", value: "−62%" },
      { label: "Cited claims", value: "94%" },
      { label: "Weekly users", value: "180" },
    ],
    screens: [
      { label: "Brief", kind: "chat" },
      { label: "Sources", kind: "sources" },
      { label: "Tradeoffs", kind: "matrix" },
    ],
  },
  {
    id: "prompt-studio",
    title: "Prompt Studio",
    description:
      "Version, test, and ship prompt workflows with evals, side-by-side diffs, and a library your team can actually reuse.",
    tags: ["Evals", "Developer tools"],
    problem:
      "Prompts lived in random files with no evals, so model upgrades silently broke product copy and nobody could tell which version was production.",
    github: "https://github.com/hswil/prompt-studio",
    metrics: [
      { label: "Eval coverage", value: "87%" },
      { label: "Regressions caught", value: "41" },
      { label: "Ship cycle", value: "3.2d" },
    ],
    screens: [
      { label: "Editor", kind: "editor" },
      { label: "Evals", kind: "evals" },
      { label: "Diff", kind: "diff" },
    ],
  },
  {
    id: "launch-radar",
    title: "Launch Radar",
    description:
      "Spot signal in customer chatter and market noise so you know which ideas are worth shipping next.",
    tags: ["Analytics", "Product ops"],
    problem:
      "Feedback arrived from five channels with no ranking, so the roadmap followed whoever shouted loudest instead of the problems with the strongest signal.",
    github: "https://github.com/hswil/launch-radar",
    metrics: [
      { label: "Signal precision", value: "4.1×" },
      { label: "Themes tracked", value: "26" },
      { label: "Shipped bets", value: "9" },
    ],
    screens: [
      { label: "Feed", kind: "feed" },
      { label: "Themes", kind: "chart" },
      { label: "Ranking", kind: "rank" },
    ],
  },
];
