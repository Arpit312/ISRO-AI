import Dashboard from "@/components/dashboard/Dashboard";

export const metadata = {
  title: "Dashboard | NOVA-SYNC",
  description: "Analytics and Mission Control Dashboard for NOVA-SYNC",
};

export default function DashboardPage() {
  return (
    <div className="pt-24 pb-16">
      <Dashboard />
    </div>
  );
}
