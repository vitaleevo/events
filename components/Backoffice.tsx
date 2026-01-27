
"use client";

import React, { useState, useEffect } from 'react';
import { Subscription } from '@/lib/types';

interface BackofficeProps {
  onExit: () => void;
}

const Backoffice: React.FC<BackofficeProps> = ({ onExit }) => {
  const [leads, setLeads] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/subscribers');
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Failed to fetch leads', error);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteLead = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this lead?')) return;

      const res = await fetch(`/api/subscribers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(leads.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const StatCard = ({ label, value, icon, color = "text-gold" }: any) => (
    <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-3xl font-medium text-stone-900 serif italic">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center ${color}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-champagne p-4 md:p-10 animate-fade-in">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-medium text-stone-900 serif">Partner Portal</h1>
          <p className="text-stone-500 text-sm mt-1">Management of high-intent wealth invitations.</p>
        </div>
        <button
          onClick={onExit}
          className="px-8 py-3 bg-white border border-stone-200 text-stone-600 rounded-full text-xs font-bold tracking-widest hover:bg-stone-50 transition-all uppercase"
        >
          Exit Dashboard
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard label="Total Invitations" value={leads.length} icon="fa-users" />
        <StatCard label="Review Rate" value="94.2%" icon="fa-chart-pie" />
        <StatCard label="Pending" value={leads.filter(l => l.status === 'Pending').length} icon="fa-clock" color="text-amber-500" />
      </div>

      {/* Main Table Area */}
      <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-white overflow-hidden">
        <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-medium text-stone-800 serif italic">Subscription Registry</h2>
          <div className="relative w-full md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 text-sm"></i>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-full text-sm focus:ring-2 focus:ring-gold/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Candidate</th>
                <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Contact Information</th>
                <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Registration Date</th>
                <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-stone-800 text-sm">{lead.name}</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-tighter">Verified Private Invite</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-stone-600 font-medium">{lead.email}</p>
                    <p className="text-[10px] text-stone-400">{lead.phone || 'No phone provided'}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-stone-600">
                      {new Date(lead.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-stone-400">{new Date(lead.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-widest rounded-full">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-stone-300 hover:text-red-400 transition-colors text-xs"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="max-w-xs mx-auto text-stone-300">
                      <i className="fa-solid fa-folder-open text-4xl mb-4 opacity-20"></i>
                      <p className="text-sm italic">No registrations found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 bg-stone-50/50 border-t border-stone-100 flex justify-between items-center text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">
          <span>Showing {filteredLeads.length} records</span>
          <span className="flex items-center gap-2">
            Secure Database Connection <i className="fa-solid fa-shield-halved text-green-400/50"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Backoffice;
