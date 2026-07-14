"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/appStore";
import { ShieldAlert, MapPin, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOSData {
  id: string;
  senderName: string;
  lat: number;
  lon: number;
  message: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const { userRole } = useAppStore();
  const router = useRouter();
  const [sosList, setSosList] = useState<SOSData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Protect route
  useEffect(() => {
    if (userRole !== "admin") {
      router.push("/dashboard");
    }
  }, [userRole, router]);

  const fetchSOSData = async () => {
    try {
      const res = await fetch("/api/sos");
      const json = await res.json();
      if (json.success) {
        // Sort newest first
        const sorted = json.data.sort((a: SOSData, b: SOSData) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setSosList(sorted);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch SOS data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole !== "admin") return;
    
    // Initial fetch
    fetchSOSData();

    // Real-time polling every 3 seconds
    const interval = setInterval(fetchSOSData, 3000);
    return () => clearInterval(interval);
  }, [userRole]);

  if (userRole !== "admin") return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto w-full min-h-[calc(100vh-6rem)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-5xl font-bold flex items-center gap-2 text-red-500">
            <ShieldAlert className="animate-pulse" />
            SOS HQ Command Center
          </h1>
          <p className="text-slate-400 mt-1">Live Global Distress Signal Monitoring</p>
        </div>
        
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-red-500/20">
          <RefreshCw size={16} className={cn("text-red-400", loading ? "animate-spin" : "")} />
          <div className="text-base">
            <div className="text-slate-400">Database Status</div>
            <div className="text-green-400 font-mono">LIVE / SYNCED</div>
          </div>
        </div>
      </div>

      <div className="glass-elevated rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[var(--color-surface)]">
                <th className="p-4 text-base font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-base font-semibold text-slate-400 uppercase tracking-wider">Sender Name</th>
                <th className="p-4 text-base font-semibold text-slate-400 uppercase tracking-wider">Location (Lat, Lon)</th>
                <th className="p-4 text-base font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="p-4 text-base font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sosList.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <ShieldAlert size={48} className="mx-auto mb-3 opacity-20" />
                    No active SOS signals at the moment.
                  </td>
                </tr>
              )}
              
              {sosList.map((sos, idx) => (
                <motion.tr 
                  key={sos.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <span className="text-red-400 font-medium text-base">CRITICAL</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{sos.senderName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-300 font-mono text-base bg-[var(--color-bg)] px-2 py-1 rounded w-max">
                      <MapPin size={14} className="text-[var(--color-primary)]" />
                      {sos.lat.toFixed(5)}, {sos.lon.toFixed(5)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-400 text-base">
                      <Clock size={14} />
                      {new Date(sos.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <a 
                      href={`https://maps.google.com/?q=${sos.lat},${sos.lon}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/20 transition-colors text-base font-medium"
                    >
                      Open Map
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center px-2">
        <p className="text-base text-slate-500">
          Showing {sosList.length} active distress signals
        </p>
        <p className="text-base text-slate-500 font-mono">
          Last sync: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
