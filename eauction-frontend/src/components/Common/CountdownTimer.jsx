import { useEffect, useMemo, useRef, useState } from 'react';

const getRemainingParts = (endTime) => {
  const end = typeof endTime === 'string' ? new Date(endTime).getTime() : new Date(endTime).getTime();
  const now = Date.now();
  let delta = Math.max(0, Math.floor((end - now) / 1000));
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600);
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60);
  const seconds = delta - minutes * 60;
  return { days, hours, minutes, seconds, ended: end <= now };
};

const colorFor = ({ days, hours, minutes, ended }) => {
  if (ended) return 'text-slate-500';
  if (days > 0) return 'text-emerald-600';
  if (hours > 0) return 'text-amber-600';
  return 'text-rose-600';
};

const formatParts = ({ days, hours, minutes, seconds, ended }) => {
  if (ended) return 'Auction Ended';
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m ${seconds}s`;
};

const CountdownTimer = ({ endTime, className = '' }) => {
  const [parts, setParts] = useState(() => getRemainingParts(endTime));
  const visibleRef = useRef(document.visibilityState === 'visible');

  useEffect(() => {
    const onVisibility = () => {
      visibleRef.current = document.visibilityState === 'visible';
      if (visibleRef.current) setParts(getRemainingParts(endTime));
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [endTime]);

  useEffect(() => {
    if (!endTime) return undefined;
    const id = setInterval(() => {
      if (visibleRef.current) setParts(getRemainingParts(endTime));
    }, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  const text = useMemo(() => formatParts(parts), [parts]);
  const color = useMemo(() => colorFor(parts), [parts]);

  return <span className={`${color} ${className}`}>{text}</span>;
};

export default CountdownTimer;
