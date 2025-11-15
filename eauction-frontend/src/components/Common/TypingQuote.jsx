import { useState, useEffect } from 'react';

const quotes = [
  "Every bid is a new opportunity",
  "Win big, bid smart",
  "Your next treasure awaits",
  "Discover, bid, and win together",
  "The thrill of the auction",
  "Where dreams become reality",
  "Bid with confidence, win with pride",
  "Your marketplace for unique finds",
  "Turning bids into victories",
  "Auction excellence, delivered",
];

const TypingQuote = ({ className = '' }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  const currentQuote = quotes[currentQuoteIndex];

  useEffect(() => {
    if (isTyping) {
      if (charIndex < currentQuote.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentQuote.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, wait 3 seconds
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    } else {
      // Fade out and move to next quote
      const timeout = setTimeout(() => {
        setDisplayedText('');
        setCharIndex(0);
        setCurrentQuoteIndex((currentQuoteIndex + 1) % quotes.length);
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, currentQuote, currentQuoteIndex, isTyping]);

  const containerClasses = className?.trim().length
    ? `pointer-events-none ${className}`
    : 'absolute inset-0 flex items-center justify-center pointer-events-none';

  return (
    <div className={containerClasses}>
      <p 
        className={`text-3xl font-semibold text-white/70 text-center px-8 transition-opacity duration-500 ${
          isTyping && charIndex === currentQuote.length ? 'opacity-100' : charIndex > 0 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}
      >
        {displayedText}
        {isTyping && charIndex < currentQuote.length && (
          <span className="inline-block w-0.5 h-8 bg-white/70 ml-1 animate-pulse" />
        )}
      </p>
    </div>
  );
};

export default TypingQuote;
