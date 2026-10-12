import { useLayoutEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronDown, Search } from "lucide-react";
import { CATALOG } from "@/lib/circuit/catalog";
import { clientToGrid } from "@/lib/circuit/geometry";
import { useCircuit } from "@/lib/circuit/store";
import type { CompType } from "@/lib/circuit/types";
import { cn } from "@/lib/cn";
import { MiniSymbol } from "./symbols";

export function Sidebar() {
  const open = useCircuit((s) => s.sidebarOpen);
  const [armed, setArmed] = useState(false);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<Record<string, boolean>>({
    passives: true,
    sources: true,
    semiconductors: true,
  });
  useLayoutEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      useCircuit.getState().setSidebar(false);
    }
    setArmed(true);
  }, []);
  const q = query.trim().toLowerCase();
  const filtered = CATALOG.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) =>
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.keys.some((key) => key.includes(q)),
    ),
  })).filter((group) => group.items.length > 0);

  if (!open) return null;

  return (
    <aside
      className={cn(
        "z-20 flex w-64 shrink-0 flex-col border-r border-border bg-surface max-lg:absolute max-lg:inset-y-0 max-lg:left-0",
        !armed && "max-lg:hidden",
      )}
    >
      <div className="border-b border-border p-3">
        <label className="flex h-10 items-center gap-2 border border-border bg-bg px-2">
          <Search className="size-4 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parts"
            className="h-full w-full bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
            aria-label="Search parts"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-sm text-muted">No parts match.</p>
        ) : (
          filtered.map((group) => {
            const expanded = q ? true : groups[group.id] !== false;
            return (
              <section key={group.id} className="border-b border-border">
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-between px-3 text-left text-sm text-muted"
                  aria-expanded={expanded}
                  onClick={() => setGroups((prev) => ({ ...prev, [group.id]: !expanded }))}
                >
                  {group.label}
                  <ChevronDown className={cn("size-4 transition-transform duration-150", expanded ? "rotate-0" : "-rotate-90")} />
                </button>
                {expanded ? (
                  <ul className="pb-2">
                    {group.items.map((item) => (
                      <li key={item.type}>
                        <button
                          type="button"
                          draggable={false}
                          title="Drag onto the sheet"
                          onPointerDown={(e) => beginPlace(e, item.type)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-elevated"
                        >
                          <span className="grid h-11 w-12 shrink-0 place-items-center border border-border bg-bg">
                            <MiniSymbol type={item.type} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm text-fg">{item.name}</span>
                            <span className="block truncate font-mono text-xs text-muted">{item.hint}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })
        )}
      </div>
      <p className="border-t border-border px-3 py-3 text-xs text-muted">Drag a part onto the grid. Right-click it to edit.</p>
    </aside>
  );
}

function beginPlace(e: ReactPointerEvent, type: CompType) {
  if (e.button !== 0) return;
  e.preventDefault();
  const move = (ev: PointerEvent) => {
    const grid = clientToGrid(ev.clientX, ev.clientY);
    if (!grid) {
      useCircuit.setState({ placing: null });
      return;
    }
    const current = useCircuit.getState().placing;
    useCircuit.setState({
      placing: {
        type,
        x: grid.x,
        y: grid.y,
        rot: current?.type === type ? current.rot : 0,
      },
    });
  };
  const up = (ev: PointerEvent) => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    const grid = clientToGrid(ev.clientX, ev.clientY);
    const placing = useCircuit.getState().placing;
    useCircuit.setState({ placing: null });
    if (grid && placing) useCircuit.getState().place(placing.type, grid.x, grid.y, placing.rot);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
