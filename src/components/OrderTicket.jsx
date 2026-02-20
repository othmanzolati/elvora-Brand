import React from 'react';
import Barcode from 'react-barcode';

const OrderTicket = React.forwardRef(({ order }, ref) => {
  if (!order) return <div ref={ref} className="hidden">No Order</div>;

  const displayId = order.id.toString().replace(/\D/g, "").slice(-4) || "0001";
  
  // Logic: Ila kano kter men 3 d les items, n-sghro l-font bash may-hbeetch l-te7t
  const isLongOrder = order.items.length > 3;

  return (
    <div ref={ref} className="p-2 w-[70mm] bg-white text-black font-sans leading-tight text-center mx-auto">
      
      {/* HEADER */}
      <div className="border-b-2 border-black pb-2 mb-2">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
          ELVORA
        </h1>
        <p className="text-[8px] font-bold uppercase tracking-[0.3em] mt-1">Studio Goods</p>
      </div>

      {/* INFO BLOCK */}
      <div className="mb-2 border-b border-dashed border-gray-400 pb-2">
        <p className="text-[9px] font-bold uppercase text-gray-400">Ship to:</p>
        <h2 className="text-[14px] font-black uppercase leading-tight">
          {order.customer.firstName} {order.customer.lastName}
        </h2> 
        <br />
        <div className="text-[10px] font-medium leading-tight">
          <p>{order.customer.address}</p>
        </div>
        <div className="text-[10px] font-medium leading-tight">
          <p>{order.customer.city}</p>
        </div>
        <p className="text-[10px] font-black mt-1 uppercase italic border border-black inline-block px-2">
          TEL: {order.customer.phone}
        </p>
        
        <div className="flex justify-center gap-3 mt-1 text-[8px] font-bold text-gray-500 uppercase font-mono">
          <span>REF: #{order.order_number}</span>
          <span>{new Date(order.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* ITEMS - Rejja3nahom Horizontal bash n-reb7o stura mli i-kouno ktar */}
      <div className="mb-2 px-1">
        <div className="flex flex-col gap-1">
          {order.items.map((item, idx) => (
            <div key={idx} className={`flex justify-between items-center border-b border-gray-50 pb-0.5 ${isLongOrder ? 'text-[9px]' : 'text-[11px]'}`}>
              {/* Product Name (truncated bash may-khodch 2 lines) */}
              <span className="font-bold uppercase truncate pr-2 text-left flex-1">
                {item.name}
              </span>
              {/* Size & Qty f nefs l-ster */}
              <div className="flex gap-2">
                <span className="font-black italic">[{item.size}]</span>
                <span className="font-medium text-gray-500 font-mono">x{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOTAL & BARCODE - Stacked Compactly */}
      <div className="border-t-2 border-black pt-1 flex flex-col items-center">
        <div className="flex justify-between w-full items-center mb-1 px-1">
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Total Amount</span>
          <span className="text-[18px] font-black italic">{order.total.toFixed(2)} DH</span>
        </div>
        
        <div className="flex justify-center w-full scale-90">
          <Barcode 
            value={`ELV-${order.order_number}`} 
            width={0.8} 
            height={20} 
            fontSize={8}
            margin={0}
          />
        </div>
      </div>

      {/* MINIMAL FOOTER */}
      <div className="mt-2 text-center border-t border-gray-100 pt-1">
        <p className="text-[7px] font-medium uppercase tracking-widest text-gray-400">Authentic Collective Archive</p>
      </div>
    </div>
  );
});

OrderTicket.displayName = 'OrderTicket';
export default OrderTicket;