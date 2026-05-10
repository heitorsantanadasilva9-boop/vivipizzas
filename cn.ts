import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquarePlus, CheckCircle, ShieldCheck } from 'lucide-react';
import { INITIAL_REVIEWS, GOOGLE_MAPS_RATINGS_SUMMARY, ReviewItem } from '../data/viviData';

export const ReviewSimulator: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  
  // New review state
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  // Dynamic calculated scores
  const totalReviewsCount = GOOGLE_MAPS_RATINGS_SUMMARY.total + (reviews.length - INITIAL_REVIEWS.length);
  
  // Calculate average
  const totalStarsSum = reviews.reduce((acc, curr) => acc + curr.rating, 0) + 
    (GOOGLE_MAPS_RATINGS_SUMMARY.average * GOOGLE_MAPS_RATINGS_SUMMARY.total - 
     INITIAL_REVIEWS.reduce((acc, curr) => acc + curr.rating, 0)); // base math compensation
  
  const calculatedAvg = (totalStarsSum / totalReviewsCount).toFixed(1);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAuthor.trim() && newText.trim()) {
      const colors = ['bg-amber-600', 'bg-red-600', 'bg-emerald-600', 'bg-blue-600', 'bg-purple-600'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const created: ReviewItem = {
        id: `custom-${Date.now()}`,
        author: newAuthor.trim(),
        rating: newRating,
        date: "Agora mesmo",
        text: newText.trim(),
        likes: 0,
        avatarColor: randomColor
      };

      setReviews([created, ...reviews]);
      setSubmitted(true);
      setNewAuthor('');
      setNewText('');
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleLikeReview = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const filteredReviews = selectedRatingFilter === null 
    ? reviews 
    : reviews.filter(r => r.rating === selectedRatingFilter);

  // Re-build live distribution
  const liveDistribution = [5, 4, 3, 2, 1].map(stars => {
    // base distribution plus new items
    const baseObj = GOOGLE_MAPS_RATINGS_SUMMARY.distribution.find(d => d.stars === stars);
    const baseCount = baseObj ? baseObj.count : 0;
    const addedCount = reviews.filter(r => !INITIAL_REVIEWS.some(ir => ir.id === r.id) && r.rating === stars).length;
    return {
      stars,
      count: baseCount + addedCount
    };
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 scroll-mt-20" id="avaliacoes">
      
      {/* Title */}
      <div className="pb-4 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <span>Avaliações dos clientes no Google Maps</span>
            <span title="Verificado"><ShieldCheck className="w-4 h-4 text-blue-600" /></span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Nota geral calculada dinamicamente com as opiniões reais informadas para Vivi Pizzas
          </p>
        </div>
      </div>

      {/* Overview Block exactly as stated in user prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        
        {/* Big score box */}
        <div className="lg:col-span-4 bg-stone-50 rounded-xl p-6 text-center border border-stone-100 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-stone-900 font-serif-custom tracking-tight">
            {calculatedAvg.replace('.', ',')}
          </span>
          
          <div className="flex items-center gap-1 text-amber-500 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-5 h-5 ${star <= Number(calculatedAvg) ? 'fill-current text-amber-500' : 'text-stone-300'}`} 
              />
            ))}
          </div>

          <span className="text-xs font-bold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-2xs mt-1">
            {totalReviewsCount} avaliações
          </span>
          <span className="text-[10px] text-stone-400 mt-2 block">
            Pizzaria Premium · Informado por pessoas locais
          </span>
        </div>

        {/* Breakdown bar chart exactly mimicking the vertical stack: 5, 4, 3, 2, 1 */}
        <div className="lg:col-span-8 space-y-2">
          <p className="text-xs font-bold text-stone-700 mb-1">Resumo de avaliações (clique para filtrar):</p>
          
          {liveDistribution.map(row => {
            const pct = totalReviewsCount > 0 ? Math.round((row.count / totalReviewsCount) * 100) : 0;
            const isFiltered = selectedRatingFilter === row.stars;

            return (
              <button
                key={row.stars}
                type="button"
                onClick={() => setSelectedRatingFilter(isFiltered ? null : row.stars)}
                className={`w-full flex items-center gap-2 text-xs p-1 rounded transition-colors cursor-pointer text-left ${
                  isFiltered ? 'bg-amber-50 font-bold border border-amber-300' : 'hover:bg-stone-50'
                }`}
              >
                <div className="w-8 flex items-center gap-1 text-stone-700 font-medium shrink-0">
                  <span>{row.stars}</span>
                  <Star className="w-3 h-3 text-amber-500 fill-current" />
                </div>

                {/* Progress bar */}
                <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      row.stars === 5 ? 'bg-amber-500' : row.stars === 4 ? 'bg-amber-400' : 'bg-stone-300'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="w-12 text-right text-[11px] text-stone-500 shrink-0">
                  {row.count} ({pct}%)
                </div>
              </button>
            );
          })}

          {selectedRatingFilter !== null && (
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-medium">
                Filtrando por {selectedRatingFilter} estrelas
              </span>
              <button 
                onClick={() => setSelectedRatingFilter(null)}
                className="text-xs text-red-600 underline hover:text-red-800 cursor-pointer"
              >
                Limpar filtro
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Form to submit a simulated live review */}
      <div className="mt-6 bg-stone-50 rounded-xl p-4 border border-stone-200">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquarePlus className="w-4 h-4 text-red-600" />
          <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Sua opinião importa: Adicione sua avaliação
          </h4>
        </div>

        <form onSubmit={handleAddReview} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-stone-600 mb-1">Seu Nome / Apelido</label>
              <input 
                type="text" 
                required
                placeholder="Ex: João Silva" 
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800"
              />
            </div>

            <div className="sm:w-36">
              <label className="block text-[10px] font-bold text-stone-600 mb-1">Sua Nota</label>
              <select 
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full text-xs p-2 bg-white border border-stone-200 rounded font-bold text-amber-600 focus:outline-none"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                <option value={3}>⭐⭐⭐ (3/5)</option>
                <option value={2}>⭐⭐ (2/5)</option>
                <option value={1}>⭐ (1/5)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 mb-1">Seu Comentário sobre a pizza ou atendimento</label>
            <textarea 
              required
              rows={2}
              placeholder="Fale sobre a pizza de Calabresa, Frango com Catupiry, o tempo de entrega, etc..." 
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full text-xs p-2 bg-white border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800 resize-none placeholder:text-stone-400"
            />
          </div>

          <button
            type="submit"
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2 px-4 rounded transition-colors cursor-pointer"
          >
            Publicar Avaliação Instantânea
          </button>
        </form>

        {submitted && (
          <div className="mt-3 bg-emerald-100 text-emerald-900 text-xs p-2.5 rounded flex items-center gap-2 animate-fade-in font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Obrigado, <strong>{reviews[0]?.author}</strong>! Sua avaliação foi incluída no cálculo acima. A média do Google Maps foi atualizada com sucesso.
            </span>
          </div>
        )}
      </div>

      {/* Render the reviews stream */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center text-xs text-stone-500">
          <span>Mostrando {filteredReviews.length} comentários verificados</span>
          <span className="text-[10px]">Coração de Maria, BA</span>
        </div>

        {filteredReviews.map((rev) => (
          <div key={rev.id} className="bg-stone-50 rounded-xl p-3.5 sm:p-4 border border-stone-200/60 hover:bg-white transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full ${rev.avatarColor} text-white font-bold text-xs flex items-center justify-center uppercase shrink-0 shadow-xs`}>
                  {rev.author.charAt(0)}
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">{rev.author}</h5>
                  <span className="text-[10px] text-stone-400 block">{rev.date} · Local Guide</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold">
                <span>{rev.rating}</span>
                <Star className="w-3 h-3 fill-current text-amber-500" />
              </div>
            </div>

            <p className="text-xs text-stone-700 mt-2.5 leading-relaxed font-light">
              "{rev.text}"
            </p>

            {/* Like count action */}
            <div className="mt-3 pt-2 border-t border-stone-200/50 flex items-center justify-between text-[11px]">
              <span className="text-stone-400">Achou esta avaliação útil?</span>
              <button
                onClick={() => handleLikeReview(rev.id)}
                className="flex items-center gap-1 text-stone-600 hover:text-red-600 font-medium transition-colors cursor-pointer bg-white px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs"
              >
                <ThumbsUp className="w-3 h-3 text-amber-600" />
                <span>Sim ({rev.likes})</span>
              </button>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-6 text-stone-400 text-xs">
            Nenhuma avaliação encontrada para esta nota específica. Limpe os filtros para ler todas as opiniões de Coração de Maria.
          </div>
        )}
      </div>

    </div>
  );
};
