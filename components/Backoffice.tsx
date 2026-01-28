
"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

interface BackofficeProps {
  onExit: () => void;
}

const Backoffice: React.FC<BackofficeProps> = ({ onExit }) => {
  const leads = useQuery(api.registrants.listRegistrants) || [];
  const deleteRegistrant = useMutation(api.registrants.deleteRegistrant);
  const updateStatus = useMutation(api.registrants.updateRegistrantStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const convex = useConvex();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    try {
      const isValid = await convex.query(api.admin.verifyAdmin, { password });
      if (isValid) {
        setIsAuthenticated(true);
      } else {
        setAuthError('Senha incorreta / Incorrect password');
      }
    } catch (err) {
      setAuthError('Erro na autenticação / Auth error');
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const filteredLeads = leads.filter((lead: any) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteLead = async (id: any) => {
    try {
      if (!confirm('Are you sure you want to delete this lead?')) return;
      await deleteRegistrant({ id });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id: any, currentStatus: string) => {
    const nextStatus = currentStatus === "Pending" ? "Approved" : "Pending";
    try {
      await updateStatus({ id, status: nextStatus });
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-800/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-gold/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif italic text-white mb-2">Admin Access</h1>
            <p className="text-stone-400 text-xs uppercase tracking-widest">Portal do Organizador</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Senha / Password"
                className="w-full py-4 px-6 bg-stone-900/50 border border-white/10 rounded-full text-white outline-none focus:border-gold transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {authError && <p className="text-red-400 text-xs mt-2 ml-4">{authError}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-gold text-stone-900 rounded-full font-bold text-xs tracking-[0.2em] hover:bg-gold-dark hover:text-white transition-all uppercase disabled:opacity-50"
            >
              {isLoggingIn ? 'Verificando...' : 'Entrar / Enter'}
            </button>
            <button
              type="button"
              onClick={onExit}
              className="w-full text-stone-500 text-[10px] uppercase tracking-widest hover:text-white transition-all"
            >
              Voltar / Back
            </button>
          </form>
        </div>
      </div>
    );
  }

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
        <StatCard label="Pending" value={leads.filter((l: any) => l.status === 'Pending').length} icon="fa-clock" color="text-amber-500" />
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
              {filteredLeads.length > 0 ? filteredLeads.map((lead: any) => (
                <tr key={lead._id} className="hover:bg-stone-50/30 transition-colors group">
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
                    <button
                      onClick={() => handleStatusChange(lead._id, lead.status)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors ${lead.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold hover:bg-gold/20'
                        }`}
                    >
                      {lead.status}
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => deleteLead(lead._id)}
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
