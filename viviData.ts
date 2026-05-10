import React, { useState } from 'react';
import { Image as ImageIcon, Video, Eye, MapPin, Sparkles, X, RotateCw, ExternalLink, Heart } from 'lucide-react';
import { GALLERY_ITEMS, GalleryItem } from '../data/viviData';

interface MediaGalleryProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = () => {
  const categories = ['Tudo', 'Cardápio', 'Vídeos', 'Gastronomia', 'Ambiente', 'Pizza', 'Do proprietário', 'Street View e 360°'];
  const [activeCategory, setActiveCategory] = useState<string>('Tudo');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    g1: 45, g2: 32, g3: 19, g4: 88, g5: 12, g6: 150, g7: 29, g8: 64
  });

  const filteredItems = activeCategory === 'Tudo' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => {
        if (activeCategory === 'Do proprietário') {
          return item.author === 'Do proprietário';
        }
        return item.category === activeCategory;
      });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikeCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 scroll-mt-20" id="galeria-fotos">
      
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-stone-900">Fotos e vídeos interativos</h3>
            <span className="bg-stone-100 text-stone-800 text-xs font-bold px-2 py-0.5 rounded-full">
              28 disponíveis
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-0.5">
            Imagens autênticas informadas por clientes e pelo proprietário em Coração de Maria
          </p>
        </div>

        {/* Upload simulated button */}
        <button 
          onClick={() => alert("Upload de fotos de clientes habilitado. Selecione suas fotos da nossa deliciosa pizza!")}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Adicionar fotos e vídeos</span>
        </button>
      </div>

      {/* Categories Horizontal Tabs exactly mimicking the listing */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 my-2 scrollbar-thin">
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive 
                  ? 'bg-red-600 text-white shadow-xs font-bold scale-105' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat === 'Street View e 360°' ? '🧭 Street View e 360°' : cat}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-2">
        {filteredItems.map(item => {
          const isVideo = item.type === 'video';
          const is360 = item.type === '360';

          return (
            <div 
              key={item.id}
              onClick={() => {
                setLightboxItem(item);
                setRotationAngle(0);
              }}
              className="group relative bg-stone-100 rounded-xl overflow-hidden aspect-4/3 cursor-pointer border border-stone-200/80 hover:border-amber-400 transition-all shadow-2xs hover:shadow-md"
            >
              {/* Background Image embed */}
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />

              {/* Overlays for Video / 360 badges */}
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                {isVideo && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                    <Video className="w-3 h-3 animate-pulse" />
                    VÍDEO
                  </span>
                )}
                {is360 && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                    <MapPin className="w-3 h-3" />
                    STREET VIEW 360°
                  </span>
                )}
                <span className="bg-stone-900/80 backdrop-blur-xs text-stone-200 text-[9px] px-1.5 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              {/* Quick interactive like button overlay */}
              <button
                onClick={(e) => handleLike(item.id, e)}
                className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-xs transition-all flex items-center gap-1 text-[10px] px-2"
                title="Gostei desta foto"
              >
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span>{likeCounts[item.id] || 0}</span>
              </button>

              {/* Bottom detail banner */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-2 pt-6 text-white text-xs flex flex-col justify-end">
                <p className="font-bold truncate leading-tight group-hover:text-amber-400 transition-colors">
                  {item.title}
                </p>
                <div className="flex justify-between items-center text-[10px] text-stone-300 mt-1">
                  <span>Por {item.author}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-2.5 h-2.5" />
                    {item.views}
                  </span>
                </div>
              </div>

              {/* Central click indicator */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                <span className="bg-white/90 text-stone-900 text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-y-0 translate-y-1">
                  {is360 ? 'Abrir Panorama 360°' : isVideo ? 'Assistir Vídeo' : 'Ampliar Foto'}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-stone-400 text-xs">
          Nenhuma mídia listada especificamente nesta aba. Tente escolher "Tudo" para visualizar todas as imagens da pizzaria.
        </div>
      )}

      {/* Integrated Lightbox / 360° Simulator Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-2 sm:p-4 animate-fade-in">
          
          {/* Top Actions Bar */}
          <div className="absolute top-4 inset-x-4 max-w-5xl mx-auto flex items-center justify-between z-10 bg-stone-900/80 backdrop-blur-md p-2 rounded-xl border border-stone-800">
            <div className="text-white">
              <span className="bg-amber-500 text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase mr-2">
                {lightboxItem.category}
              </span>
              <h4 className="inline font-bold text-sm sm:text-base">{lightboxItem.title}</h4>
              <p className="text-xs text-stone-400">Publicado por {lightboxItem.author} · {lightboxItem.views}</p>
            </div>

            <div className="flex items-center gap-2">
              {lightboxItem.type === '360' && (
                <button 
                  onClick={() => setRotationAngle(prev => prev + 45)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Girar visualização em 45 graus"
                >
                  <RotateCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Girar 360°</span>
                </button>
              )}

              <button
                onClick={() => setLightboxItem(null)}
                className="bg-stone-800 hover:bg-stone-700 text-white p-2 rounded-lg cursor-pointer transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full max-w-4xl max-h-[75vh] flex items-center justify-center relative mt-12">
            
            {lightboxItem.type === '360' ? (
              <div className="w-full aspect-video bg-stone-900 rounded-xl overflow-hidden relative border-2 border-blue-500 shadow-2xl flex items-center justify-center">
                
                <img 
                  src={lightboxItem.url} 
                  alt="Street View 360"
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: `scale(1.3) rotate(${rotationAngle}deg)` }}
                />

                {/* Simulated interactive drag controls overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 flex flex-col justify-between p-4 pointer-events-none">
                  <div className="text-center mt-8">
                    <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-xs inline-block">
                      Arraste ou use o botão superior para explorar a fachada da R. Anísio Teixeira, Coração de Maria
                    </span>
                  </div>

                  <div className="flex justify-around items-end pb-2">
                    <div className="bg-white/90 backdrop-blur-xs text-stone-900 text-xs p-2 rounded-lg shadow pointer-events-auto cursor-pointer font-bold flex items-center gap-1 hover:bg-amber-400 transition-colors">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Entrar na Pizzaria</span>
                    </div>
                    
                    <div className="bg-white/90 backdrop-blur-xs text-stone-900 text-xs p-2 rounded-lg shadow pointer-events-auto cursor-pointer font-bold flex items-center gap-1 hover:bg-amber-400 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ver Plus Code Q723+8P</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded">
                  Rotação: {rotationAngle % 360}°
                </div>

              </div>
            ) : lightboxItem.type === 'video' ? (
              <div className="w-full aspect-video bg-stone-900 rounded-xl overflow-hidden relative border border-stone-800 flex flex-col items-center justify-center text-center p-4">
                <img 
                  src={lightboxItem.url} 
                  alt="Video background preview" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 blur-xs"
                />
                <div className="relative z-10 max-w-md bg-black/80 backdrop-blur-md p-6 rounded-xl border border-stone-700">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <Video className="w-6 h-6" />
                  </div>
                  <h5 className="text-white font-bold text-sm">Reproduzindo Vídeo Exclusivo</h5>
                  <p className="text-stone-300 text-xs mt-1">
                    Assistindo a crocância e o queijo derretido dos destaques de Vivi Pizzas.
                  </p>
                  
                  {/* Custom progress simulator */}
                  <div className="w-full bg-stone-800 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div className="bg-amber-500 h-full w-2/3 animate-pulse"></div>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-1">0:18 / 0:30</span>

                  <button
                    onClick={() => alert("Simulação de vídeo finalizada. O queijo de Vivi Pizzas é irresistível!")}
                    className="mt-4 bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold py-1 px-3 rounded cursor-pointer"
                  >
                    Pausar / Retomar
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden max-h-[70vh]">
                <img 
                  src={lightboxItem.url} 
                  alt={lightboxItem.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl mx-auto"
                />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-full whitespace-nowrap">
                  Dica: Clique em "Adicionar ao Carrinho" no cardápio para pedir essa delícia!
                </div>
              </div>
            )}

          </div>

          {/* Mini Lightbox Thumbnails footer */}
          <div className="w-full max-w-4xl mt-4 flex items-center gap-2 overflow-x-auto pb-2 justify-center">
            {filteredItems.map(thumb => (
              <button
                key={thumb.id}
                onClick={() => {
                  setLightboxItem(thumb);
                  setRotationAngle(0);
                }}
                className={`w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                  lightboxItem.id === thumb.id ? 'border-amber-400 scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={thumb.url} alt={thumb.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
