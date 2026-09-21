import React from 'react';
import Timeline from '../components/Timeline';
import { Link } from 'react-router-dom';

const Schedule = () => {
  return (
    <div className="min-h-screen pt-12 pb-20 container max-w-4xl">
      <div className="mb-8">
        <Link to="/" className="text-[var(--color-text-muted)] hover:text-white transition-colors">
          &larr; Back to Portal
        </Link>
      </div>
      <h1 className="text-4xl md:text-5xl font-black mb-12 text-gradient tracking-tight">FULL SCHEDULE</h1>
      <Timeline />
    </div>
  );
};

export default Schedule;
