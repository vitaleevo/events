"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const SESSION_KEY = "admin_session_token";
const SESSION_EXPIRY_KEY = "admin_session_expiry";
const TAB_KEY = "admin_active_tab";
const SESSION_DURATION = 24 * 60 * 60 * 1000;

interface BackofficeProps {
  onExit: () => void;
}

const Backoffice: React.FC<BackofficeProps> = ({ onExit }) => {
  const { t, language } = useLanguage();
  // --- HOOKS (Must be at top level) ---
  const allEvents = useQuery(api.events.listEvents) || [];
  const leads = useQuery(api.registrants.listRegistrants) || [];
  const assets = useQuery(api.assets.listAssets) || [];
  const heroContent = useQuery(api.content.getContent, { key: "hero" });
  const curriculumContent = useQuery(api.content.getContent, { key: "curriculum" });

  const createEvent = useMutation(api.events.createEvent);
  const updateEvent = useMutation(api.events.updateEvent);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const deleteRegistrant = useMutation(api.registrants.deleteRegistrant);
  const updateStatus = useMutation(api.registrants.updateRegistrantStatus);
  const deleteAsset = useMutation(api.assets.deleteAsset);

  const handleDeleteRegistrant = async (id: any) => {
    if (!confirm(language === 'pt' ? "Tem certeza que deseja eliminar este candidato?" : "Are you sure you want to delete this registrant?")) return;
    try {
      await deleteRegistrant({ id });
    } catch (error) {
      console.error(error);
      alert(language === 'pt' ? "Erro ao eliminar candidato." : "Error deleting registrant.");
    }
  };
  const updateContent = useMutation(api.content.updateContent);
  const generateUploadUrl = useMutation(api.assets.generateUploadUrl);
  const saveAsset = useMutation(api.assets.saveAsset);

  const convex = useConvex();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'leads' | 'content' | 'assets' | 'events'>('leads');
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedAssetPreview, setSelectedAssetPreview] = useState<any | null>(null);
  const [assetTitle, setAssetTitle] = useState('');
  const [assetDesc, setAssetDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxRegistrants: 100,
    isOpen: false,
    slug: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed'
  });

  const [heroData, setHeroData] = useState<any>(null);
  const [curriculumData, setCurriculumData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (heroContent) setHeroData(heroContent.data);
    if (curriculumContent) setCurriculumData(curriculumContent.data);
  }, [heroContent, curriculumContent]);

  useEffect(() => {
    const checkSession = () => {
      try {
        const sessionToken = localStorage.getItem(SESSION_KEY);
        const sessionExpiry = localStorage.getItem(SESSION_EXPIRY_KEY);
        const savedTab = localStorage.getItem(TAB_KEY);

        if (sessionToken && sessionExpiry) {
          const expiryTime = parseInt(sessionExpiry, 10);
          if (Date.now() < expiryTime) {
            setIsAuthenticated(true);
            if (savedTab) setActiveTab(savedTab as any);
          }
        }
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  // Sync Tab to localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(TAB_KEY, activeTab);
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    try {
      const isValid = await convex.query(api.admin.verifyAdmin, { password });
      if (isValid) {
        localStorage.setItem(SESSION_KEY, `admin_${Date.now()}`);
        localStorage.setItem(SESSION_EXPIRY_KEY, (Date.now() + SESSION_DURATION).toString());
        setIsAuthenticated(true);
      } else {
        setAuthError(t.backoffice.auth_error);
      }
    } catch {
      setAuthError('Error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !assetTitle) return;
    setIsUploading(true);
    setUploadProgress(10);
    try {
      const postUrl = await generateUploadUrl();
      setUploadProgress(30);
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      setUploadProgress(70);
      const { storageId } = await result.json();
      await saveAsset({
        title: assetTitle,
        description: assetDesc,
        storageId,
        type: "Flyer"
      });
      setUploadProgress(100);
      setSelectedFile(null);
      setPreviewUrl(null);
      setAssetTitle('');
      setAssetDesc('');
      if (imageInput.current) imageInput.current.value = "";
      alert(language === 'pt' ? "Flyer adicionado!" : "Flyer added!");
    } catch (error) {
      console.error(error);
      alert("Error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCreateOrUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent({
          id: editingEvent._id,
          updates: eventFormData
        });
        alert(language === 'pt' ? "Evento atualizado!" : "Event updated!");
      } else {
        await createEvent({
          ...eventFormData,
          slug: eventFormData.slug || `event-${Date.now()}`
        });
        alert(language === 'pt' ? "Evento criado!" : "Event created!");
      }
      setIsEventFormOpen(false);
      setEditingEvent(null);
    } catch (error) {
      alert("Error");
    }
  };

  const startEditEvent = (event: any) => {
    setEditingEvent(event);
    setEventFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      maxRegistrants: event.maxRegistrants,
      isOpen: event.isOpen,
      slug: event.slug,
      status: event.status
    });
    setIsEventFormOpen(true);
  };

  const startCreateEvent = () => {
    setEditingEvent(null);
    setEventFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      location: 'Luanda',
      maxRegistrants: 100,
      isOpen: false,
      slug: '',
      status: 'upcoming'
    });
    setIsEventFormOpen(true);
  };

  const handleSaveContent = async (key: string, data: any) => {
    setIsSaving(true);
    try {
      await updateContent({ key, data });
      alert(language === 'pt' ? "Conteúdo atualizado!" : "Content updated!");
    } catch (error) {
      console.error(error);
      alert("Error");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLeads = selectedEventId === 'all'
    ? leads
    : leads.filter((l: any) => l.eventId === selectedEventId);

  const filteredAssets = selectedEventId === 'all'
    ? assets
    : assets.filter((a: any) => a.eventId === selectedEventId);

  if (isCheckingSession) return <div className="p-20 text-center">Loading...</div>;

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    localStorage.removeItem(TAB_KEY);
    onExit();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4">
        <div className="mb-8"><LanguageSwitcher /></div>
        <form onSubmit={handleLogin} className="max-w-md w-full bg-stone-800 p-10 rounded-[2.5rem] border border-gold/20 shadow-2xl text-center">
          <div className="relative w-48 h-12 mx-auto mb-8">
            <Image src="/wealthsprings-logo-white.png" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="text-2xl text-white mb-6 serif italic">{t.backoffice.auth_title}</h1>
          <input
            type="password"
            className="w-full p-4 bg-stone-900 border border-white/10 rounded-full text-white mb-4 outline-none focus:border-gold"
            placeholder={t.backoffice.auth_password_placeholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {authError && <p className="text-red-400 text-xs mb-4">{authError}</p>}
          <button className="w-full py-4 bg-gold text-stone-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">{t.backoffice.auth_btn}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-champagne p-4 md:p-10 relative">
      <div className="max-w-7xl mx-auto mb-10 md:flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif italic text-stone-900">{t.backoffice.portal_title}</h1>
          <nav className="flex gap-8 mt-6">
            <button onClick={() => setActiveTab('leads')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'leads' ? 'text-gold border-b-2 border-gold' : 'text-stone-400 hover:text-stone-600'}`}>{t.backoffice.tab_leads}</button>
            <button onClick={() => setActiveTab('events')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'events' ? 'text-gold border-b-2 border-gold' : 'text-stone-400 hover:text-stone-600'}`}>{t.backoffice.tab_events}</button>
            <button onClick={() => setActiveTab('assets')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'assets' ? 'text-gold border-b-2 border-gold' : 'text-stone-400 hover:text-stone-600'}`}>{t.backoffice.tab_assets}</button>
            <button onClick={() => setActiveTab('content')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'content' ? 'text-gold border-b-2 border-gold' : 'text-stone-400 hover:text-stone-600'}`}>{t.backoffice.tab_content}</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <select
            className="px-6 py-3 bg-white border border-stone-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500 outline-none"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="all">{t.backoffice.filter_all}</option>
            {allEvents.map((ev: any) => (
              <option key={ev._id} value={ev._id}>{ev.title}</option>
            ))}
          </select>
          <button onClick={handleLogout} className="px-8 py-3 bg-white border border-stone-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-red-500 hover:border-red-200 transition-all">{t.backoffice.btn_exit}</button>
        </div>
      </div>

      {activeTab === 'leads' && (
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-100 animate-fade-in">
          <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/30">
            <h2 className="serif italic text-xl text-stone-800">{t.backoffice.leads_title}</h2>
            <input type="text" placeholder={t.backoffice.leads_filter_placeholder} className="px-6 py-2 bg-white rounded-full border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-gold/20" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <table className="w-full text-left">
            <thead className="bg-stone-50/50">
              <tr>
                <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-stone-400">{t.backoffice.th_name}</th>
                <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-stone-400">{t.backoffice.th_contact}</th>
                <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-stone-400">{t.backoffice.th_status}</th>
                <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-stone-400 text-right">{t.backoffice.th_actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredLeads.filter((l: any) => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map((lead: any) => (
                <tr key={lead._id} className="hover:bg-stone-50/40 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-stone-800">{lead.name}</p>
                    <p className="text-[10px] text-stone-400">{new Date(lead.timestamp).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-stone-600 font-medium">{lead.email}</p>
                    <p className="text-[10px] text-stone-400">{lead.phone}</p>
                  </td>
                  <td className="px-8 py-6">
                    <button onClick={() => updateStatus({ id: lead._id, status: lead.status === 'Pending' ? 'Approved' : 'Pending' })} className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${lead.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-gold/10 text-gold hover:bg-gold/20'}`}>
                      {lead.status === 'Approved' ? t.backoffice.status_approved : t.backoffice.status_pending}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => handleDeleteRegistrant(lead._id)} className="w-8 h-8 rounded-full flex items-center justify-center text-stone-300 hover:bg-red-50 hover:text-red-500 transition-all">
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h2 className="serif italic text-2xl text-stone-800">{t.backoffice.events_title}</h2>
            <button onClick={startCreateEvent} className="px-8 py-3 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all">{t.backoffice.btn_new_event}</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEvents.map((event: any) => (
              <div key={event._id} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-stone-800">{event.title}</h3>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest">{new Date(event.date).toLocaleDateString()} {language === 'pt' ? 'às' : 'at'} {event.time}</p>
                  </div>
                  <button onClick={() => { if (confirm(language === 'pt' ? "Apagar?" : "Delete?")) deleteEvent({ id: event._id }) }} className="text-stone-200 hover:text-red-500"><i className="fa-solid fa-trash"></i></button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-stone-400">{t.backoffice.event_registrations}</span>
                    <span className={event.isOpen ? "text-green-500" : "text-red-500"}>{event.isOpen ? t.backoffice.event_open : t.backoffice.event_closed}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold" style={{ width: `${(leads.filter((l: any) => l.eventId === event._id).length / event.maxRegistrants) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-stone-400">
                    <span>{leads.filter((l: any) => l.eventId === event._id).length} {language === 'pt' ? 'inscritos' : 'registrants'}</span>
                    <span>{language === 'pt' ? 'Limite' : 'Limit'}: {event.maxRegistrants}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => updateEvent({ id: event._id, updates: { isOpen: !event.isOpen } })}
                    className={`flex-1 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${event.isOpen ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-500 border border-green-100'}`}
                  >
                    {event.isOpen ? t.backoffice.btn_close_reg : t.backoffice.btn_open_reg}
                  </button>
                  <button onClick={() => startEditEvent(event)} className="px-4 py-2 bg-stone-50 text-stone-400 rounded-full text-[9px] hover:text-stone-600 transition-all"><i className="fa-solid fa-pen"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
          <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg h-fit">
            <h3 className="serif italic text-2xl mb-6 text-stone-800">{t.backoffice.assets_upload_title}</h3>
            <form onSubmit={handleUploadAsset} className="space-y-5">
              <div className="border-2 border-dashed border-stone-100 rounded-[1.5rem] p-8 text-center bg-stone-50/30 group hover:border-gold/30 transition-all cursor-pointer relative overflow-hidden" onClick={() => imageInput.current?.click()}>
                {previewUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest">{language === 'pt' ? 'Trocar Imagem' : 'Change Image'}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-stone-200 mb-4 group-hover:text-gold transition-colors"></i>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{t.backoffice.assets_dropzone}</p>
                  </>
                )}
                {isUploading && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-stone-100">
                    <div
                      className="h-full bg-gold transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <input type="file" ref={imageInput} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <input type="text" placeholder={t.backoffice.assets_title_placeholder} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={assetTitle} onChange={(e) => setAssetTitle(e.target.value)} />
              <textarea placeholder={t.backoffice.assets_desc_placeholder} className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm h-24" value={assetDesc} onChange={(e) => setAssetDesc(e.target.value)} />
              <button disabled={isUploading || !selectedFile || !assetTitle} className="w-full py-4 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gold transition-all disabled:opacity-30">
                {isUploading ? (language === 'pt' ? 'Enviando...' : 'Uploading...') : t.backoffice.btn_publish_asset}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="serif italic text-2xl text-stone-800">{language === 'pt' ? 'Galeria de Assets' : 'Asset Gallery'}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredAssets.map((asset: any) => (
                <div key={asset._id} className="bg-white p-4 rounded-[2rem] border border-stone-100 shadow-md group relative">
                  <div className="relative aspect-video w-full rounded-[1.5rem] overflow-hidden mb-4 bg-stone-900 cursor-zoom-in" onClick={() => setSelectedAssetPreview(asset)}>
                    <Image src={asset.fileUrl} alt={asset.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-900"><i className="fa-solid fa-eye"></i></div>
                      <button onClick={(e) => { e.stopPropagation(); if (confirm(language === 'pt' ? "Apagar?" : "Delete?")) deleteAsset({ id: asset._id }) }} className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm px-2">{asset.title}</h4>
                  <p className="text-[10px] text-stone-400 px-2 line-clamp-1">{asset.description || (language === 'pt' ? "Sem descrição" : "No description")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl">
            <div className="flex justify-between items-center mb-10 border-b pb-6 border-stone-50">
              <h3 className="serif italic text-2xl">{t.backoffice.content_masterclass_title}</h3>
              <button onClick={() => handleSaveContent("hero", heroData)} disabled={isSaving} className="px-8 py-2.5 bg-gold text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-gold/20">{isSaving ? "..." : t.backoffice.btn_publish_content}</button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold mb-3 block">{t.backoffice.content_tag_label}</label>
                  <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.tag || ""} onChange={(e) => setHeroData({ ...heroData, tag: e.target.value })} />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">{t.backoffice.content_prefix_label}</label>
                  <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.title_prefix || ""} onChange={(e) => setHeroData({ ...heroData, title_prefix: e.target.value })} />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">{t.backoffice.content_highlight_label}</label>
                  <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.title_highlight || ""} onChange={(e) => setHeroData({ ...heroData, title_highlight: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">{t.backoffice.content_subtitle_label}</label>
                <textarea className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm h-32" value={heroData?.subtitle || ""} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">{t.backoffice.content_location_label}</label>
                  <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.location_val || ""} onChange={(e) => setHeroData({ ...heroData, location_val: e.target.value })} />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">{t.backoffice.content_date_time_label}</label>
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.date_val || ""} onChange={(e) => setHeroData({ ...heroData, date_val: e.target.value })} />
                    <input type="text" className="w-24 p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.time_val || ""} onChange={(e) => setHeroData({ ...heroData, time_val: e.target.value })} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl">
            <div className="flex justify-between items-center mb-10 border-b pb-6 border-stone-50">
              <h3 className="serif italic text-2xl">{t.backoffice.content_curriculum_title}</h3>
              <button onClick={() => handleSaveContent("curriculum", curriculumData)} disabled={isSaving} className="px-8 py-2.5 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">{isSaving ? "..." : t.backoffice.btn_update_pillars}</button>
            </div>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {curriculumData?.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-6 bg-stone-50 rounded-[1.5rem] border border-stone-100 relative group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gold/10 text-gold rounded-full flex items-center justify-center text-[10px] font-bold">0{idx + 1}</div>
                    <input type="text" className="flex-1 bg-transparent border-none font-bold text-stone-800 text-sm focus:ring-0" value={item.title} onChange={(e) => {
                      const newItems = [...curriculumData.items];
                      newItems[idx].title = e.target.value;
                      setCurriculumData({ ...curriculumData, items: newItems });
                    }} />
                    <i className={`fa-solid ${item.icon} text-stone-200`}></i>
                  </div>
                  <textarea className="w-full bg-white border border-stone-100 rounded-xl p-3 text-xs text-stone-500 h-20 outline-none focus:border-gold" value={item.description} onChange={(e) => {
                    const newItems = [...curriculumData.items];
                    newItems[idx].description = e.target.value;
                    setCurriculumData({ ...curriculumData, items: newItems });
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Asset Preview Modal */}
      <AnimatePresence>
        {selectedAssetPreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl p-4 md:p-10 flex flex-col items-center justify-center">
            <button onClick={() => setSelectedAssetPreview(null)} className="absolute top-8 right-8 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-gold transition-colors"><i className="fa-solid fa-xmark"></i></button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image src={selectedAssetPreview.fileUrl} alt="Preview" fill className="object-contain" priority />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Create/Edit Modal */}
      <AnimatePresence>
        {isEventFormOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-stone-900/40 backdrop-blur-sm p-4 flex items-center justify-center">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <h3 className="serif italic text-2xl text-stone-800">{editingEvent ? t.backoffice.modal_edit_event : t.backoffice.modal_create_event}</h3>
                <button onClick={() => setIsEventFormOpen(false)} className="text-stone-400 hover:text-stone-900"><i className="fa-solid fa-xmark"></i></button>
              </div>
              <form onSubmit={handleCreateOrUpdateEvent} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">{t.backoffice.label_event_title}</label>
                    <input required type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold" value={eventFormData.title} onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">{t.backoffice.label_event_date}</label>
                    <input required type="date" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold" value={eventFormData.date} onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">{t.backoffice.label_event_time}</label>
                    <input required type="time" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold" value={eventFormData.time} onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">{t.backoffice.label_event_location}</label>
                    <input required type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold" value={eventFormData.location} onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">{t.backoffice.label_event_slug}</label>
                    <input required type="text" placeholder="masterclass-2026" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold" value={eventFormData.slug} onChange={(e) => setEventFormData({ ...eventFormData, slug: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">{t.backoffice.label_event_limit}</label>
                    <input required type="number" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold" value={eventFormData.maxRegistrants} onChange={(e) => setEventFormData({ ...eventFormData, maxRegistrants: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">{t.backoffice.label_event_desc}</label>
                  <textarea className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold h-32" value={eventFormData.description} onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })} />
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-stone-50">
                  <button type="button" onClick={() => setIsEventFormOpen(false)} className="px-8 py-3 text-stone-400 text-[10px] font-bold uppercase tracking-widest">{t.backoffice.btn_cancel}</button>
                  <button type="submit" className="px-10 py-3 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-lg shadow-stone-900/10">
                    {t.backoffice.btn_save_changes}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Backoffice;
