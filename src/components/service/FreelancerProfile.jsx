import { FaMapPin } from "react-icons/fa"

const FreelancerProfile = ({ freelancer }) => {
  console.log(freelancer)
  return (
    <div className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm mt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shrink-0">
          {freelancer.image ? (
            <img src={freelancer.image} alt={freelancer.firstname} className="w-16 h-16 rounded-full flex items-center justify-center" />
          ) : (
            <div>
              {freelancer.firstname.charAt(0)}{freelancer.lastname.charAt(0)}
            </div>
          )}
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold text-text-primary">{freelancer.firstname} {freelancer.lastname}</h3>
          <p className="text-text-secondary-dark">{freelancer.title}</p>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-text-secondary-dark mt-1">
            <FaMapPin size={14} className="text-secondary" />
            <span>{freelancer.location}</span>
          </div>
        </div>
      </div>
      <p className="text-text-secondary-dark text-sm leading-relaxed border-t border-gray-100 pt-4">
        {freelancer.description}
      </p>
    </div>
  )
}

export default FreelancerProfile