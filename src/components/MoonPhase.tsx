import { Moon } from "lucide-react";

interface MoonPhaseProps {
  phase: string;
  illumination: number;
  className?: string;
}

export const MoonPhase = ({ phase, illumination, className = "" }: MoonPhaseProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Moon className="w-8 h-8 text-muted-foreground" />
        <div 
          className="absolute top-0 left-0 w-8 h-8 bg-primary rounded-full opacity-30"
          style={{ 
            clipPath: `inset(0 ${100 - illumination}% 0 0)`,
          }}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{phase}</span>
        <span className="text-xs text-muted-foreground">{illumination}% Illuminated</span>
      </div>
    </div>
  );
};