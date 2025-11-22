import { GrLocation } from "react-icons/gr";
import { Link } from "react-router";

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden max-w-sm">

      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-white text-text-primary text-xs px-3 py-1 rounded-full shadow">
          {service.category}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={service.userAvatar}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {service.userName}
            </h3>
            <p className="text-xs text-text-secondary flex items-center gap-1">
              <GrLocation size={14} />
              {service.location}
            </p>
          </div>
        </div>

        <p className="text-sm text-text-primary mb-4">
          {service.description}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-text-primary">${service.price}</p>
            <p className="text-xs text-text-secondary">Entrega en {service.delivery}</p>
          </div>

          <button className="contact-button">
            <Link to={`/service/${service._id}`}>
              Contactar
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard