import Link from "next/link";

export type ProjectStatus = "Live" | "In Progress" | "Architecture Spec";

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
  demoUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Closet Relay",
    description:
      "Circular fashion demo: buyers shop curated secondhand; sellers ship or drop off an entire closet and get a guaranteed post-intake payout with transparent platform, cleaning, and logistics fees. Listings are auto-managed; sellers track items and their statement in My closet.",
    techStack: [
      "Next.js",
      "React 19",
      "Two-sided marketplace",
      "Cart + localStorage",
      "Tailwind CSS",
    ],
    status: "Live",
    demoUrl: "/shop",
    githubUrl: "https://github.com/hswil/portfolio-mvp",
  },
  {
    title: "Daily Gambit",
    description:
      "One verified chess tactic each day in the Chess.com Daily Puzzle style: a calendar of today and past dates, hearts and a live clock that never resets on retry, and positions sourced from the Lichess public puzzle archive.",
    techStack: ["Next.js", "React 19", "chess.js", "Lichess Puzzles", "Tailwind CSS"],
    status: "Live",
    demoUrl: "/gambit",
    githubUrl: "https://github.com/hswil/daily-gambit",
  },
  {
    title: "Insight Copilot",
    description:
      "Turn messy research notes into product decisions with an AI teammate that cites sources and flags tradeoffs.",
    techStack: ["Next.js 15", "Claude 3.5 Sonnet", "Tailwind CSS", "Vercel AI SDK"],
    status: "Live",
    demoUrl: "https://insight-copilot.demo.app",
    githubUrl: "https://github.com/hswil/insight-copilot",
  },
  {
    title: "Prompt Studio",
    description:
      "Version, test, and ship prompt workflows with automated evals, side-by-side diffs, and regression suites.",
    techStack: ["React 19", "FastAPI", "Evals Engine", "PostgreSQL"],
    status: "In Progress",
    githubUrl: "https://github.com/hswil/prompt-studio",
  },
];

function getStatusBadge(status: ProjectStatus) {
  switch (status) {
    case "Live":
      return {
        pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
      };
    case "In Progress":
      return {
        pill: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
      };
    case "Architecture Spec":
      return {
        pill: "border-zinc-700/60 bg-zinc-800/70 text-zinc-400",
        dot: "bg-zinc-400",
      };
  }
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-zinc-950 font-sans text-zinc-50 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows and subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(99,102,241,0.2),_transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-20 sm:px-8 lg:py-28">
        {/* Hero Section */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-wide text-indigo-300">
            <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Product Manager & AI Systems
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-zinc-50 text-balance sm:text-6xl lg:text-7xl">
            AI Product Portfolio
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl text-pretty">
            Experiments and shipped products at the intersection of language
            models, product craft, and real user problems.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <section
          aria-label="Portfolio Projects"
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => {
            const badge = getStatusBadge(project.status);

            return (
              <article
                key={project.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/90 hover:shadow-2xl hover:shadow-indigo-500/5"
              >
                <div>
                  {/* Status Indicator Pill */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide ${badge.pill}`}
                    >
                      <span className={`size-1.5 rounded-full ${badge.dot}`} />
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="mt-5 text-xl font-semibold tracking-tight text-zinc-50 transition-colors group-hover:text-white">
                    {project.demoUrl ? (
                      <Link
                        href={project.demoUrl}
                        target={project.demoUrl.startsWith("http") ? "_blank" : undefined}
                        rel={project.demoUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1.5 hover:text-indigo-300 focus-visible:underline focus-visible:outline-none"
                      >
                        {project.title}
                        <svg
                          className="size-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    ) : (
                      project.title
                    )}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-zinc-800 bg-zinc-900/90 px-2 py-0.5 text-[11px] font-medium tracking-wide text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-7 flex flex-wrap items-center gap-2.5 border-t border-zinc-800/60 pt-5">
                  {project.demoUrl ? (
                    <Link
                      href={project.demoUrl}
                      target={project.demoUrl.startsWith("http") ? "_blank" : undefined}
                      rel={project.demoUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      <span>Live Demo</span>
                      <svg
                        className="size-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <span
                      aria-label="Demo coming soon"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-800 bg-zinc-900/40 px-3 py-1.5 text-xs font-medium text-zinc-500 select-none"
                    >
                      <span className="size-1.5 rounded-full bg-zinc-600" />
                      Demo Coming Soon
                    </span>
                  )}

                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
                    >
                      <span>View Code / Spec</span>
                      <svg
                        className="size-3.5 text-zinc-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
