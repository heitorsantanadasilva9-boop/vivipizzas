import { useState } from 'react';
import { 
  Phone, 
  Star, 
  Sparkles, 
  Info, 
  CheckCircle, 
  Flame,
  Utensils
} from 'lucide-react';

// Import our structured components and data
import { LISTING_INFO } from './data/viviData';
import { HeaderOverlay } from './components/HeaderOverlay';
import { MapsInfoWidget } from './components/MapsInfoWidget';
import { PeakHoursWidget } from './components/PeakHoursWidget';
import { InteractiveMenu } from './components/InteractiveMenu';
import { MediaGallery } from './components/MediaGallery';
import { ReviewSimulator } from './components/ReviewSimulator';
import { PizzaBuilder } from './components/PizzaBuilder';

export default function App() {
  const [cartCount, setCartCount] = useState<number>(1);
  const [customItemsFromBuilder, setCustomItemsFromBuilder] = useState<Array<{ name: string; price: number; desc: string }>>([]);
  const [activeNavAnchor, setActiveNavAnchor] = useState<string>('geral');

  const scrollToSection = (id: string) => {
    setActiveNavAnchor(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReceiveCustomItem = (item: { name: string; price: number; desc: string }) => {
    setCustomItemsFromBuilder(prev => [...prev, item]);
    // automatically scroll to cart to let them see it added!
    scrollToSection('cardapio');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      
      {/* 1. Header Smart Overlay (Baixar o aplicativo, Ver fotos, Enviar para o smartphone, Compartilhar) */}
      <HeaderOverlay 
        onOpenPhotos={() => scrollToSection('galeria-fotos')} 
        onNavigateToCart={() => scrollToSection('cardapio')}
        cartCount={cartCount}
      />

      {/* Hero Welcome Cover Section */}
      <header className="bg-stone-950 text-white relative overflow-hidden bg-pizza-glow py-12 lg:py-16 px-4">
        
        {/* Background ambient picture overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main info text */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Condecorada com nota 4,9 ⭐ por clientes reais</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-serif-custom leading-none">
              {LISTING_INFO.name}
            </h1>

            <p className="text-lg sm:text-xl text-stone-300 font-light max-w-xl mx-auto lg:mx-0">
              A mais celebrada <strong className="text-amber-400 font-bold">{LISTING_INFO.category}</strong> do centro de Coração de Maria, Bahia. Saboreie os autênticos sucessos informados pela vizinhança.
            </p>

            {/* Quick Price & Info indicators requested by prompt */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs">
              
              <span className="bg-stone-900/90 text-amber-400 px-3 py-1.5 rounded-lg border border-stone-800 shadow-inner flex items-center gap-1.5 font-bold">
                <span>R$ 20–40 por pessoa</span>
              </span>

              <span className="bg-stone-900/90 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-800 shadow-inner flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                <span>Informado por 9 pessoas ativas</span>
              </span>

              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold font-mono animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                {LISTING_INFO.hours}
              </span>

            </div>

            {/* Service options pill strip */}
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider font-bold">Serviços:</span>
              {LISTING_INFO.serviceOptions.map(opt => (
                <span key={opt} className="bg-white/10 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3 h-3 text-amber-400" />
                  {opt}
                </span>
              ))}
            </div>

            {/* Live Phone trigger */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a 
                href={`tel:${LISTING_INFO.phone.replace(/\D/g, '')}`}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>Ligar Agora: {LISTING_INFO.phone}</span>
              </a>

              <button
                onClick={() => scrollToSection('monte-sua-pizza')}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-stone-950 font-black text-sm px-5 py-3 rounded-xl transition-all shadow flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
              >
                <Utensils className="w-4 h-4 text-stone-950" />
                <span>Montar Pizza Interativa</span>
              </button>
            </div>

          </div>

          {/* Right Hero Badge Visual showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="w-full max-w-sm bg-stone-900/90 backdrop-blur-md p-6 rounded-2xl border border-amber-500/30 shadow-2xl relative">
              
              <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow animate-bounce">
                Destaques Populares
              </div>

              <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wide flex items-center gap-1.5 mb-3">
                <Flame className="w-4 h-4 text-red-500 fill-current" />
                Os Mais Pedidos do Cardápio
              </h4>

              <div className="space-y-3 text-xs">
                
                <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 flex items-center gap-3">
                  <span className="text-xl">🍕</span>
                  <div>
                    <span className="font-bold text-stone-100 block">Calabresa</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">Clássica, fatiada fininha com muita cebola e orégano</p>
                  </div>
                </div>

                <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 flex items-center gap-3">
                  <span className="text-xl">🥓</span>
                  <div>
                    <span className="font-bold text-stone-100 block">Frango Com Catupiry E Bacon</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">Frango desfiado artesanal com o verdadeiro Catupiry</p>
                  </div>
                </div>

                <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 flex items-center gap-3">
                  <span className="text-xl">❤️</span>
                  <div>
                    <span className="font-bold text-stone-100 block">De Bacon A Vida</span>
                    <p className="text-[11px] text-stone-400 mt-0.5">A receita exclusiva para apaixonados por bacon crocante</p>
                  </div>
                </div>

              </div>

              <div className="mt-4 pt-3 border-t border-stone-800 text-center">
                <button
                  onClick={() => scrollToSection('cardapio')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold underline transition-colors cursor-pointer block w-full"
                >
                  Visualizar todos os tamanhos e preços →
                </button>
              </div>

            </div>

            <div className="mt-4 text-center">
              <span className="text-[11px] text-stone-400 block font-mono">
                📍 {LISTING_INFO.address}
              </span>
              <span className="text-[10px] text-stone-500 block mt-0.5">
                Plus Code: <strong className="text-stone-300">{LISTING_INFO.plusCode}</strong>
              </span>
            </div>

          </div>

        </div>
      </header>

      {/* 2. Google Maps Navigation Anchor Bar exactly mimicking: Visão geral, Cardápio, Avaliações, Sobre */}
      <nav className="bg-white border-b border-stone-200 sticky top-12 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto">
          
          <div className="flex items-center gap-2 sm:gap-6 py-3 min-w-max">
            
            <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider mr-2 hidden sm:inline-block">
              Navegação Rápida:
            </span>

            <button 
              onClick={() => scrollToSection('geral')}
              className={`text-xs sm:text-sm font-bold pb-1 transition-all cursor-pointer ${
                activeNavAnchor === 'geral' 
                  ? 'text-red-600 border-b-2 border-red-600 scale-105' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Visão geral
            </button>

            <button 
              onClick={() => scrollToSection('cardapio')}
              className={`text-xs sm:text-sm font-bold pb-1 transition-all cursor-pointer ${
                activeNavAnchor === 'cardapio' 
                  ? 'text-red-600 border-b-2 border-red-600 scale-105' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Cardápio
            </button>

            <button 
              onClick={() => scrollToSection('avaliacoes')}
              className={`text-xs sm:text-sm font-bold pb-1 transition-all cursor-pointer flex items-center gap-1 ${
                activeNavAnchor === 'avaliacoes' 
                  ? 'text-red-600 border-b-2 border-red-600 scale-105' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Avaliações</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-black">4,9</span>
            </button>

            <button 
              onClick={() => scrollToSection('sobre')}
              className={`text-xs sm:text-sm font-bold pb-1 transition-all cursor-pointer ${
                activeNavAnchor === 'sobre' 
                  ? 'text-red-600 border-b-2 border-red-600 scale-105' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sobre
            </button>

            <button 
              onClick={() => scrollToSection('monte-sua-pizza')}
              className="bg-amber-500 text-stone-950 text-xs font-black px-2.5 py-1 rounded-md shadow-xs animate-pulse cursor-pointer ml-4"
            >
              + Criar Pizza
            </button>

          </div>

          <div className="text-[11px] text-stone-500 hidden md:flex items-center gap-1">
            <span>Baixar o aplicativo ativado</span>
            <span>·</span>
            <span>Refeição no local</span>
          </div>

        </div>
      </nav>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">

        {/* Visão Geral Section (Side by side Maps Panel + Peak Hours Chart) */}
        <div id="geral" className="scroll-mt-20">
          
          <div className="mb-3">
            <h2 className="text-xs font-black uppercase text-amber-600 tracking-widest font-mono">
              [ Aba 1 ]
            </h2>
            <h3 className="text-2xl font-bold font-serif-custom text-stone-900">
              Visão Geral · Dados do Estabelecimento
            </h3>
            <p className="text-xs text-stone-500">
              Informações autênticas mapeadas no Centro de Coração de Maria, BA.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Maps Emulator exactly mimicking the prompt (5 cols) */}
            <div className="lg:col-span-5">
              <MapsInfoWidget />
            </div>

            {/* Right side: Interactive Peak hours bar chart exactly mimicking Saturdays 06, 09, 12, 15, 18, 21 (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <PeakHoursWidget />
              
              {/* Highlight promotional snippet */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/80 shadow-2xs">
                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-600 fill-current" />
                  <span>Curiosidade sobre os preços (R$ 20–40)</span>
                </h4>
                <p className="text-xs text-stone-700 mt-2 leading-relaxed font-light">
                  De acordo com os relatórios do Google Maps, <strong>9 pessoas independentes</strong> informaram recentemente que a faixa de preço por refeição de Vivi Pizzas permanece consistentemente na categoria acessível de <strong>R$ 20 a R$ 40 por pessoa</strong>. Isso faz com que nossa pizzaria seja a escolha predileta tanto para refeição no local com a família, quanto para entrega via motoboy aos sábados à noite.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="bg-white text-stone-800 font-bold text-[11px] px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs">
                    🏷️ Refeição no local
                  </span>
                  <span className="bg-white text-stone-800 font-bold text-[11px] px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs">
                    🏷️ Entrega
                  </span>
                  <span className="bg-white text-stone-800 font-bold text-[11px] px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs">
                    🏷️ Aberto · Fecha 23:00
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Interactive Pizza Builder Widget (Crie sua pizza) */}
        <PizzaBuilder onAddCustomToCart={handleReceiveCustomItem} />

        {/* Cardápio e Destaques Section (Interactive Menu with live Reactive Cart) */}
        <InteractiveMenu 
          customItems={customItemsFromBuilder}
          onClearCustomItems={() => setCustomItemsFromBuilder([])}
          onUpdateCartTotalCount={(count) => setCartCount(count)}
        />

        {/* Fotos e Vídeos Gallery Section exactly filtered by categories */}
        <MediaGallery isOpen={true} />

        {/* Resumo de Avaliações Section (Interactive Review Simulator) */}
        <ReviewSimulator />

        {/* Sobre Section */}
        <div id="sobre" className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200 scroll-mt-20">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase text-red-600 tracking-widest block font-mono">
              Nossa História
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-1 font-serif-custom">
              Sobre a Vivi Pizzas
            </h3>
            
            <p className="text-xs text-stone-700 mt-3 leading-relaxed">
              Localizada estrategicamente na <strong>R. Anísio Teixeira - Centro, Coração de Maria - BA, 44250-000</strong>, a Vivi Pizzas nasceu com o propósito de elevar o padrão da gastronomia local. Trabalhamos exclusivamente com ingredientes selecionados, molhos artesanais maturados com ervas frescas e massas de fermentação controlada.
            </p>

            <p className="text-xs text-stone-700 mt-2 leading-relaxed">
              Nosso Plus Code oficial no Google Maps é <strong>Q723+8P Coração de Maria, Bahia</strong>, que facilita entregas precisas em todos os bairros da cidade. Mantemos um orgulhoso score de <strong>4,9 de 5 estrelas</strong>, sendo uma das pizzarias mais bem avaliadas de todo o estado da Bahia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-100">
              
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/60">
                <span className="font-bold text-stone-900 text-xs block">🕒 Horário Padrão</span>
                <p className="text-[11px] text-stone-600 mt-1">
                  Aberto todos os dias.<br/>Das 18:00 às 23:00.
                </p>
              </div>

              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/60">
                <span className="font-bold text-stone-900 text-xs block">📞 Contato de Pedido</span>
                <p className="text-[11px] text-stone-600 mt-1">
                  (75) 98226-2466<br/>Ligação e WhatsApp.
                </p>
              </div>

              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200/60">
                <span className="font-bold text-stone-900 text-xs block">💳 Preço Médio</span>
                <p className="text-[11px] text-stone-600 mt-1">
                  R$ 20 a R$ 40 por pessoa.<br/>(Informado por 9 pessoas)
                </p>
              </div>

            </div>

            <div className="mt-4 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Seu histórico do Google Maps está ativado para esta sessão. Clique em <strong>Adicionar marcador</strong> ou <strong>Sugerir mudança</strong> acima a qualquer momento.
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* Premium Footer App download reminder */}
      <footer className="bg-stone-900 text-white mt-12 border-t border-stone-800">
        
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white p-1.5 rounded font-bold font-serif-custom text-base">V</div>
              <span className="font-bold text-base tracking-tight">{LISTING_INFO.name}</span>
            </div>
            <p className="text-stone-400 text-[11px]">
              A verdadeira arte da pizza em Coração de Maria, Bahia. Nota 4,9 baseada em 28 avaliações de guias locais.
            </p>
            <p className="text-amber-500 font-mono text-[10px]">
              Plus Code: Q723+8P Coração de Maria, Bahia
            </p>
          </div>

          <div>
            <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-3">
              Ações Google Maps
            </h5>
            <ul className="space-y-2 text-stone-300">
              <li><button onClick={() => scrollToSection('maps-widget')} className="hover:text-white transition-colors cursor-pointer">🧭 Traçar Rotas</button></li>
              <li><button onClick={() => scrollToSection('maps-widget')} className="hover:text-white transition-colors cursor-pointer">❤️ Salvar no Histórico</button></li>
              <li><button onClick={() => alert("Enviando coordenadas via link Push para o seu smartphone...")} className="hover:text-white transition-colors cursor-pointer">📱 Enviar para o smartphone</button></li>
              <li><button onClick={() => scrollToSection('galeria-fotos')} className="hover:text-white transition-colors cursor-pointer">📸 Ver todas as fotos (28)</button></li>
              <li><button onClick={() => alert("Baixando o app...")} className="hover:text-white transition-colors cursor-pointer font-bold text-amber-500">⬇️ Baixar o aplicativo oficial</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-3">
              Destaques do Cardápio
            </h5>
            <ul className="space-y-2 text-stone-300">
              <li><button onClick={() => scrollToSection('cardapio')} className="hover:text-white transition-colors cursor-pointer">🍕 Pizza de Calabresa</button></li>
              <li><button onClick={() => scrollToSection('cardapio')} className="hover:text-white transition-colors cursor-pointer">🥓 Frango Com Catupiry E Bacon</button></li>
              <li><button onClick={() => scrollToSection('cardapio')} className="hover:text-white transition-colors cursor-pointer">🔥 De Bacon A Vida</button></li>
              <li><button onClick={() => scrollToSection('monte-sua-pizza')} className="hover:text-white transition-colors cursor-pointer text-emerald-400">✨ Crie sua própria pizza</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-3">
              Informações Mapeadas
            </h5>
            <p className="text-stone-300">
              <strong>Endereço:</strong> {LISTING_INFO.address}
            </p>
            <p className="text-stone-300 mt-2">
              <strong>Telefone:</strong> {LISTING_INFO.phone}
            </p>
            <p className="text-stone-300 mt-2">
              <strong>Preço informado:</strong> {LISTING_INFO.priceRange} por pessoa (Informado por 9 pessoas)
            </p>
            <p className="text-stone-300 mt-2">
              <strong>Status atual:</strong> {LISTING_INFO.hours}
            </p>
          </div>

        </div>

        <div className="bg-stone-950 py-4 border-t border-stone-850 text-center text-[10px] text-stone-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Vivi Pizzas · Todos os direitos reservados. Integrado com Google Maps API Emulator.</span>
            <span>Refeição no local · Entrega · Adicionar marcador ativado</span>
          </div>
        </div>

      </footer>

    </div>
  );
}
