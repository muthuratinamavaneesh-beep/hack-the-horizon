import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, setServerTimeOffset } from '../utils/time';

const HackathonContext = createContext();

export const useHackathon = () => useContext(HackathonContext);

export const HackathonProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [settings, setSettings] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  const fetchInitialData = async () => {
    try {
      const [settingsRes, eventsRes, announcementsRes] = await Promise.all([
        fetch(`${API_URL}/hackathon`),
        fetch(`${API_URL}/events`),
        fetch(`${API_URL}/announcements`)
      ]);
      
      const s = await settingsRes.json();
      const e = await eventsRes.json();
      const a = await announcementsRes.json();
      
      setSettings(s);
      setEvents(e);
      setAnnouncements(a);
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // 2. WebSocket Real-time Updates (Native for Cloudflare DO)
    const wsBaseUrl = import.meta.env.VITE_SOCKET_URL || `ws://${window.location.host}`;
    const wsUrl = wsBaseUrl.endsWith('/ws') ? wsBaseUrl : `${wsBaseUrl}/ws`;
    
    // Ensure wss:// is used for https URLs
    const finalWsUrl = wsUrl.replace(/^http/, 'ws');
    
    const ws = new WebSocket(finalWsUrl);
    setSocket(ws);

    ws.onopen = () => {
      console.log('Connected to real-time events');
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.event === 'serverTime') {
          setServerTime(new Date(payload.data.serverTime));
        } else if (payload.event === 'announcement' || payload.event === 'announcementAdded') {
          setAnnouncements(prev => [payload.data, ...prev]);
        } else if (payload.event === 'scheduleUpdated') {
          // Immediately sync the entire events array to get the new order
          fetch(`${API_URL}/events`).then(res => res.json()).then(data => setEvents(data));
        } else if (payload.event === 'announcementsUpdated') {
          // Complete sync
          fetch(`${API_URL}/announcements`).then(res => res.json()).then(data => setAnnouncements(data));
        }
      } catch (err) {
        console.error('Error parsing WS message', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  // Compute Current/Next Event
  const getUpcomingAndCurrentEvent = (now) => {
    if (!events.length) return { currentEvent: null, nextEvent: null };
    
    let currentEvent = null;
    let nextEvent = null;
    
    for (let e of events) {
      const start = new Date(e.startDateTime).getTime();
      const end = new Date(e.endDateTime).getTime();
      
      if (now >= start && now <= end) {
        currentEvent = e;
      }
      
      if (start > now && !nextEvent) {
        nextEvent = e;
      }
    }
    
    return { currentEvent, nextEvent };
  };

  return (
    <HackathonContext.Provider value={{
      socket,
      settings,
      events,
      announcements,
      loading,
      getUpcomingAndCurrentEvent
    }}>
      {children}
    </HackathonContext.Provider>
  );
};
