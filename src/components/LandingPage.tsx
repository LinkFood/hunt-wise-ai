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
    <div 
      className="min-h-screen flex items-center justify-center p-5"
      style={{ 
        backgroundColor: '#1a1a1a',
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
        fontSize: '16px',
        color: '#a0a0a0'
      }}
    >
      <div 
        className="w-full"
        style={{ 
          maxWidth: '400px',
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          padding: '20px'
        }}
      >
        {/* Moon Phase Display */}
        <div className="flex items-center mb-6" style={{ gap: '10px' }}>
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 30 30" 
            fill="#a0a0a0"
            className="flex-shrink-0"
          >
            <path d="M15 3 C21 3, 27 9, 27 15 C27 21, 21 27, 15 27 C12 27, 9 25.5, 7 23 C10 24, 13.5 23.5, 16 21 C18.5 18.5, 19 15, 18 12 C16.5 8, 13.5 5, 10 4 C12 3.5, 13.5 3, 15 3 Z" />
          </svg>
          <span>Moon Phase: Waxing Crescent, 12% Illuminated</span>
        </div>

        {/* ZIP Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center mb-4" style={{ gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            maxLength={5}
            style={{
              width: '200px',
              padding: '8px',
              border: '1px solid #555',
              borderRadius: '5px',
              backgroundColor: '#333',
              color: '#a0a0a0',
              fontSize: '16px',
              fontFamily: 'inherit'
            }}
            className="focus:outline-none focus:border-[#228B22]"
          />
          <button
            type="submit"
            disabled={zipCode.length !== 5}
            style={{
              backgroundColor: zipCode.length === 5 ? '#228B22' : '#555',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              border: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              cursor: zipCode.length === 5 ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
            className="hover:bg-[#1e7b1e] disabled:hover:bg-[#555]"
            onMouseEnter={(e) => {
              if (zipCode.length === 5) {
                e.currentTarget.style.backgroundColor = '#1e7b1e';
              }
            }}
            onMouseLeave={(e) => {
              if (zipCode.length === 5) {
                e.currentTarget.style.backgroundColor = '#228B22';
              } else {
                e.currentTarget.style.backgroundColor = '#555';
              }
            }}
          >
            Hunt Now
          </button>
        </form>

        {/* Slogan */}
        <div className="text-center" style={{ marginTop: '15px' }}>
          <p 
            style={{
              fontStyle: 'italic',
              fontSize: '14px',
              color: '#a0a0a0'
            }}
          >
            Unleash AI to Hunt with You
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;