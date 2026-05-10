import React, { useState } from 'react';
import { Smartphone, Download, Share2, Navigation, Heart, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { LISTING_INFO } from '../data/viviData';

interface HeaderOverlayProps {
  onOpenPhotos: () => void;
  onNavigateToCart: () => void;
  cartCount: number;
}

export const HeaderOverlay: React.FC<HeaderOverlayProps> = ({ 
  onOpenPhotos, 
  onNavigateToCart,
  cartCount 
}) => {
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [sentPhone, setSentPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  const handleDownload = () => {
    setDownloadState('downloading');
    setTimeout(() => {
      setDownloadState('done');
    }, 1500);
  };

  const handleSendToPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneInput.trim()) {
      setSentPhone(true);
      setTimeout(() => setSentPhone(false), 4000);
      setPhoneInput('');
    }
  };

  return (
    <div className="bg-stone-900 text-stone-100 sticky top-0 z-50 border-b border-stone-800 shadow-xl">
      {/* Premium Notification Strip */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 text-white text-xs sm:text-sm font-medium px-4 py-1.5 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Ganhe <strong>15% OFF</strong> no primeiro pedido instalando nosso App ou pelo Menu Web!</span>
        <span className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded text-[11px]">Cupom: VIVI15</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Left branding & action prompt */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="bg-red-600 text-white p-2 rounded-lg shadow-md flex items-center justify-center font-bold text-lg font-serif-custom">
              V
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold leading-tight flex items-center gap-1.5">
                {LISTING_INFO.name} <span className="text-amber-400 text-xs font-normal">★ {LISTING_INFO.rating}</span>
              </h2>
              <p className="text-stone-400 text-xs">Pizzaria Premium · Centro, Coração de Maria</p>
            </div>
          </div>

          {/* Quick Stats Trigger */}
          <button 
            onClick={onOpenPhotos}
            className="flex items-center gap-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs px-3 py-1.5 rounded-full transition-colors border border-stone-700 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Ver fotos (28)</span>
          </button>
        </div>

        {/* Center/Right quick Google Maps simulation tools */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto text-xs">
          
          {/* Baixar o aplicativo trigger */}
          <div className="bg-stone-800/80 p-1 rounded-lg border border-stone-700/60 flex items-center gap-2">
            <span className="text-stone-300 px-2 hidden sm:inline">📱 App exclusivo:</span>
            {downloadState === 'idle' && (
              <button 
                onClick={handleDownload}
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold px-3 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar o aplicativo</span>
              </button>
            )}
            {downloadState === 'downloading' && (
              <span className="text-amber-400 font-medium px-3 py-1 flex items-center gap-1.5 animate-pulse">
                <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                Baixando ViviPizzas.apk...
              </span>
            )}
            {downloadState === 'done' && (
              <span className="text-emerald-400 font-medium px-3 py-1 flex items-center gap-1 bg-emerald-950/50 rounded-md border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                App Instalado com Sucesso!
              </span>
            )}
          </div>

          {/* Quick Listing Actions */}
          <div className="flex items-center gap-1">
            <a 
              href="#maps-widget" 
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 p-1.5 sm:px-2.5 rounded flex items-center gap-1 transition-colors title='Ver Rotas'"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Rotas</span>
            </a>

            <button 
              onClick={() => setSaved(!saved)}
              className={`p-1.5 sm:px-2.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${saved ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-stone-800 hover:bg-stone-700 text-stone-200'}`}
              title="Salvar no seu histórico do Google Maps"
            >
              <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current text-red-500' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Salvo' : 'Salvar'}</span>
            </button>

            <button 
              onClick={() => {
                setShared(true);
                setTimeout(() => setShared(false), 3000);
              }}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 p-1.5 sm:px-2.5 rounded flex items-center gap-1 transition-colors cursor-pointer relative"
              title="Compartilhar"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Compartilhar</span>
              {shared && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-stone-900 text-[10px] py-0.5 px-2 rounded shadow-lg whitespace-nowrap font-medium">
                  Link copiado!
                </span>
              )}
            </button>
          </div>

          {/* Enviar para o smartphone Quick Sender */}
          <form onSubmit={handleSendToPhone} className="flex items-center gap-1 bg-stone-950 p-1 rounded-md border border-stone-800 w-full sm:w-auto mt-1 sm:mt-0">
            <Smartphone className="w-3.5 h-3.5 text-stone-400 ml-1" />
            <input 
              type="text" 
              placeholder="Seu WhatsApp (DD) 9..." 
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none w-32 sm:w-40 px-1 placeholder:text-stone-600"
            />
            <button 
              type="submit"
              className="bg-stone-800 hover:bg-stone-700 px-2 py-1 rounded text-stone-300 text-[11px] whitespace-nowrap cursor-pointer transition-colors"
            >
              Enviar link
            </button>
          </form>
        </div>

        {/* Live Shopping Cart link / Next Button */}
        {cartCount > 0 && (
          <button
            onClick={onNavigateToCart}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 text-xs shadow-md animate-bounce cursor-pointer"
          >
            <span>🍕 {cartCount} item(s) no carrinho</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

      </div>

      {sentPhone && (
        <div className="bg-emerald-900 text-emerald-100 text-xs px-4 py-1 text-center flex items-center justify-center gap-1 animate-fade-in transition-all">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Link de acesso rápido e cardápio de Vivi Pizzas enviado com sucesso para seu smartphone via SMS/WhatsApp!</span>
        </div>
      )}
    </div>
  );
};
