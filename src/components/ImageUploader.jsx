import { useState, useRef } from 'react';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUploader({ onUpload, currentUrl }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      alert('Configura VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET en .env');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onUpload(data.secure_url);
      } else {
        alert('Error al subir: ' + (data.error?.message || 'desconocido'));
      }
    } catch (e) {
      alert('Error de conexión al subir imagen');
    }
    setUploading(false);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Solo imágenes');
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    uploadToCloudinary(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile({ target: { files: e.dataTransfer.files } });
  };

  return (
    <div>
      <p className="font-black uppercase text-xs tracking-[0.15em] mb-2 text-white/60">Imagen del producto</p>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden
          ${dragOver ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/10 hover:border-white/30'}
          ${preview ? 'h-64' : 'h-48'}`}
      >
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300
                          flex items-center justify-center">
              <span className="font-black text-xs tracking-[0.15em] text-white">CAMBIAR IMAGEN</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs font-bold">Click o arrastra una imagen</p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="font-black text-xs text-neon-cyan tracking-widest">SUBIR...</p>
            </div>
          </div>
        )}
      </div>

      {preview && currentUrl && preview !== currentUrl && (
        <p className="text-neon-cyan text-xs mt-1 font-bold">✓ Imagen cargada</p>
      )}
    </div>
  );
}
