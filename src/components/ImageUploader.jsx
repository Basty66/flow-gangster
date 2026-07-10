import { useState, useRef } from 'react';

const MAX_SIZE = 2 * 1024 * 1024;

export default function ImageUploader({ onUpload, currentUrl }) {
  const [preview, setPreview] = useState(currentUrl || '');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Solo se permiten imagenes'); return; }
    if (file.size > MAX_SIZE) { setError('Max 2MB'); return; }
    setError('');
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (ev) => { const base64 = ev.target.result; setPreview(base64); onUpload(base64); setProcessing(false); };
    reader.onerror = () => { setError('Error al leer'); setProcessing(false); };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile({ target: { files: e.dataTransfer.files } }); };
  const handleClick = () => inputRef.current?.click();
  const handleRemove = (e) => { e.stopPropagation(); setPreview(''); onUpload(''); inputRef.current.value = ''; };

  return (
    <div>
      <p className="font-mono text-[9px] text-[#555] tracking-[0.15em] uppercase mb-2">Imagen</p>
      <div onDrop={handleDrop}
           onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
           onDragLeave={() => setDragOver(false)}
           onClick={preview ? undefined : handleClick}
           className={`relative border border-dashed cursor-pointer transition-all duration-200 overflow-hidden
             ${dragOver ? 'border-orange bg-orange/5' : 'border-[#333] hover:border-[#555]'}
             ${preview ? 'h-48' : 'h-32'}`}>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <button type="button" onClick={handleClick}
                      className="px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] uppercase border border-white text-white hover:bg-white hover:text-black transition-all duration-200">CAMBIAR</button>
              <button type="button" onClick={handleRemove}
                      className="px-3 py-1.5 text-[9px] font-bold tracking-[0.1em] uppercase border border-orange text-orange hover:bg-orange hover:text-black transition-all duration-200">ELIMINAR</button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#444] gap-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-[10px] font-bold text-[#555]">Click o arrastra</p>
            <p className="text-[8px] text-[#444]">Max 2MB</p>
          </div>
        )}
        {processing && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
            <div className="w-6 h-6 border border-orange border-t-transparent animate-spin" />
          </div>
        )}
      </div>
      {error && <p className="text-[#666] text-xs mt-1">{error}</p>}
    </div>
  );
}
