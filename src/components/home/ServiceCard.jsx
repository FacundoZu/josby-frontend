import { GrLocation } from "react-icons/gr";
import { Link } from "react-router";

const ServiceCard = ({ service }) => {
  const truncateDescription = (text, maxLength = 120) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const userName = service.usuarioId
    ? `${service.usuarioId.firstname || ""} ${service.usuarioId.lastname || ""}`.trim()
    : "Usuario";

  const userAvatar = service.usuarioId.image

  const location = service.usuarioId?.location || "Sin ubicación";
  const categoryName = service.categories?.[0]?.name || "Sin categoría";
  const firstImage = service.images?.[0] || null;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden max-w-sm">
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        {firstImage ? (
          <img
            src={firstImage}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}

        <span className="absolute top-3 left-3 bg-white text-text-primary text-xs px-3 py-1 rounded-full shadow">
          {categoryName}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">
          {service.title || "Sin título"}
        </h3>

        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-primary-dark text-white flex items-center justify-center font-semibold text-sm">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-8 h-8 rounded-full flex items-center justify-center" />
            ) : (
              <div>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {userName}
            </p>
            <p className="text-xs text-text-secondary flex items-center gap-1">
              <GrLocation size={12} />
              <span className="truncate">{location}</span>
            </p>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4 line-clamp-3">
          {truncateDescription(service.description)}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-text-primary">
              ${service.price?.toLocaleString() || "0"}
            </p>
            <p className="text-xs text-text-secondary">
              Entrega en {service.deliveryTime || "N/A"} días
            </p>
          </div>

          <Link
            to={`/service/${service._id}`}
            className="contact-button"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;