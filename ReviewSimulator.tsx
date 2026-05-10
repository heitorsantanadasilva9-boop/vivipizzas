import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  Share2, 
  Smartphone, 
  Heart, 
  ChevronRight, 
  CheckCircle, 
  Copy 
} from 'lucide-react';
import { LISTING_INFO } from '../data/viviData';

export const MapsInfoWidget: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPlus, setCopiedPlus] = useState(false);
  const [simulatedChangeText, setSimulatedChangeText] = useState('');
  const [changeSubmitted, setChangeSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const copyToClipboard = (text: string, type: 'address' | 'plus') => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 3000);
    } else {
      setCopiedPlus(true);
      setTimeout(() => setCopiedPlus(false), 3000);
    }
  };

  const handleSuggestChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (simulatedChangeText.trim()) {
      setChangeSubmitted(true);
      setTimeout(() => {
        setChangeSubmitted(false);
        setSimulatedChangeText('');
      }, 4000);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 scroll-mt-20" id="maps-widget">
      
      {/* Top listing header style */}
      <div className="border-b border-stone-100 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-500 tracking-wider block uppercase">
              Visão Geral · Google Maps Local Emulator
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-0.5">{LISTING_INFO.name}</h3>
          </div>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            {LISTING_INFO.hours}
          </span>
        </div>

        {/* Categories & options from prompt */}
        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-stone-600">
          <span className="font-medium text-stone-900">{LISTING_INFO.category}</span>
          <span>·</span>
          <span>{LISTING_INFO.priceInfoText}</span>
        </div>

        {/* Verified options */}
        <div className="mt-3 flex flex-wrap items-center gap-3 bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs font-medium text-stone-800">
          <span className="text-stone-500 font-bold">Opções de serviço:</span>
          {LISTING_INFO.serviceOptions.map(opt => (
            <span key={opt} className="flex items-center gap-1 text-emerald-700 font-bold bg-white px-2 py-0.5 rounded shadow-2xs border border-emerald-100">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>{opt}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Google Maps Quick Icon Strip exactly matching text: Rotas, Salvar, Próximo, Enviar para o smartphone, Compartilhar */}
      <div className="grid grid-cols-5 gap-1 py-4 text-center border-b border-stone-100">
        
        <a 
          href="https://maps.google.com/?q=Vivi+Pizzas+Coração+de+Maria" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-stone-50 group transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs mx-auto">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-blue-600 mt-1 block">Rotas</span>
        </a>

        <button 
          onClick={() => setSaved(!saved)}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-stone-50 group transition-colors cursor-pointer"
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs mx-auto ${saved ? 'bg-red-600 text-white' : 'bg-stone-100 text-stone-700'}`}>
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[10px] font-medium text-stone-700 mt-1 block">
            {saved ? 'Salvo' : 'Salvar'}
          </span>
        </button>

        <button 
          onClick={() => alert("Navegando para o próximo estabelecimento listado na região de Coração de Maria - BA...")}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-stone-50 group transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs mx-auto">
            <ChevronRight className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium text-stone-700 mt-1 block">Próximo</span>
        </button>

        <button 
          onClick={() => {
            const num = prompt("Digite o número do seu smartphone para receber as coordenadas via SMS:");
            if (num) alert(`Coordenadas e cardápio de Vivi Pizzas enviados para ${num}!`);
          }}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-stone-50 group transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs mx-auto">
            <Smartphone className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] font-medium text-stone-700 mt-1 block leading-tight">Enviar p/ cel</span>
        </button>

        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Link do portal Vivi Pizzas copiado para a área de transferência!");
          }}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-stone-50 group transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs mx-auto">
            <Share2 className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-[10px] font-medium text-stone-700 mt-1 block">Compart.</span>
        </button>

      </div>

      {/* Address & Plus Code details exactly mirroring raw listing text */}
      <div className="space-y-3 py-4 text-xs text-stone-800">
        
        {/* Address */}
        <div className="flex items-start justify-between gap-2 p-2 rounded hover:bg-stone-50 transition-colors">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-stone-900">Endereço Principal</span>
              <p className="text-stone-600 mt-0.5 select-all">{LISTING_INFO.address}</p>
            </div>
          </div>

          <button 
            onClick={() => copyToClipboard(LISTING_INFO.address, 'address')}
            className="text-stone-400 hover:text-stone-900 p-1.5 rounded bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            title="Copiar Endereço"
          >
            <Copy className="w-3 h-3" />
            <span className="text-[9px] hidden sm:inline">{copiedAddress ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        {/* Plus code */}
        <div className="flex items-start justify-between gap-2 p-2 rounded hover:bg-stone-50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="bg-stone-200 text-stone-700 text-[10px] font-black px-1.5 py-0.5 rounded shrink-0 mt-0.5 font-mono">
              + Code
            </div>
            <div>
              <span className="font-bold block text-stone-900">Plus Code (Google Maps)</span>
              <p className="text-stone-600 font-mono text-[11px] mt-0.5 select-all">{LISTING_INFO.plusCode}</p>
              <span className="text-[10px] text-stone-400 block mt-0.5">Informado para precisão máxima de GPS</span>
            </div>
          </div>

          <button 
            onClick={() => copyToClipboard(LISTING_INFO.plusCode, 'plus')}
            className="text-stone-400 hover:text-stone-900 p-1.5 rounded bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            title="Copiar Plus Code"
          >
            <Copy className="w-3 h-3" />
            <span className="text-[9px] hidden sm:inline">{copiedPlus ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>

        {/* Phone */}
        <div className="flex items-center justify-between gap-2 p-2 rounded hover:bg-stone-50 transition-colors">
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block text-stone-900">Telefone e WhatsApp</span>
              <a href={`tel:${LISTING_INFO.phone.replace(/\D/g, '')}`} className="text-emerald-700 font-bold hover:underline select-all block">
                {LISTING_INFO.phone}
              </a>
            </div>
          </div>

          <a 
            href={`https://wa.me/5575982262466?text=Olá+Vivi+Pizzas!+Gostaria+de+fazer+um+pedido+pelo+cardápio+online.`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1 px-2 rounded.md transition-colors inline-block"
          >
            Chamar no WhatsApp
          </a>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-3 p-2">
          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-stone-900">Horários informados</span>
            <p className="text-stone-600 mt-0.5">Todos os dias: <strong className="text-stone-900">18:00 às 23:00</strong></p>
            <span className="text-[10px] text-stone-400 block mt-0.5">Dica: Sábados têm horários de pico às 18h e 21h.</span>
          </div>
        </div>

      </div>

      {/* Sugerir mudança / Adic. informações ausentes / Adicionar website exactly mirroring prompt */}
      <div className="mt-4 pt-4 border-t border-stone-100 bg-stone-50 p-3 rounded-xl">
        <span className="text-[10px] font-bold uppercase text-stone-500 block mb-2">
          Colaboração com a comunidade Maps
        </span>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] text-stone-700 font-medium bg-white px-2 py-1 rounded border border-stone-200">
            ✏️ Sugerir mudança
          </span>
          <span className="text-[11px] text-stone-700 font-medium bg-white px-2 py-1 rounded border border-stone-200">
            ➕ Adic. informações ausentes
          </span>
          <button 
            onClick={() => alert("Website oficial configurado com sucesso! Link atual: " + window.location.host)}
            className="text-[11px] text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border border-blue-200 transition-colors cursor-pointer"
          >
            🔗 Adicionar website
          </button>
        </div>

        {/* Interactive suggestions form */}
        <form onSubmit={handleSuggestChange} className="mt-2">
          <textarea
            required
            rows={2}
            value={simulatedChangeText}
            onChange={(e) => setSimulatedChangeText(e.target.value)}
            placeholder="Encontrou algum dado incorreto sobre horários ou cardápio? Sugira uma edição à listagem aqui..."
            className="w-full text-xs p-2 bg-white rounded border border-stone-200 focus:outline-none focus:border-amber-500 text-stone-800 resize-none placeholder:text-stone-400"
          />
          
          <div className="flex justify-end mt-1">
            <button
              type="submit"
              className="bg-stone-800 hover:bg-stone-700 text-white text-[10px] font-bold py-1 px-2.5 rounded transition-colors cursor-pointer"
            >
              Enviar Sugestão ao Local Guide
            </button>
          </div>
        </form>

        {changeSubmitted && (
          <div className="mt-2 bg-emerald-100 text-emerald-900 text-[11px] p-2 rounded text-center animate-fade-in font-medium">
            ✓ Sugestão recebida! Ela será revisada e informada para as 9 pessoas de Coração de Maria.
          </div>
        )}

      </div>

      <div className="mt-3 text-center">
        <span className="text-[10px] text-stone-400 font-mono">
          Seu histórico do Google Maps ativo · Adicionar marcador ativado
        </span>
      </div>

    </div>
  );
};
