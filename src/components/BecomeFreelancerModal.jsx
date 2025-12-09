
const BecomeFreelancerModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">¿Quieres convertirte en Freelancer?</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        Al confirmar, podrás ofrecer tus servicios a otros usuarios de la plataforma.
                    </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer px-6 py-2 text-sm font-medium text-white bg-[#38ced6] hover:bg-[#2aa8b0] rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BecomeFreelancerModal;
