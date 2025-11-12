const pad = (value) => value.toString().padStart(2, '0');

export const formatDateTime = (isoString) => {
  if (!isoString) return '—';

  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const timeRemaining = (isoString) => {
  if (!isoString) return 'N/A';

  const end = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = end - now;

  if (Number.isNaN(end)) {
    return 'Invalid date';
  }

  if (diffMs <= 0) {
    return 'Ended';
  }

  const minutes = Math.floor(diffMs / (60 * 1000));
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainingMinutes = minutes % 60;

  const parts = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (!days && remainingMinutes) parts.push(`${remainingMinutes}m`);

  return parts.join(' ');
};
