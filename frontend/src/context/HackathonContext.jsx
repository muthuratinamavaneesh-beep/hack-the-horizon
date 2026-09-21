import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_URL, SOCKET_URL, setServerTimeOffset } from '../utils/time';

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

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('serverTime', (data) => {
      setServerTimeOffset(data.serverTime);
    });

    newSocket.on('settingsUpdated', (updatedSettings) => {
      setSettings(updatedSettings);
    });

    newSocket.on('scheduleUpdated', async () => {
      // Re-fetch events when schedule updates (simple way to ensure ordering is correct)
      const eventsRes = await fetch(`${API_URL}/events`);
      setEvents(await eventsRes.json());
    });

    newSocket.on('announcementsUpdated', async () => {
      const announcementsRes = await fetch(`${API_URL}/announcements`);
      setAnnouncements(await announcementsRes.json());
    });

    return () => {
      newSocket.disconnect();
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
