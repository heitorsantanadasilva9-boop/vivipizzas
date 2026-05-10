import React, { useState } from 'react';
import { 
  Pizza, 
  ShoppingBag, 
  Sparkles, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  Check, 
  Phone, 
  Truck, 
  Flame 
} from 'lucide-react';
import { MENU_ITEMS, MenuItem, LISTING_INFO } from '../data/viviData';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: 'Média' | 'Grande';
  customDesc?: string;
}

interface InteractiveMenuProps {
  customItems: Array<{ name: string; price: number; desc: string }>;
  onClearCustomItems: () => void;
  onUpdateCartTotalCount: (count: number) => void;
}

export const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ 
  customItems, 
  onClearCustomItems,
  onUpdateCartTotalCount 
}) => {
  const [activeTab, setActiveTab] = useState<'Todos' | 'Mais pedidos' | 'Salgadas' | 'Especiais' | 'Doces' | 'Bebidas'>('Todos');
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "calabresa-grande",
      name: "Calabresa",
      price: 36.00,
      quantity: 1,
      size: "Grande",
      customDesc: "Mais pedido · Molho artesanal, mussarela e calabresa defumada"
    }
  ]);

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address' | 'done'>('cart');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('Centro, Coração de Maria - BA');
  const [orderServiceType, setOrderServiceType] = useState<'Entrega' | 'Refeição no local'>('Entrega');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Combine static cart with incoming custom items created from PizzaBuilder
  // We sync cart items or just add them when customItems changes. 
  // Let's create a trigger or process to add custom items instantly.
  // We can let the parent pass them or we handle them in a beautiful cart view.
  
  // To keep it perfectly synchronized, let's allow adding regular menu items:
  const handleAddItem = (item: MenuItem, size: 'Média' | 'Grande') => {
    const price = size === 'Média' ? item.priceSmall : item.priceLarge;
    const cartId = `${item.id}-${size}`;

    setCart(prev => {
      const existing = prev.find(c => c.id === cartId);
      let updated;
      if (existing) {
        updated = prev.map(c => c.id === cartId ? { ...c, quantity: c.quantity + 1 } : c);
      } else {
        updated = [...prev, {
          id: cartId,
          name: item.name,
          price,
          quantity: 1,
          size,
          customDesc: item.tag ? `${item.tag} · ${item.category}` : item.category
        }];
      }
      onUpdateCartTotalCount(updated.reduce((sum, i) => sum + i.quantity, 0));
      return updated;
    });
  };

  const handleRemoveOne = (cartId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === cartId);
      if (!existing) return prev;
      let updated;
      if (existing.quantity > 1) {
        updated = prev.map(c => c.id === cartId ? { ...c, quantity: c.quantity - 1 } : c);
      } else {
        updated = prev.filter(c => c.id !== cartId);
      }
      onUpdateCartTotalCount(updated.reduce((sum, i) => sum + i.quantity, 0));
      return updated;
    });
  };

  const handleAddCustomCreated = (custom: { name: string; price: number; desc: string }) => {
    const uniqueId = `custom-builder-${Date.now()}`;
    setCart(prev => {
      const updated: CartItem[] = [...prev, {
        id: uniqueId,
        name: custom.name,
        price: custom.price,
        quantity: 1,
        size: 'Grande' as const,
        customDesc: custom.desc
      }];
      onUpdateCartTotalCount(updated.reduce((sum, i) => sum + i.quantity, 0));
      return updated;
    });
  };

  // Expose an effect or button to inject custom items passed down
  React.useEffect(() => {
    if (customItems.length > 0) {
      customItems.forEach(ci => {
        handleAddCustomCreated(ci);
      });
      onClearCustomItems();
    }
  }, [customItems, onClearCustomItems]);

  const itemsTotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const deliveryFee = orderServiceType === 'Entrega' ? 4.00 : 0.00; // symbolic delivery fee
  const orderGrandTotal = itemsTotal + deliveryFee;

  const avgPerPerson = cart.reduce((sum, i) => sum + i.quantity, 0) > 0 
    ? (orderGrandTotal / Math.max(2, cart.reduce((sum, i) => sum + i.quantity, 0) * 2)).toFixed(0)
    : "0";

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientName.trim() && clientPhone.trim()) {
      setCheckoutStep('done');

      // Construct a professional, fully automated WhatsApp order string matching all requested parameters
      const itemsListText = cart.map(c => `▪️ ${c.quantity}x *${c.name}* (${c.customDesc || `Tamanho ${c.size}`}) - R$ ${(c.price * c.quantity).toFixed(2)}`).join('\n');
      
      let message = `🍕 *NOVO PEDIDO - VIVI PIZZAS* 🍕\n\n`;
      message += `👤 *Cliente:* ${clientName.trim()}\n`;
      message += `📱 *WhatsApp:* ${clientPhone.trim()}\n`;
      message += `🛎️ *Tipo de Atendimento:* ${orderServiceType}\n\n`;
      message += `*ITENS SOLICITADOS:*\n${itemsListText}\n\n`;
      
      if (orderServiceType === 'Entrega') {
        message += `🚚 *Endereço de Entrega:* ${clientAddress}\n`;
        message += `📍 *Ref. de Saída:* Plus Code Q723+8P\n`;
        message += `🛵 *Taxa de Entrega:* R$ ${deliveryFee.toFixed(2)}\n`;
      } else {
        message += `🍽️ *Reserva de Mesa:* Consumo no Local (R. Anísio Teixeira)\n`;
      }

      if (deliveryNote.trim()) {
        message += `\n⚠️ *Observação:* "${deliveryNote.trim()}"\n`;
      }

      message += `\n💰 *TOTAL GERAL ESTIMADO:* R$ ${orderGrandTotal.toFixed(2)}\n`;
      message += `⏱️ *Previsão do Forno:* 20 a 35 minutos\n`;
      message += `\n_Pedido gerado via portal web interativo da Vivi Pizzas_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5575982262466?text=${encodedMessage}`;

      // Automatically open the real WhatsApp gateway to the pizzaria's verified phone
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 800);
    }
  };

  const filteredItems = MENU_ITEMS.filter(item => {
    if (activeTab === 'Todos') return true;
    if (activeTab === 'Mais pedidos') return item.highlight;
    return item.category === activeTab;
  });

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-stone-200 scroll-mt-20 my-8" id="cardapio">
      
      {/* Title Header */}
      <div className="pb-4 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-red-50 text-red-800 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded font-mono">
            Cardápio Oficial Digital
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif-custom text-stone-900 mt-1 flex items-center gap-2">
            <Pizza className="w-6 h-6 text-amber-500 animate-bounce" />
            <span>Cardápio e Destaques Vivi Pizzas</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Pizzas artesanais assadas em forno de lastro de altíssima temperatura. {LISTING_INFO.priceInfoText}.
          </p>
        </div>

        {/* Core specific labels from prompt: Calabresa, Frango Com Catupiry E Bacon, De Bacon A Vida */}
        <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs self-start md:self-auto max-w-md">
          <span className="font-bold text-amber-900 block flex items-center gap-1 mb-1">
            <Flame className="w-3.5 h-3.5 text-red-600 fill-current" />
            <span>Mais Pedidos Informados no Google Maps:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-white text-stone-800 font-bold px-2 py-0.5 rounded-md shadow-2xs border border-amber-300">
              🍕 Calabresa
            </span>
            <span className="bg-white text-stone-800 font-bold px-2 py-0.5 rounded-md shadow-2xs border border-amber-300">
              🥓 Frango Com Catupiry E Bacon
            </span>
            <span className="bg-white text-stone-800 font-bold px-2 py-0.5 rounded-md shadow-2xs border border-amber-300">
              🔥 De Bacon A Vida
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout: left side is interactive list, right side is the reactive Cart Checkout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left column: Menu browser (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8">
          
          {/* Tabs Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-stone-100 scrollbar-thin">
            {(['Todos', 'Mais pedidos', 'Salgadas', 'Especiais', 'Doces', 'Bebidas'] as const).map(tab => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-stone-900 text-white shadow-xs' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {tab === 'Mais pedidos' ? '🔥 Mais pedidos' : tab}
                </button>
              );
            })}
          </div>

          {/* Menu Items List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {filteredItems.map(item => {
              const isTopRequested = item.id === 'calabresa' || item.id === 'frango-catupiry-bacon' || item.id === 'bacon-vida';

              return (
                <div 
                  key={item.id} 
                  className={`bg-stone-50 rounded-xl overflow-hidden border transition-all flex flex-col justify-between ${
                    isTopRequested 
                      ? 'border-amber-300 shadow-xs bg-gradient-to-b from-amber-50/30 to-transparent' 
                      : 'border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  
                  {/* Photo Thumbnail */}
                  <div className="h-36 w-full bg-stone-200 relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      {isTopRequested && (
                        <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 uppercase tracking-tighter">
                          <Sparkles className="w-2.5 h-2.5 fill-current" />
                          Destaque Maps
                        </span>
                      )}
                      <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded font-mono">
                        {item.category}
                      </span>
                    </div>

                    {item.tag && (
                      <span className="absolute bottom-2 right-2 bg-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded shadow">
                        {item.tag}
                      </span>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 leading-tight font-serif-custom">
                        {item.name}
                      </h4>
                      <p className="text-stone-600 text-xs mt-1 font-light leading-snug line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Adder sizes */}
                    <div className="pt-2 border-t border-stone-200/60 mt-2">
                      <span className="text-[10px] font-bold text-stone-400 block mb-1 uppercase tracking-wider">
                        Escolha e adicione ao carrinho:
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddItem(item, 'Média')}
                          className="flex-1 bg-white hover:bg-amber-50 text-stone-800 font-bold py-1 px-2 rounded border border-stone-300 text-[11px] transition-colors flex items-center justify-between cursor-pointer group"
                        >
                          <span className="text-stone-500 text-[10px]">Média</span>
                          <span className="text-stone-900 group-hover:text-red-600">R$ {item.priceSmall.toFixed(2).replace('.', ',')}</span>
                          <Plus className="w-3 h-3 text-stone-400 group-hover:text-amber-600" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAddItem(item, 'Grande')}
                          className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold py-1 px-2 rounded border border-amber-400 text-[11px] transition-colors flex items-center justify-between cursor-pointer shadow-xs"
                        >
                          <span className="text-stone-800 text-[10px]">Grande</span>
                          <span>R$ {item.priceLarge.toFixed(2).replace('.', ',')}</span>
                          <Plus className="w-3.5 h-3.5 text-stone-950" />
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-stone-400 text-xs">
              Nenhum item listado nesta categoria. Tente usar a barra superior para pesquisar ou clique em "Todos".
            </div>
          )}

        </div>

        {/* Right column: Live Interactive Cart & Simulated checkout (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4">
          
          <div className="bg-stone-900 text-white rounded-xl p-4 sticky top-16 shadow-lg border border-stone-800">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm text-stone-100 uppercase tracking-wider">
                  Seu Pedido · Checkout Vivo
                </h4>
              </div>
              
              <span className="bg-amber-500 text-stone-950 font-bold text-xs px-2 py-0.5 rounded-full">
                {cart.reduce((sum, i) => sum + i.quantity, 0)} item(s)
              </span>
            </div>

            {/* Step indicator */}
            {checkoutStep !== 'done' && (
              <div className="my-2 bg-stone-950 p-2 rounded text-center text-[10px] text-stone-400 font-mono">
                {checkoutStep === 'cart' ? 'Revise os itens e os preços abaixo' : 'Informe dados de entrega/retirada'}
              </div>
            )}

            {/* Step 1: Cart Items Stream */}
            {checkoutStep === 'cart' && (
              <>
                <div className="my-3 space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                  {cart.map(c => (
                    <div key={c.id} className="bg-stone-950 p-2 rounded-lg border border-stone-800 text-xs flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="font-bold text-amber-400 block">{c.name}</span>
                        <span className="text-[10px] text-stone-400 block leading-tight">{c.customDesc || `Tamanho ${c.size}`}</span>
                        <span className="text-white font-mono text-[11px] block mt-0.5">
                          {c.quantity}x R$ {c.price.toFixed(2).replace('.', ',')} = <strong className="text-emerald-400">R$ {(c.price * c.quantity).toFixed(2).replace('.', ',')}</strong>
                        </span>
                      </div>

                      {/* Quantity Add/Remove Controls */}
                      <div className="flex items-center gap-1 bg-stone-900 p-1 rounded border border-stone-700 self-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveOne(c.id)}
                          className="p-1 text-stone-400 hover:text-red-400 cursor-pointer transition-colors"
                          title="Diminuir quantidade"
                        >
                          {c.quantity === 1 ? <Trash2 className="w-3 h-3 text-red-500" /> : <Minus className="w-3 h-3" />}
                        </button>
                        <span className="px-1 text-xs font-bold text-white min-w-[14px] text-center">
                          {c.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddItem({ id: c.id.split('-')[0], name: c.name, priceSmall: c.price, priceLarge: c.price, category: 'Salgadas', description: '', image: '' }, c.size)}
                          className="p-1 text-stone-400 hover:text-emerald-400 cursor-pointer transition-colors"
                          title="Aumentar quantidade"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                    </div>
                  ))}

                  {cart.length === 0 && (
                    <div className="text-center py-8 text-stone-500 text-xs space-y-2">
                      <p>O carrinho está vazio.</p>
                      <p className="text-[10px] text-stone-400">Adicione a clássica <strong>Calabresa</strong> ou <strong>Frango com Catupiry e Bacon</strong> ao lado para começar!</p>
                    </div>
                  )}
                </div>

                {/* Option toggle: Delivery vs Dine-in */}
                <div className="pt-2 border-t border-stone-800">
                  <label className="block text-[11px] font-bold text-stone-400 mb-1">
                    Como deseja receber/consumir?
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderServiceType('Entrega')}
                      className={`p-2 rounded text-xs font-bold flex flex-col items-center justify-center cursor-pointer transition-colors border ${
                        orderServiceType === 'Entrega' 
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xs' 
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      <Truck className="w-4 h-4 mb-1" />
                      <span>Entrega Rápida</span>
                      <span className="text-[9px] font-mono font-normal block opacity-90">+ R$ 4,00 taxa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderServiceType('Refeição no local')}
                      className={`p-2 rounded text-xs font-bold flex flex-col items-center justify-center cursor-pointer transition-colors border ${
                        orderServiceType === 'Refeição no local' 
                          ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xs' 
                          : 'bg-stone-950 text-stone-400 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      <MapPin className="w-4 h-4 mb-1" />
                      <span>Refeição no Local</span>
                      <span className="text-[9px] font-mono font-normal block opacity-90">R. Anísio Teixeira</span>
                    </button>
                  </div>
                </div>

                {/* Financial Summary matching R$ 20-40 */}
                <div className="mt-3 bg-stone-950 p-2.5 rounded-lg border border-stone-800 text-xs space-y-1">
                  <div className="flex justify-between text-stone-400">
                    <span>Subtotal de pizzas:</span>
                    <span>R$ {itemsTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>{orderServiceType === 'Entrega' ? 'Taxa de motoboy:' : 'Reserva de mesa:'}</span>
                    <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-1 border-t border-stone-800 text-sm">
                    <span>Total Estimado:</span>
                    <span className="text-amber-400">R$ {orderGrandTotal.toFixed(2).replace('.', ',')}</span>
                  </div>

                  <div className="pt-1 text-center text-[10px] text-stone-400">
                    Média calculada: <strong className="text-white">R$ {avgPerPerson} por pessoa</strong> <br/>
                    <span className="text-[9px]">(Encaixa perfeitamente na média de R$ 20–40 do Google Maps)</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={() => setCheckoutStep('address')}
                  className={`w-full mt-3 font-bold text-xs py-2.5 px-4 rounded-lg text-center uppercase tracking-wider transition-all cursor-pointer shadow ${
                    cart.length > 0 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse' 
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  Continuar Pedido (Passo 2/2) →
                </button>
              </>
            )}

            {/* Step 2: Client contact Details */}
            {checkoutStep === 'address' && (
              <form onSubmit={handleConfirmOrder} className="my-3 space-y-2 text-xs animate-fade-in">
                
                <div>
                  <label className="block text-[10px] text-stone-400 mb-0.5">Nome Completo</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Seu nome..." 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-white focus:outline-none focus:border-amber-500" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-0.5">Telefone / WhatsApp</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="(75) 9..." 
                    value={clientPhone} 
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-white focus:outline-none focus:border-amber-500" 
                  />
                </div>

                {orderServiceType === 'Entrega' ? (
                  <div>
                    <label className="block text-[10px] text-stone-400 mb-0.5">Endereço de Entrega (Coração de Maria)</label>
                    <textarea 
                      rows={2} 
                      required
                      value={clientAddress} 
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-white focus:outline-none focus:border-amber-500 resize-none text-xs" 
                    />
                    <span className="text-[9px] text-stone-400 block mt-0.5">
                      Utilizamos o Plus Code <strong className="text-stone-200">Q723+8P</strong> como referência de saída
                    </span>
                  </div>
                ) : (
                  <div className="bg-amber-950/60 p-2 rounded border border-amber-800 text-[11px] text-amber-200 space-y-1">
                    <p className="font-bold">✓ Reserva de Mesa Incluída</p>
                    <p>O consumo será no local: R. Anísio Teixeira - Centro, Coração de Maria - BA.</p>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] text-stone-400 mb-0.5">Observação na pizza (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Sem cebola, massa bem fina, troco para R$ 50..." 
                    value={deliveryNote} 
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded p-1.5 text-white focus:outline-none text-[11px]" 
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold px-3 py-2 rounded text-xs cursor-pointer"
                  >
                    Voltar
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black py-2 rounded text-xs text-center uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    Enviar p/ WhatsApp Vivi (R$ {orderGrandTotal.toFixed(2).replace('.', ',')})
                  </button>
                </div>

              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {checkoutStep === 'done' && (
              <div className="my-4 bg-emerald-950/90 text-emerald-100 p-4 rounded-xl border border-emerald-800 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                
                <div>
                  <h5 className="font-black text-white text-base">Pedido Registrado com Sucesso!</h5>
                  <p className="text-xs text-stone-300 mt-1">
                    Seu pedido de {orderServiceType} foi processado. O forno de lastro já foi notificado.
                  </p>
                </div>

                <div className="bg-stone-950 p-2.5 rounded text-left text-xs text-stone-300 space-y-1 font-mono">
                  <p><strong className="text-white">Cliente:</strong> {clientName}</p>
                  <p><strong className="text-white">WhatsApp:</strong> {clientPhone}</p>
                  <p><strong className="text-white">Preço Total:</strong> R$ {orderGrandTotal.toFixed(2).replace('.', ',')}</p>
                  <p><strong className="text-white">Previsão:</strong> 15 a 30 minutos</p>
                  {deliveryNote && <p><strong className="text-amber-400">Nota:</strong> "{deliveryNote}"</p>}
                </div>

                <p className="text-[10px] text-amber-400">
                  *Este é um portal oficial simulado em tempo real em conformidade com as informações repassadas por 9 pessoas no Maps. Você pode nos ligar diretamente no <strong>(75) 98226-2466</strong> para acompanhar!
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setCart([]);
                    setCheckoutStep('cart');
                    setClientName('');
                    setClientPhone('');
                  }}
                  className="w-full bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold py-1.5 rounded transition-colors cursor-pointer"
                >
                  Fazer um Novo Pedido
                </button>
              </div>
            )}

          </div>

          {/* Quick Contact snippet from prompt */}
          <div className="mt-4 bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-2">
            <span className="font-bold text-stone-900 block flex items-center gap-1 text-[11px]">
              <Phone className="w-3 h-3 text-emerald-600" />
              Atendimento Humanizado
            </span>
            <p className="text-stone-600 text-[11px] leading-tight">
              Prefere falar com o atendente? Ligue para <strong className="text-stone-900">(75) 98226-2466</strong>. Atendemos todos os dias da semana até as 23:00.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
