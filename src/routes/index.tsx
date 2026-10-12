import { createFileRoute } from "@tanstack/react-router";
import { VoltaApp } from "@/components/simulator/app";

type BenchSearch = { circuit?: string; mine?: string };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): BenchSearch => ({
    circuit: typeof search.circuit === "string" && search.circuit ? search.circuit : undefined,
    mine: search.mine === "1" || search.mine === "true" ? "1" : undefined,
  }),
  component: Home,
});

function Home() {
  const { circuit, mine } = Route.useSearch();
  return <VoltaApp circuitId={circuit || undefined} mine={mine === "1"} />;
}
