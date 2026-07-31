import { cn } from "@/lib/utils";
import { stepLabels } from "./types";

export function StepIndicator({
  currentStep,
  onStepClick,
  goToStep,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
  goToStep: number;
}) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {stepLabels.map((label, i) => (
        <button
          key={label}
          onClick={() => i <= goToStep && onStepClick(i)}
          disabled={i > goToStep}
          className={cn(
            "group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide transition-all",
            i === currentStep &&
              "bg-[var(--cedar)] text-white shadow-sm",
            i < currentStep &&
              "bg-[var(--mist)] text-[var(--cedar)] hover:bg-[var(--cedar)]/15 cursor-pointer",
            i > currentStep &&
              "bg-[var(--linen)] text-[var(--ash)] cursor-default"
          )}
        >
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
              i === currentStep && "bg-white/20",
              i < currentStep && "bg-[var(--cedar)]/10",
              i > currentStep && "bg-[var(--slate)]/50"
            )}
          >
            {i < currentStep ? "✓" : i + 1}
          </span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
