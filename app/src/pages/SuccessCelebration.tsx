import React, { useEffect, useState } from "react";
import { StepTransition } from "@/components/StepTransition";
import ProgressBar from "@/components/ProgressBar";
import Confetti from "@/components/Confetti";
import { useNavigate } from "react-router-dom";

const QUOTES = [
  "“Small hinges swing big doors. Consistency is your hinge.”",
  "“Each meal is a message to your future self.”",
  "“Health isn't a goal, it's a habit. Keep going!”"
];

export default function SuccessCelebration() {
  const [quote, setQuote] = useState(QUOTES[0]);
  const navigate = useNavigate();

  useEffect(() => {
    // Rotate quote every 3s
    let idx = 0;
    const id = setInterval(() => {
      idx = (idx + 1) % QUOTES.length;
      setQuote(QUOTES[idx]);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <StepTransition>
      <Confetti />
      <div className="min-h-screen max-w-xl mx-auto flex flex-col items-center justify-center pt-10 pb-16">
        <ProgressBar step={4} total={4} />
        <div className="bg-black/75 backdrop-blur-md rounded-2xl shadow-zen px-8 py-12 w-full flex flex-col items-center animate-fade-in border border-white/10">
          <h1 className="headline mb-1 text-peach-700 text-center">
            Consistency is the real superpower. You showed up for yourself today. 🎉
          </h1>
          <p className="text-lg text-leafgreen-900 max-w-md mx-auto mt-2 text-center">
            One meal at a time. One week at a time. Your health trajectory just bent upward.
          </p>
          <div className="my-7 text-2xl font-manrope text-center text-peach-800 animate-pulse transition-colors duration-300 min-h-[40px] flex items-center">
            {quote}
          </div>
          <div className="w-full flex flex-col md:flex-row gap-4 mt-4 justify-center">
            <button
              className="bg-peach-600 hover:bg-peach-700 font-bold py-3 px-7 rounded-xl shadow-lg transition-all shadow-zen"
              onClick={() => navigate("/track-order")}
            >
              Track Order
            </button>
            <button
              className="bg-white hover:bg-peach-50 font-bold py-3 px-7 rounded-xl shadow-lg transition-all text-black"
              onClick={() => navigate("/")}
            >
              Adjust Plan
            </button>
          </div>
          <div className="mt-10 text-sm text-peach-700 font-medium opacity-85 text-center">
            Order confirmed! Estimated delivery: <b>Tomorrow, 9–11 AM</b>
          </div>
          <a
            href="#track"
            className="mt-2 text-xs text-leafgreen-700 underline hover:text-peach-700 transition-colors"
          >
            Track your order status
          </a>
        </div>
      </div>
    </StepTransition>
  );
}
