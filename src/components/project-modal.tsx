"use client";

import { useEffect, useId, useState } from "react";
import { DemoPreview } from "@/components/demo-preview";
import type { Project } from "@/data/projects";

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const titleId = useId();
  const [activeTab, setActiveTab] = useState(0);
  const screen = project.screens[activeTab] ?? project.screens[0];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-indigo-300 uppercase">
              Product demo
            </p>
            <h2
              id={titleId}
              className="mt-1 text-2xl font-semibold tracking-tight text-zinc-50"
            >
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-50"
          >
            Close
          </button>
        </div>

        <div className="space-y-6 px-5 py-5 sm:px-6">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {project.screens.map((tab, index) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition ${
                    index === activeTab
                      ? "bg-indigo-500 text-white"
                      : "border border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {screen ? <DemoPreview kind={screen.kind} /> : null}
          </div>

          <section>
            <h3 className="text-sm font-medium text-zinc-200">
              Problem statement
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {project.problem}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-medium text-zinc-200">Key metrics</h3>
            <dl className="mt-3 grid grid-cols-3 gap-3">
              {project.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-3"
                >
                  <dt className="text-[11px] tracking-wide text-zinc-500 uppercase">
                    {metric.label}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-zinc-50">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white"
          >
            View GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
