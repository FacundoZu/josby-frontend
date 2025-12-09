import React, { useState, useRef } from 'react';


const DEFAULT_IMAGE = "../../public/user-image.webp";

const ImageUploadModal = ({ isOpen, onClose, onSave, currentImage }) => {
    const [preview, setPreview] = useState(currentImage);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    // Reset preview when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setPreview(currentImage);
        }
    }, [isOpen, currentImage]);

    if (!isOpen) return null;

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const handleSave = () => {
        onSave(preview);
        onClose();
    };

    const handleRemoveImage = (e) => {
        e.stopPropagation();
        setPreview(DEFAULT_IMAGE);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Actualizar Foto de Perfil</h3>
                    <p className="text-sm text-gray-500 mt-1">Sube una nueva imagen para tu avatar</p>
                </div>

                <div
                    className={`relative w-full h-64 rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center bg-gray-50
                    ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {preview ? (
                        <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mb-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span className="text-sm">Arrastra tu imagen aquí</span>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                    />

                    <button
                        type="button"
                        className="mt-4 text-sm font-medium text-secondary hover:text-secondary hover:underline"
                        onClick={onButtonClick}
                    >
                        O selecciona un archivo
                    </button>

                    {preview && preview !== DEFAULT_IMAGE && (
                        <button
                            type="button"
                            className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                            onClick={handleRemoveImage}
                        >
                            Eliminar imagen
                        </button>
                    )}

                    {dragActive && (
                        <div className="absolute inset-0 w-full h-full bg-blue-50/50 rounded-xl pointer-events-none" />
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!preview}
                        className="px-6 py-2 text-sm font-medium text-white bg-[#38ced6] hover:bg-[#2aa8b0] rounded-lg transition duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                    >
                        Guardar Imagen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
