
"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

// Chave para armazenar a sessão
const SESSION_KEY = "admin_session_token";
const SESSION_EXPIRY_KEY = "admin_session_expiry";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

interface BackofficeProps {
  onExit: () => void;
}

const Backoffice: React.FC<BackofficeProps> = ({ onExit }) => {
  const leads = useQuery(api.registrants.listRegistrants) || [];
  const deleteRegistrant = useMutation(api.registrants.deleteRegistrant);
  const updateStatus = useMutation(api.registrants.updateRegistrantStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const convex = useConvex();

  // Verificar sessão existente ao carregar o componente
  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionToken = localStorage.getItem(SESSION_KEY);
        const sessionExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);

        if (sessionToken && sessionExpiry) {
          const expiryTime = parseInt(sessionExpiry, 10);
          if (Date.now() < expiryTime) {
            // Sessão ainda válida
            setIsAuthenticated(true);
          } else {
            // Sessão expirada, limpar
            localStorage.removeItem(SESSION_KEY);
            localStorage.removeItem(SESSION_EXPIRY_KEY);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  // Função para criar sessão
  const createSession = () => {
    const token = `admin_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const expiry = Date.now() + SESSION_DURATION;
    localStorage.setItem(SESSION_KEY, token);
    localStorage.setItem(SESSION_EXPIRY_KEY, expiry.toString());
  };

  // Função para limpar sessão (logout)
  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    setIsAuthenticated(false);
  };

  // Handler de saída que também limpa a sessão
  const handleLogout = () => {
    if (confirm('Deseja realmente sair? / Are you sure you want to log out?')) {
      clearSession();
      onExit();
    }
  };

  // Handler para apenas voltar (reserva a sessão)
  const handleBack = () => {
    onExit();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');

    try {
      const isValid = await convex.query(api.admin.verifyAdmin, { password });
      if (isValid) {
        createSession();
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

  const [sendingWhatsApp, setSendingWhatsApp] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<{ id: string; success: boolean; message: string; url?: string } | null>(null);

  // Função para enviar mensagem WhatsApp
  const sendWhatsAppConfirmation = async (lead: any) => {
    if (!lead.phone) {
      setWhatsappStatus({
        id: lead._id,
        success: false,
        message: "Sem número de telefone cadastrado"
      });
      return;
    }

    setSendingWhatsApp(lead._id);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: lead.phone,
          name: lead.name,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.method === 'manual') {
          // API não configurada, abrir link manualmente
          setWhatsappStatus({
            id: lead._id,
            success: true,
            message: "Clique para enviar mensagem",
            url: result.url
          });
          // Abrir automaticamente em nova aba
          window.open(result.url, '_blank');
        } else {
          // Mensagem enviada automaticamente via API
          setWhatsappStatus({
            id: lead._id,
            success: true,
            message: "✓ Mensagem enviada com sucesso!"
          });
        }
      } else {
        setWhatsappStatus({
          id: lead._id,
          success: false,
          message: result.error || "Erro ao enviar mensagem",
          url: result.fallbackUrl
        });
      }
    } catch (error) {
      console.error("WhatsApp send error:", error);
      setWhatsappStatus({
        id: lead._id,
        success: false,
        message: "Erro de conexão"
      });
    } finally {
      setSendingWhatsApp(null);
      // Limpar status após 5 segundos
      setTimeout(() => setWhatsappStatus(null), 5000);
    }
  };

  const handleStatusChange = async (id: any, currentStatus: string, lead: any) => {
    const nextStatus = currentStatus === "Pending" ? "Approved" : "Pending";
    try {
      await updateStatus({ id, status: nextStatus });

      // Se aprovando, enviar mensagem WhatsApp
      if (nextStatus === "Approved") {
        await sendWhatsAppConfirmation(lead);
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

  // Mostrar loading enquanto verifica sessão
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-stone-400 text-sm">Verificando sessão...</p>
        </div>
      </div>
    );
  }

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
              onClick={handleBack}
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
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-stone-500 text-[10px] font-bold tracking-widest hover:text-stone-900 transition-all uppercase"
          >
            Back to Site
          </button>
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-white border border-stone-200 text-stone-600 rounded-full text-xs font-bold tracking-widest hover:bg-stone-50 transition-all uppercase"
          >
            Logout
          </button>
        </div>
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
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleStatusChange(lead._id, lead.status, lead)}
                        disabled={sendingWhatsApp === lead._id}
                        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors ${lead.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold hover:bg-gold/20'
                          } ${sendingWhatsApp === lead._id ? 'opacity-50 cursor-wait' : ''}`}
                      >
                        {sendingWhatsApp === lead._id ? (
                          <span className="flex items-center gap-1">
                            <i className="fa-solid fa-spinner animate-spin"></i>
                            Enviando...
                          </span>
                        ) : lead.status}
                      </button>
                      {/* WhatsApp status feedback */}
                      {whatsappStatus && whatsappStatus.id === lead._id && (
                        <div className={`text-[9px] ${whatsappStatus.success ? 'text-green-600' : 'text-red-500'}`}>
                          {whatsappStatus.url ? (
                            <a href={whatsappStatus.url} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                              {whatsappStatus.message}
                            </a>
                          ) : whatsappStatus.message}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      {/* Botão de reenviar WhatsApp (só aparece para aprovados com telefone) */}
                      {lead.status === 'Approved' && lead.phone && (
                        <button
                          onClick={() => sendWhatsAppConfirmation(lead)}
                          disabled={sendingWhatsApp === lead._id}
                          className="text-green-500 hover:text-green-600 transition-colors text-sm"
                          title="Reenviar confirmação WhatsApp"
                        >
                          <i className="fa-brands fa-whatsapp"></i>
                        </button>
                      )}
                      <button
                        onClick={() => deleteLead(lead._id)}
                        className="text-stone-300 hover:text-red-400 transition-colors text-xs"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
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
