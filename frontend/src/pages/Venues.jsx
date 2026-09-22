import React from 'react';
import { motion } from 'framer-motion';

const Venues = () => {
  const venues = [
    { id: 'wifi-lab', name: 'Wifi Lab', capacity: 31, status: 'Active', notes: '' },
    { id: '206-1', name: '206/1 (Old 3rd yr)', capacity: 14, status: 'Warning', notes: 'Last socket damaged. Only one team allowed.' },
    { id: '206-2', name: '206/2', capacity: 15, status: 'Active', notes: '' },
    { id: '207-2', name: '207/2', capacity: 15, status: 'Active', notes: '' },
    { id: '208-2', name: '208/2', capacity: 15, status: 'Active', notes: '' },
    { id: 'a-310', name: 'A-310 (BME)', capacity: 15, status: 'Active', notes: '' },
    { id: 'a-309', name: 'A-309 (AML B)', capacity: 15, status: 'Active', notes: '' },
    { id: 'a-308', name: 'A-308 (AML A)', capacity: 15, status: 'Active', notes: '' },
    { id: 'a-303', name: 'A-303 (II AM)', capacity: 15, status: 'Active', notes: '' },
    { id: 'a-302', name: 'A-302 (II AM)', capacity: 15, status: 'Pending', notes: 'Capacity needs verification' },
  ];

  const invalidVenues = [
    { name: 'Classroom 31', reason: 'Insufficient plug capacity' },
    { name: 'Classroom 32', reason: 'Insufficient plug capacity' },
  ];

  const totalCapacity = venues.reduce((acc, curr) => acc + curr.capacity, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 md:p-16 relative overflow-hidden font-sans">
      {/* Cinematic Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-500 mb-2">
              VENUE ALLOCATION
            </h1>
            <p className="text-white/50 text-lg tracking-wide uppercase font-semibold">Hack the Horizon 2.0</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-2xl">
            <div className="text-white/60 text-sm uppercase tracking-wider font-medium">Total Capacity</div>
            <div className="text-4xl font-black text-indigo-400">{totalCapacity} <span className="text-lg text-white/40">Teams</span></div>
          </div>
        </motion.div>

        {/* Valid Venues Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {venues.map((venue) => (
            <motion.div 
              key={venue.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="group relative bg-white/[0.02] border border-white/10 rounded-3xl p-6 backdrop-blur-xl overflow-hidden shadow-2xl transition-all duration-300 hover:bg-white/[0.04] hover:border-indigo-500/50"
            >
              {/* Subtle tech grid background inside card */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNMjAgMEwwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold tracking-tight text-white/90">{venue.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(venue.status)}`}>
                  {venue.status}
                </span>
              </div>
              
              <div className="relative z-10 flex items-end gap-2 mb-4">
                <div className="text-5xl font-black text-white">{venue.capacity}</div>
                <div className="text-white/40 font-medium uppercase tracking-widest text-sm mb-1.5">Teams</div>
              </div>

              {venue.notes && (
                <div className="relative z-10 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/80 text-sm font-medium flex gap-3 items-start">
                  <svg className="w-5 h-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>{venue.notes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Invalid Venues Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-xl font-bold uppercase tracking-widest text-white/40 mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-white/20" />
            Invalid Venues
            <span className="flex-1 h-px bg-white/10" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {invalidVenues.map((venue, idx) => (
              <div key={idx} className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5 flex items-center justify-between backdrop-blur-sm">
                <div>
                  <h4 className="text-red-400 font-bold mb-1">{venue.name}</h4>
                  <p className="text-red-400/60 text-sm">{venue.reason}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Venues;
