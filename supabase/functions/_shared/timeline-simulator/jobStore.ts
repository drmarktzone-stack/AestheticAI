import type { MilestoneId, TimelineJob } from "./schema.ts";
import { MILESTONE_ORDER } from "./schema.ts";

/** In-memory job store — swap for Supabase table in production multi-instance deploy */
const jobs = new Map<string, TimelineJob>();

export function saveJob(job: TimelineJob): void {
  jobs.set(job.jobId, job);
}

export function getJob(jobId: string): TimelineJob | undefined {
  return jobs.get(jobId);
}

export function updateJob(
  jobId: string,
  patch: Partial<TimelineJob> | ((current: TimelineJob) => TimelineJob),
): TimelineJob | undefined {
  const current = jobs.get(jobId);
  if (!current) return undefined;
  const next = typeof patch === "function" ? patch(current) : { ...current, ...patch };
  next.updatedAt = new Date().toISOString();
  jobs.set(jobId, next);
  return next;
}

export function computeProgress(job: TimelineJob): number {
  const done = job.milestones.filter((m) => m.status === "succeeded").length;
  const failed = job.milestones.filter((m) => m.status === "failed").length;
  const processing = job.milestones.filter((m) => m.status === "processing").length;
  const base = (done / job.milestones.length) * 100;
  const partial = processing > 0 ? 8 : 0;
  return Math.min(100, Math.round(base + partial - failed * 5));
}

export function aggregateStatus(job: TimelineJob): TimelineJob["status"] {
  const statuses = job.milestones.map((m) => m.status);
  if (statuses.every((s) => s === "succeeded")) return "completed";
  if (statuses.some((s) => s === "failed") && statuses.every((s) => s === "failed" || s === "succeeded")) {
    return statuses.some((s) => s === "succeeded") ? "partial" : "failed";
  }
  if (statuses.some((s) => s === "processing" || s === "queued")) return "processing";
  return "queued";
}

export function nextQueuedMilestone(job: TimelineJob): MilestoneId | null {
  for (const id of MILESTONE_ORDER) {
    const m = job.milestones.find((x) => x.id === id);
    if (m?.status === "queued") return id;
  }
  return null;
}
