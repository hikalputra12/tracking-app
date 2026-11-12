import React, { useState, useEffect } from 'react';
import { Lock, Delete, ShieldCheck, KeyRound } from 'lucide-react';

interface PinScreenProps {
  correctPin: string;
  onSuccess: () => void;
}

export const PinScreen: React.FC<PinScreenProps> = ({ correctPin, onSuccess }) => {
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const targetLength = 6;

  const handleKeyPress = (num: string) => {
    if (enteredPin.length < targetLength) {
      const next = enteredPin + num;
      setEnteredPin(next);
      setErrorMessage('');

      if (next.length === targetLength) {
        verifyPin(next);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    setEnteredPin('');
    setErrorMessage('');
  };

  const verifyPin = (pinToTest: string) => {
    if (pinToTest === correctPin) {
      onSuccess();
    } else {
      setIsShaking(true);
      setErrorMessage('PIN salah, silakan coba lagi');
      setTimeout(() => {
        setIsShaking(false);
        setEnteredPin('');
      }, 500);
    }
  };

  // Keyboard support for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enteredPin, correctPin]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#191919] p-4 select-none">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* App Notion Brand */}
        <div className="w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-lg mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1">
          TrackHub
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Akses Personal Terlindungi
        </p>

        {/* PIN Dots */}
        <div className={`flex gap-3.5 mb-6 ${isShaking ? 'animate-bounce' : ''}`}>
          {Array.from({ length: targetLength }).map((_, i) => {
            const isFilled = i < enteredPin.length;
            return (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-neutral-900 dark:bg-neutral-100 scale-110'
                    : 'border-2 border-neutral-300 dark:border-neutral-700 bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Error / Hint Message */}
        <div className="h-6 mb-4 text-center">
          {errorMessage ? (
            <span className="text-xs font-medium text-rose-500 animate-fade-in">{errorMessage}</span>
          ) : (
            <span className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1">
              <KeyRound className="w-3.5 h-3.5" /> PIN Default: <b>123456</b>
            </span>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-14 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 text-neutral-800 dark:text-neutral-100 text-xl font-medium transition-colors flex items-center justify-center shadow-sm"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center justify-center transition-colors"
          >
            Hapus
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 text-neutral-800 dark:text-neutral-100 text-xl font-medium transition-colors flex items-center justify-center shadow-sm"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center justify-center transition-colors"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
