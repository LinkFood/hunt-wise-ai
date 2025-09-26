import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ZipInputProps {
  onSubmit: (zip: string) => void;
  className?: string;
}

export const ZipInput = ({ onSubmit, className = "" }: ZipInputProps) => {
  const [zip, setZip] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.trim() && zip.length === 5) {
      onSubmit(zip.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-3 ${className}`}>
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Enter ZIP Code"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          maxLength={5}
        />
      </div>
      <Button 
        type="submit" 
        variant="default"
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
        disabled={zip.length !== 5}
      >
        <Search className="w-4 h-4 mr-2" />
        Hunt Now
      </Button>
    </form>
  );
};