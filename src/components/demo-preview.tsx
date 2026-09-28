import type { ReactNode } from "react";
import type { DemoKind } from "@/data/projects";

function WindowChrome({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-950 shadow-inner">
      <div className="flex items-center gap-1.5 border-b border-zinc-800 px-3 py-2">
        <span className="size-2 rounded-full bg-zinc-700" />
        <span className="size-2 rounded-full bg-zinc-700" />
        <span className="size-2 rounded-full bg-zinc-700" />
        <span className="ml-3 h-4 flex-1 rounded-md bg-zinc-800/80" />
      </div>
      <div className="min-h-[220px] p-4">{children}</div>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="space-y-3">
      <div className="max-w-[85%] rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs leading-5 text-zinc-400">
        Synthesize last week’s interviews on onboarding drop-off. Flag
        disagreements.
      </div>
      <div className="ml-auto max-w-[90%] rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs leading-5 text-zinc-200">
        Three of five PMs want a guided first run. Support tickets cluster on
        “invite teammates.” Cite: INT-12, INT-18.
      </div>
      <div className="flex gap-2">
        <span className="rounded bg-zinc-800 px-2 py-1 text-[10px] text-indigo-300">
          INT-12
        </span>
        <span className="rounded bg-zinc-800 px-2 py-1 text-[10px] text-indigo-300">
          INT-18
        </span>
      </div>
    </div>
  );
}

function SourcesPreview() {
  return (
    <div className="space-y-2">
      {[
        ["INT-12", "Onboarding diary study", "High"],
        ["INT-18", "Support ticket cluster", "High"],
        ["NPS-04", "Q3 survey comments", "Med"],
      ].map(([id, name, weight]) => (
        <div
          key={id}
          className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
        >
          <div>
            <p className="font-mono text-[11px] text-indigo-300">{id}</p>
            <p className="text-xs text-zinc-300">{name}</p>
          </div>
          <span className="text-[10px] tracking-wide text-zinc-500 uppercase">
            {weight}
          </span>
        </div>
      ))}
    </div>
  );
}

function MatrixPreview() {
  return (
    <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-zinc-500">
        Option
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-zinc-500">
        Speed
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-zinc-500">
        Risk
      </div>
      {["Guided tour", "High", "Low", "Empty states", "Med", "Med"].map(
        (cell, i) => (
          <div
            key={`${cell}-${i}`}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-zinc-200"
          >
            {cell}
          </div>
        ),
      )}
    </div>
  );
}

function EditorPreview() {
  return (
    <div className="space-y-2 font-mono text-[11px] leading-5">
      <p className="text-zinc-500">system · v14</p>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-zinc-300">
        You are a product critic. Score the draft for clarity, then propose one
        tighter headline.
      </div>
      <div className="flex gap-2">
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
          temperature 0.2
        </span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
          gpt-4.1
        </span>
      </div>
    </div>
  );
}

function EvalsPreview() {
  return (
    <div className="space-y-2 text-xs">
      {[
        ["Clarity", "0.91", "pass"],
        ["Grounding", "0.84", "pass"],
        ["Tone", "0.61", "watch"],
      ].map(([name, score, status]) => (
        <div
          key={name}
          className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
        >
          <span className="text-zinc-300">{name}</span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-zinc-100">{score}</span>
            <span
              className={
                status === "pass"
                  ? "text-emerald-400"
                  : "text-amber-300"
              }
            >
              {status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DiffPreview() {
  return (
    <div className="grid grid-cols-2 gap-2 text-[11px] leading-5">
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-red-200/80">
        − Write a friendly onboarding email.
      </div>
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-200/90">
        + Write a 90-word onboarding email. Lead with the invite action.
      </div>
    </div>
  );
}

function FeedPreview() {
  return (
    <div className="space-y-2 text-xs">
      {[
        ["Intercom", "Can’t invite teammates from mobile"],
        ["Twitter", "Competitor launched shared workspaces"],
        ["Sales call", "Enterprise wants SSO before trial"],
      ].map(([source, text]) => (
        <div
          key={text}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
        >
          <p className="text-[10px] tracking-wide text-indigo-300 uppercase">
            {source}
          </p>
          <p className="mt-1 text-zinc-300">{text}</p>
        </div>
      ))}
    </div>
  );
}

function ChartPreview() {
  return (
    <div className="flex h-40 items-end gap-3 px-2">
      {[72, 48, 91, 36, 58].map((h, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-indigo-400/80"
            style={{ height: `${h}%` }}
          />
          <span className="text-[10px] text-zinc-500">T{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

function RankPreview() {
  return (
    <div className="space-y-2 text-xs">
      {[
        ["01", "Mobile teammate invites", "92"],
        ["02", "SSO for trial", "81"],
        ["03", "Shared workspaces", "67"],
      ].map(([rank, idea, score]) => (
        <div
          key={rank}
          className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2"
        >
          <span className="font-mono text-zinc-500">{rank}</span>
          <span className="flex-1 text-zinc-200">{idea}</span>
          <span className="font-mono text-indigo-300">{score}</span>
        </div>
      ))}
    </div>
  );
}

const previews: Record<DemoKind, () => ReactNode> = {
  chat: ChatPreview,
  sources: SourcesPreview,
  matrix: MatrixPreview,
  editor: EditorPreview,
  evals: EvalsPreview,
  diff: DiffPreview,
  feed: FeedPreview,
  chart: ChartPreview,
  rank: RankPreview,
};

export function DemoPreview({ kind }: { kind: DemoKind }) {
  const Preview = previews[kind];
  return (
    <WindowChrome>
      <Preview />
    </WindowChrome>
  );
}
