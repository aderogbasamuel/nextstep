"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

type ActionItem = {
  id: number;
  analysisId: number;
  title: string;
  completed: boolean;
  position: number;
};

interface ActionPlanProps {
  analysisId: number;
  items: ActionItem[];
}

export default function ActionPlan({
  analysisId,
  items,
}: ActionPlanProps) {
  const [actionItems, setActionItems] = useState(items);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function toggleAction(item: ActionItem) {
    const newCompleted = !item.completed;

    // Optimistic UI update
    setActionItems((current) =>
      current.map((action) =>
        action.id === item.id
          ? { ...action, completed: newCompleted }
          : action
      )
    );

    setUpdatingId(item.id);

    try {
      const response = await fetch(
        `/api/analyses/${analysisId}/actions/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: newCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update action item");
      }
    } catch (error) {
      console.error("Failed to update action item:", error);

      // Roll back optimistic update
      setActionItems((current) =>
        current.map((action) =>
          action.id === item.id
            ? { ...action, completed: item.completed }
            : action
        )
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="grid gap-1">
      {actionItems.map((item) => {
        const isUpdating = updatingId === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleAction(item)}
            disabled={isUpdating}
            className="group flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-slate-50 disabled:cursor-wait"
          >
            {/* Checkbox */}
            <div
              className={`grid size-5 shrink-0 place-items-center rounded-full border transition ${
                item.completed
                  ? "border-blue-600 bg-blue-600"
                  : "border-slate-300 bg-white group-hover:border-slate-400"
              }`}
            >
              {isUpdating ? (
                <Loader2 className="size-3 animate-spin text-slate-400" />
              ) : item.completed ? (
                <Check
                  className="size-3 text-white"
                  strokeWidth={3}
                />
              ) : null}
            </div>

            {/* Task */}
            <span
              className={`text-sm transition ${
                item.completed
                  ? "text-slate-400 line-through"
                  : "text-slate-700"
              }`}
            >
              {item.title}
            </span>
          </button>
        );
      })}

      {actionItems.length === 0 && (
        <div className="py-8 text-center text-sm text-slate-400">
          No action items yet.
        </div>
      )}
    </div>
  );
}