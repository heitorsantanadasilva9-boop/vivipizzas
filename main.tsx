import React, { useState } from 'react';
import { Layers, PlusCircle, Check, ShoppingCart, Info } from 'lucide-react';

interface PizzaBuilderProps {
  onAddCustomToCart: (customItem: { name: string; price: number; desc: string }) => void;
}

interface Ingredient {
  id: string;
  name: string;
  price: number;
  color: string;
  category: string;
}

export const PizzaBuilder: React.FC<PizzaBuilderProps> = ({ onAddCustomToCart }) => {
  const [selectedSize, setSelectedSize] = useState<'Média (R$ 20)' | 'Grande (R$ 30)' | 'Família (R$ 40)'>('Grande (R$ 30)');
  const [selectedCrust, setSelectedCrust] = useState<string>('Borda Tradicional');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['mussarela', 'orégano']);
  const [customAdded, setCustomAdded] = useState(false);

  const basePrices = {
    'Média (R$ 20)': 20,
    'Grande (R$ 30)': 30,
    'Família (R$ 40)': 40
  };

  const ingredientsList: Ingredient[] = [
    { id: 'mussarela', name: 'Mussarela Derretida', price: 0, color: 'bg-yellow-200', category: 'Base' },
    { id: 'orégano', name: 'Orégano Fresco', price: 0, color: 'bg-emerald-800', category: 'Base' },
    { id: 'bacon', name: 'Bacon em Cubos Crocantes', price: 5, color: 'bg-red-800', category: 'Carnes' },
    { id: 'calabresa', name: 'Calabresa Defumada Fatiada', price: 4, color: 'bg-red-600', category: 'Carnes' },
    { id: 'frango', name: 'Frango Desfiado Temperado', price: 4, color: 'bg-amber-700', category: 'Carnes' },
    { id: 'catupiry', name: 'Autêntico Catupiry Original', price: 6, color: 'bg-amber-200', category: 'Queijos' },
    { id: 'cheddar', name: 'Cheddar Cremoso Premium', price: 5, color: 'bg-orange-500', category: 'Queijos' },
    { id: 'gorgonzola', name: 'Gorgonzola Suave', price: 6, color: 'bg-blue-300', category: 'Queijos' },
    { id: 'cebola', name: 'Cebola Roxa Fatiada', price: 2, color: 'bg-purple-300', category: 'Vegetais' },
    { id: 'azeitona', name: 'Azeitonas Pretas Selecionadas', price: 3, color: 'bg-stone-800', category: 'Vegetais' },
    { id: 'milho', name: 'Milho Verde Fresco', price: 2, color: 'bg-yellow-400', category: 'Vegetais' },
    { id: 'alho', name: 'Alho Poró Crocante', price: 3, color: 'bg-emerald-500', category: 'Vegetais' },
  ];

  const crustOptions = [
    { name: 'Borda Tradicional Crocante', price: 0 },
    { name: 'Borda Recheada com Catupiry Original', price: 8 },
    { name: 'Borda Recheada com Cheddar', price: 7 },
    { name: 'Borda Recheada com Doce de Leite', price: 9 }
  ];

  const toggleIngredient = (id: string) => {
    if (id === 'mussarela' || id === 'orégano') return; // mandatory base
    if (selectedIngredients.includes(id)) {
      setSelectedIngredients(selectedIngredients.filter(item => item !== id));
    } else {
      setSelectedIngredients([...selectedIngredients, id]);
    }
  };

  // Compute live price matching the R$ 20-40 stated in listing
  const currentBasePrice = basePrices[selectedSize];
  const crustPrice = crustOptions.find(c => c.name === selectedCrust)?.price || 0;
  
  const ingredientsExtraPrice = selectedIngredients
    .filter(id => id !== 'mussarela' && id !== 'orégano')
    .reduce((acc, currId) => {
      const ing = ingredientsList.find(i => i.id === currId);
      return acc + (ing ? ing.price : 0);
    }, 0);

  const totalPrice = currentBasePrice + crustPrice + ingredientsExtraPrice;

  const handleBuildSubmit = () => {
    const names = selectedIngredients.map(id => ingredientsList.find(i => i.id === id)?.name).filter(Boolean).join(', ');
    const desc = `Tamanho: ${selectedSize.split(' ')[0]} · Borda: ${selectedCrust} · Ingredientes: ${names}`;
    
    onAddCustomToCart({
      name: `Pizza Criada pelo Cliente (${selectedSize.split(' ')[0]})`,
      price: totalPrice,
      desc
    });

    setCustomAdded(true);
    setTimeout(() => setCustomAdded(false), 3000);
  };

  return (
    <div className="bg-stone-900 text-white rounded-2xl p-4 sm:p-6 shadow-xl border border-stone-800 my-8 relative overflow-hidden" id="monte-sua-pizza">
      
      {/* Absolute glow decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-800 relative z-10">
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest bg-amber-500 text-stone-900 px-2 py-0.5 rounded font-bold">
            Simulador Interativo
          </span>
          <h3 className="text-xl font-bold font-serif-custom mt-1 text-amber-400 flex items-center gap-2">
            <Layers className="w-5 h-5 text-red-500" />
            <span>Monte sua Pizza Exclusiva</span>
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Escolha o tamanho, recheio da borda e clique nos ingredientes. Veja o visual e o preço (estimado em R$ 20–40 por pessoa) atualizarem na hora!
          </p>
        </div>

        {/* Live Total Indicator Box */}
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-right min-w-[140px] self-stretch md:self-auto flex flex-col justify-center items-end">
          <span className="text-[10px] text-stone-400 block">Total do Pedido Vivo:</span>
          <span className="text-2xl font-black text-emerald-400 font-serif-custom">
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[9px] text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded mt-0.5">
            Média de 2-4 pessoas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative z-10 items-center">
        
        {/* Left column: Size & Crust Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wide">
              1. Escolha o Tamanho Médio por Pessoa
            </label>
            <div className="space-y-1.5">
              {(['Média (R$ 20)', 'Grande (R$ 30)', 'Família (R$ 40)'] as const).map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`w-full text-left text-xs p-2 rounded-lg transition-all border flex justify-between items-center cursor-pointer ${
                    selectedSize === size 
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow' 
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                  }`}
                >
                  <span>{size.split(' (')[0]}</span>
                  <span className="text-[11px] font-mono opacity-90">{size.includes('20') ? 'R$ 20,00' : size.includes('30') ? 'R$ 30,00' : 'R$ 40,00'}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wide">
              2. Borda Especial Premium
            </label>
            <select
              value={selectedCrust}
              onChange={(e) => setSelectedCrust(e.target.value)}
              className="w-full text-xs bg-stone-800 text-white border border-stone-700 p-2 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
            >
              {crustOptions.map(opt => (
                <option key={opt.name} value={opt.name}>
                  {opt.name} {opt.price > 0 ? `(+ R$ ${opt.price},00)` : '(Grátis)'}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-stone-950/50 p-2.5 rounded-lg border border-stone-800 text-[11px] text-stone-400 space-y-1">
            <span className="font-bold text-stone-300 block flex items-center gap-1">
              <Info className="w-3 h-3 text-amber-400" />
              Informado por 9 pessoas no Maps:
            </span>
            <p>Os clientes destacam que a borda de Catupiry e o Bacon crocante mudam a vida. Adicione à vontade!</p>
          </div>
        </div>

        {/* Center column: Beautiful Visual Live representation */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center py-4 bg-stone-950/80 rounded-2xl border border-stone-800">
          <span className="text-[10px] text-stone-400 mb-2 block font-mono">
            [ Prévia da Massa e Recheios ao vivo ]
          </span>
          
          {/* Circular pizza mockup */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-amber-900 border-8 border-amber-800 relative shadow-inner overflow-hidden flex items-center justify-center transition-all duration-300">
            
            {/* Tomato Sauce Layer */}
            <div className="absolute inset-2 rounded-full bg-red-700 animate-pulse" style={{ animationDuration: '8s' }}></div>

            {/* Render selected ingredient color blobs dynamically */}
            {selectedIngredients.map((id, i) => {
              const ing = ingredientsList.find(item => item.id === id);
              if (!ing) return null;

              // Generate scattered circles for visual feedback
              return (
                <div key={id} className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-around p-3">
                  {[...Array(6)].map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${ing.color} shadow-xs block transform rotate-${(i + idx) * 45} transition-all duration-300`}
                      style={{ 
                        opacity: id === 'mussarela' ? 0.9 : 0.85,
                        transform: `scale(${id === 'mussarela' ? 1.5 : 1})`
                      }}
                    />
                  ))}
                </div>
              );
            })}

            {/* Central Badge */}
            <div className="absolute bg-stone-900/90 text-amber-400 px-2 py-1 rounded text-[9px] font-bold tracking-tighter shadow backdrop-blur-2xs text-center z-10 border border-amber-500/30">
              {selectedSize.split(' ')[0]} <br/>
              <span className="text-white font-normal text-[8px]">{selectedIngredients.length} Ingredientes</span>
            </div>

            {/* Crust Indicator */}
            {selectedCrust !== 'Borda Tradicional Crocante' && (
              <div className="absolute inset-0 border-4 border-amber-300 rounded-full pointer-events-none opacity-80" />
            )}

          </div>

          <div className="text-center mt-3 px-2">
            <span className="text-[11px] text-amber-400 font-bold block">
              {selectedCrust}
            </span>
            <p className="text-[10px] text-stone-400 mt-0.5 max-w-xs leading-tight">
              Ingredientes na massa: {selectedIngredients.map(id => ingredientsList.find(i => i.id === id)?.name.split(' ')[0]).join(', ')}.
            </p>
          </div>
        </div>

        {/* Right column: Interactive ingredient taps */}
        <div className="lg:col-span-4">
          <label className="block text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wide">
            3. Toque para Adicionar ou Remover
          </label>
          
          <div className="max-h-60 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
            {ingredientsList.map(ing => {
              const isSelected = selectedIngredients.includes(ing.id);
              const isBase = ing.id === 'mussarela' || ing.id === 'orégano';

              return (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => toggleIngredient(ing.id)}
                  disabled={isBase}
                  className={`w-full p-2 rounded-lg text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-stone-800 text-white font-bold border-l-4 border-amber-400' 
                      : 'bg-stone-950 hover:bg-stone-850 text-stone-400'
                  } ${isBase ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2 text-left">
                    <span className={`w-2.5 h-2.5 rounded-full ${ing.color} shrink-0 block`} />
                    <div>
                      <span className="block text-stone-200">{ing.name}</span>
                      <span className="text-[9px] text-stone-500">{ing.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-amber-500 font-medium">
                      {ing.price === 0 ? 'Base' : `+ R$ ${ing.price}`}
                    </span>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <PlusCircle className="w-3.5 h-3.5 text-stone-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit button to pass custom item to parent cart */}
          <button
            type="button"
            onClick={handleBuildSubmit}
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-stone-950 font-black text-xs py-2.5 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.01]"
          >
            <ShoppingCart className="w-4 h-4 text-stone-950" />
            <span>Adicionar Personalizada ao Carrinho (R$ {totalPrice.toFixed(2).replace('.', ',')})</span>
          </button>

          {customAdded && (
            <div className="mt-2 text-center bg-emerald-950/80 text-emerald-400 text-[11px] py-1 px-2 rounded border border-emerald-800 animate-fade-in font-medium">
              ✓ Adicionado com sucesso ao seu pedido!
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
