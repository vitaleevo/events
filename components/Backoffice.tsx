"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from 'next/image';

const SESSION_KEY = "admin_session_token";
const SESSION_EXPIRY_KEY = "admin_session_expiry";
const SESSION_DURATION = 24 * 60 * 60 * 1000;

interface BackofficeProps {
  onExit: () => void;
}

const Backoffice: React.FC<BackofficeProps> = ({ onExit }) => {
  const leads = useQuery(api.registrants.listRegistrants) || [];
  const assets = useQuery(api.assets.listAssets) || [];
  const deleteRegistrant = useMutation(api.registrants.deleteRegistrant);
  const updateStatus = useMutation(api.registrants.updateRegistrantStatus);
  const deleteAsset = useMutation(api.assets.deleteAsset);

  // Content Management
  const heroContent = useQuery(api.content.getContent, { key: "hero" });
  const curriculumContent = useQuery(api.content.getContent, { key: "curriculum" });
  const updateContent = useMutation(api.content.updateContent);
  const generateUploadUrl = useMutation(api.assets.generateUploadUrl);
  const saveAsset = useMutation(api.assets.saveAsset);

  const [activeTab, setActiveTab] = useState<'leads' | 'content' | 'assets'>('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Asset Upload State
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [assetTitle, setAssetTitle] = useState('');
  const [assetDesc, setAssetDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const convex = useConvex();

  // Content States
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
        if (sessionToken && sessionExpiry) {
          const expiryTime = parseInt(sessionExpiry, 10);
          if (Date.now() < expiryTime) setIsAuthenticated(true);
        }
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkSession();
  }, []);

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
        setAuthError('Senha incorreta');
      }
    } catch {
      setAuthError('Erro na autenticação');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleUploadAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !assetTitle) return;
    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();
      await saveAsset({
        title: assetTitle,
        description: assetDesc,
        storageId,
        type: "Flyer"
      });
      setSelectedFile(null);
      setAssetTitle('');
      setAssetDesc('');
      if (imageInput.current) imageInput.current.value = "";
      alert("Flyer adicionado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao fazer upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveContent = async (key: string, data: any) => {
    setIsSaving(true);
    try {
      await updateContent({ key, data });
      alert("Conteúdo atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar conteúdo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isCheckingSession) return <div className="p-20 text-center">Carregando...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-stone-800 p-10 rounded-[2.5rem] border border-gold/20 shadow-2xl text-center">
          <div className="relative w-48 h-12 mx-auto mb-8">
            <Image src="/wealthsprings-logo-white.png" alt="Logo" fill className="object-contain" />
          </div>
          <h1 className="text-2xl text-white mb-6 serif italic">Acesso Restrito</h1>
          <input
            type="password"
            className="w-full p-4 bg-stone-900 border border-white/10 rounded-full text-white mb-4 outline-none focus:border-gold"
            placeholder="Senha Mestra"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {authError && <p className="text-red-400 text-xs mb-4">{authError}</p>}
          <button className="w-full py-4 bg-gold text-stone-900 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors">Entrar no Painel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-champagne p-4 md:p-10">
      <div className="max-w-7xl mx-auto mb-10 md:flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif italic text-stone-900">Backoffice Portal</h1>
          <nav className="flex gap-8 mt-6">
            <button onClick={() => setActiveTab('leads')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'leads' ? 'text-gold border-b-2 border-gold' : 'text-stone-400 hover:text-stone-600'}`}>Inscrições</button>
            <button onClick={() => setActiveTab('assets')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'assets' ? 'text-gold border-b-2 border-gold' : 'text-stone-400 hover:text-stone-600'}`}>Flyers & Design</button>
            <button onClick={() => setActiveTab('content')} className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${activeTab === 'content' ? 'text-gold border-b-2 border-gold' : 'text-stone-400 hover:text-stone-600'}`}>Textos do Site</button>
          </nav>
        </div>
        <button onClick={onExit} className="mt-6 md:mt-0 px-8 py-3 bg-white border border-stone-200 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-red-500 hover:border-red-200 transition-all">Sair do Painel</button>
      </div>

      {activeTab === 'leads' && (
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-100 animate-fade-in">
          <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/30">
            <h2 className="serif italic text-xl text-stone-800">Candidatos Confirmados</h2>
            <input type="text" placeholder="Filtrar..." className="px-6 py-2 bg-white rounded-full border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-gold/20" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <table className="w-full text-left">
            <thead className="bg-stone-50/50">
              <tr>
                <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-stone-400">Nome</th>
                <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-stone-400">Email / Tel</th>
                <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-stone-400">Status</th>
                <th className="px-8 py-4 text-[9px] uppercase tracking-widest text-stone-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {leads.filter((l: any) => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map((lead: any) => (
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
                      {lead.status === 'Approved' ? '✓ Aprovado' : 'Pendente'}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => { if (confirm("Apagar lead?")) deleteRegistrant({ id: lead._id }) }} className="text-stone-200 hover:text-red-500 transition-colors"><i className="fa-solid fa-trash-can"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
          <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-lg h-fit">
            <h3 className="serif italic text-2xl mb-6 text-stone-800">Upload de Flyer</h3>
            <form onSubmit={handleUploadAsset} className="space-y-5">
              <div className="border-2 border-dashed border-stone-100 rounded-[1.5rem] p-8 text-center bg-stone-50/30 group hover:border-gold/30 transition-all cursor-pointer relative" onClick={() => imageInput.current?.click()}>
                {selectedFile ? (
                  <div className="text-xs font-bold text-gold">{selectedFile.name}</div>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-3xl text-stone-200 mb-4 group-hover:text-gold transition-colors"></i>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Arraste ou clique para selecionar</p>
                  </>
                )}
                <input type="file" ref={imageInput} className="hidden" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              </div>
              <input type="text" placeholder="Título do Flyer (ex: Evento Luanda)" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={assetTitle} onChange={(e) => setAssetTitle(e.target.value)} />
              <textarea placeholder="Descrição curta..." className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm h-24" value={assetDesc} onChange={(e) => setAssetDesc(e.target.value)} />
              <button disabled={isUploading || !selectedFile || !assetTitle} className="w-full py-4 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-gold transition-all disabled:opacity-30">
                {isUploading ? "Enviando para Servidor..." : "Publicar na Galeria"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="serif italic text-2xl text-stone-800">Galeria de Assets</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {assets.map((asset: any) => (
                <div key={asset._id} className="bg-white p-4 rounded-[2rem] border border-stone-100 shadow-md group relative">
                  <div className="relative aspect-video w-full rounded-[1.5rem] overflow-hidden mb-4 bg-stone-900">
                    <Image src={asset.fileUrl} alt={asset.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a href={asset.fileUrl} target="_blank" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-stone-900"><i className="fa-solid fa-eye"></i></a>
                      <button onClick={() => { if (confirm("Deletar asset?")) deleteAsset({ id: asset._id }) }} className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm px-2">{asset.title}</h4>
                  <p className="text-[10px] text-stone-400 px-2 line-clamp-1">{asset.description || "Sem descrição"}</p>
                </div>
              ))}
              {assets.length === 0 && <div className="col-span-2 p-20 text-center text-stone-300 italic border border-dashed rounded-[2rem]">Nenhum flyer publicado ainda.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          <div className="bg-white p-10 rounded-[2.5rem] border border-stone-100 shadow-xl">
            <div className="flex justify-between items-center mb-10 border-b pb-6 border-stone-50">
              <h3 className="serif italic text-2xl">Página Masterclass</h3>
              <button onClick={() => handleSaveContent("hero", heroData)} disabled={isSaving} className="px-8 py-2.5 bg-gold text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-gold/20">{isSaving ? "Salvando..." : "Publicar Texto"}</button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold mb-3 block">Chamada (Tag)</label>
                  <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.tag || ""} onChange={(e) => setHeroData({ ...heroData, tag: e.target.value })} />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">Título Prefixo</label>
                  <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.title_prefix || ""} onChange={(e) => setHeroData({ ...heroData, title_prefix: e.target.value })} />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">Título Destaque</label>
                  <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.title_highlight || ""} onChange={(e) => setHeroData({ ...heroData, title_highlight: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">Subtítulo (Abaixo do Título)</label>
                <textarea className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm h-32" value={heroData?.subtitle || ""} onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">Localização Exibida</label>
                  <input type="text" className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-gold text-sm" value={heroData?.location_val || ""} onChange={(e) => setHeroData({ ...heroData, location_val: e.target.value })} />
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-stone-400 mb-3 block">Data & Hora</label>
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
              <h3 className="serif italic text-2xl">Currículo do Evento</h3>
              <button onClick={() => handleSaveContent("curriculum", curriculumData)} disabled={isSaving} className="px-8 py-2.5 bg-stone-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">{isSaving ? "Salvando..." : "Atualizar Pilares"}</button>
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
    </div>
  );
};

export default Backoffice;
