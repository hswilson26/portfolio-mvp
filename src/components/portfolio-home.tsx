"use client";

import { useState } from "react";
import { ProjectModal } from "@/components/project-modal";
import { projects, type Project } from "@/data/projects";

export function PortfolioHome() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-zinc-950 text-zinc-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
      />

      <main className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-20 sm:px-8">
        <p className="mb-5 text-sm font-medium tracking-[0.2em] text-indigo-300 uppercase">
          Selected work
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          AI Product Portfolio
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 text-pretty">
          Experiments and shipped products at the intersection of language
          models, product craft, and real user problems.
        </p>

        <section className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 text-left shadow-xl shadow-black/20 backdrop-blur-sm transition hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-zinc-900"
            >
              <h2 className="text-xl font-semibold tracking-tight text-zinc-50">
                {project.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">
                {project.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium tracking-wide text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </section>
      </main>

      {selected ? (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
