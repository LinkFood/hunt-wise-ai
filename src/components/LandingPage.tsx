import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [zipCode, setZipCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.length === 5) navigate(`/dashboard?zip=${zipCode}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2a2a2a] rounded-lg shadow-lg p-6 text-[#a0a0a0] font-['Helvetica_Neue',Arial,sans-serif]">
        <div className="flex items-center gap-2 mb-4">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#a0a0a0">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/>
          </svg>
          <span>Moon Phase: Waxing Crescent, 12% Illuminated</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter ZIP Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              maxLength={5}
              className="w-[200px] p-2 border border-[#555] rounded bg-[#333] text-[#a0a0a0] placeholder:text-[#666]"
            />
            <Button type="submit" disabled={zipCode.length !== 5} className="bg-[#228B22] hover:bg-[#1e7b1e] text-white p-2 rounded disabled:bg-[#666] disabled:cursor-not-allowed">
              Hunt Now
            </Button>
          </div>
        </form>
        <p className="text-center italic mt-4 text-sm">Unleash AI to Hunt Wet with You</p>
        <p className="text-center mt-2 text-sm hover:text-[#228B22] transition-colors">
          <a href="https://huntwet.com" target="_blank" rel="noopener noreferrer">Visit Hunt Wet</a>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;