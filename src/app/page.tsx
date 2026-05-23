import { DashboardHeader } from "@/components/dashboard/header";
import { StatCards } from "@/components/dashboard/stat-cards";
import { PM2Panel } from "@/components/dashboard/pm2-panel";
import { DockerPanel } from "@/components/dashboard/docker-panel";
import { EvalScoresPanel } from "@/components/dashboard/eval-scores-panel";
import { NextStepsPanel } from "@/components/dashboard/next-steps-panel";
import { IncomeRoadmapPanel } from "@/components/dashboard/income-roadmap-panel";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="mx-auto w-full max-w-screen-2xl flex-1 space-y-4 px-4 py-6 sm:px-6">
        <StatCards />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <PM2Panel />
          </div>
          <div className="xl:col-span-5">
            <DockerPanel />
          </div>
        </div>

        <EvalScoresPanel />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <NextStepsPanel />
          </div>
          <div className="xl:col-span-7">
            <IncomeRoadmapPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
