import freelancersData from "../../data/freelancersData.json";
import FreelancerFilters from "../../components/freelancers/FreelancerFilters";
import FreelancerCard from "../../components/freelancers/FreelancerCard";


export default function FreelancersPage() {

  const freelancers = freelancersData

  return (
    <div className="max-w-7xl mx-auto my-16 px-4">
      <FreelancerFilters/>

      <p className="text-gray-600 mb-6">
        {freelancers.length} freelancers disponibles
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {freelancers.map((freelancer, i) => (
          <FreelancerCard key={i} data={freelancer} />
        ))}
      </div>
    </div>
  );
}
