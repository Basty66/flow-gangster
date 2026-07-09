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

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('La imagen es muy pesada (máx 2MB)');
      return;
    }

    setError('');
    setProcessing(true);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPreview(base64);
      onUpload(base64);
      setProcessing(false);
    };
    reader.onerror = () => {
      setError('Error al leer la imagen');
      setProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile({ target: { files: e.dataTransfer.files } });
  };

  const handleClick = () => inputRef.current?.click();

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview('');
    onUpload('');
    inputRef.current.value = '';
  };

  return (
    <div>
      <p className="font-black uppercase text-xs tracking-[0.15em] mb-2 text-white/60">Imagen del producto</p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={preview ? undefined : handleClick}
        className={`relative border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden rounded-2xl
          ${dragOver ? 'border-purple bg-purple/5' : 'border-white/[0.06] hover:border-white/20'}
          ${preview ? 'h-64' : 'h-48'}`}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300
                          flex items-center justify-center gap-3">
              <button type="button" onClick={handleClick}
                      className="font-black text-xs tracking-[0.15em] text-white border-2 border-white px-4 py-2
                               hover:bg-white hover:text-deep transition-all">
                CAMBIAR
              </button>
              <button type="button" onClick={handleRemove}
                      className="font-black text-xs tracking-[0.15em] text-orange border-2 border-orange px-4 py-2
                               hover:bg-orange hover:text-white transition-all">
                ELIMINAR
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs font-bold">Click o arrastra una imagen</p>
            <p className="text-[9px] text-white/20">Máx 2MB &middot; JPG / PNG</p>
          </div>
        )}

        {processing && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-2xl">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="font-black text-xs text-purple tracking-widest">PROCESANDO...</p>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-orange text-xs mt-1 font-bold">{error}</p>}
      {preview && !error && (
        <p className="text-cyan text-xs mt-1 font-bold tracking-wider">✓ IMAGEN LISTA</p>
      )}
    </div>
  );
}
