import React from "react";

export const AuthHeroSection: React.FC = () => {
  return (
    <div className="flex flex-col justify-center p-12 text-white w-full">
      <div className="max-w-4xl">
        <div className="flex items-center mb-6 justify-center">
          <h1 className="text-4xl font-bold">Echosphere</h1>
        </div>

        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Transform Your Leads with
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {" "}
            AI Voice
          </span>{" "}
          Technology
        </h2>

        <p className="text-xl text-slate-300 mb-8">
          Let our AI make thousands of personalized calls to qualify and nurture
          your leads 24/7. Experience the future of sales automation.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400">50,000+</div>
            <div className="text-sm text-slate-300">AI Calls Made</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">95%</div>
            <div className="text-sm text-slate-300">
              Lead Qualification Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
