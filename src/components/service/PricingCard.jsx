import { LuClock2 } from "react-icons/lu"
import { FaCheck } from "react-icons/fa6"

const PricingCard = ({ price, features, deliveryTime, title }) => {

  return (
    <div className="sticky top-8 border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
      <div className="mb-4">
        <span className="text-sm text-text-secondary-dark font-medium">Estándar</span>
        <h3 className="text-3xl font-bold text-text-primary">${price}</h3>
        <p className="text-sm text-text-secondary-dark mt-1">{title}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-text-secondary-dark mb-6">
        <LuClock2 size={16} />
        <span>Entrega en {deliveryTime} días</span>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary-dark">
            <FaCheck size={16} className="text-primary shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg cursor-pointer">
        Contratar
      </button>
      <p className="text-center text-xs text-text-secondary-light mt-3">Pago 100% seguro</p>
    </div>
  )
}

export default PricingCard