import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [zipCode, setZipCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.trim() && zipCode.length === 5) {
      navigate(`/dashboard?zip=${zipCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-muted-foreground flex items-center justify-center p-5">
      <div className="w-full max-w-sm bg-card rounded-xl shadow-card p-6 border border-border">
        {/* Moon Phase Display */}
        <div className="flex items-center gap-3 mb-6">
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 30 30" 
            className="flex-shrink-0 text-muted-foreground"
            fill="currentColor"
          >
            <path d="M15 3 C21 3, 27 9, 27 15 C27 21, 21 27, 15 27 C12 27, 9 25.5, 7 23 C10 24, 13.5 23.5, 16 21 C18.5 18.5, 19 15, 18 12 C16.5 8, 13.5 5, 10 4 C12 3.5, 13.5 3, 15 3 Z" />
          </svg>
          <span className="text-muted-foreground">Moon Phase: Waxing Crescent, 12% Illuminated</span>
        </div>

        {/* ZIP Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter ZIP Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              maxLength={5}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            />
          </div>
          <button
            type="submit"
            disabled={zipCode.length !== 5}
            className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground font-medium rounded-md transition-smooth"
          >
            Hunt Now
          </button>
        </form>

        {/* Slogan */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground italic">
            Unleash AI to Hunt with You
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;