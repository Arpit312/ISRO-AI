import Pipeline from "@/components/pipeline/Pipeline";

export const metadata = {
  title: "Pipeline | NOVA-SYNC",
  description: "AI Processing Pipeline for NOVA-SYNC Earth Observation Platform",
};

export default function PipelinePage() {
  return (
    <div className="pt-24 pb-16">
      <Pipeline />
    </div>
  );
}
