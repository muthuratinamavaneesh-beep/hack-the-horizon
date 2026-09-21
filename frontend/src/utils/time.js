export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || '/';

let serverTimeOffset = 0;

export const setServerTimeOffset = (serverTimeIsoString) => {
  const serverTime = new Date(serverTimeIsoString).getTime();
  const localTime = Date.now();
  serverTimeOffset = serverTime - localTime;
};

export const getServerTime = () => new Date(Date.now() + serverTimeOffset);

export const formatCountdown = (targetDate) => {
  const now = getServerTime().getTime();
  const target = new Date(targetDate).getTime();
  let difference = target - now;

  if (difference <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00', isZero: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return {
    days: days.toString().padStart(2, '0'),
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    isZero: false,
  };
};

export const getEventStatus = (event) => {
  const now = getServerTime().getTime();
  const start = new Date(event.startDateTime).getTime();
  const end = new Date(event.endDateTime).getTime();
  if (now > end) return 'COMPLETED';
  if (now >= start && now <= end) return 'LIVE';
  return 'UPCOMING';
};

export const formatTimeRange = (startISO, endISO) => {
  const fmt = (iso) =>
    new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  return `${fmt(startISO)} – ${fmt(endISO)}`;
};

export const formatShortDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

export const formatDayLabel = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Kolkata',
  }).toUpperCase();
