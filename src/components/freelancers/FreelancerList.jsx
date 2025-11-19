import FreelancerCard from "./FreelancerCard";

export default function FreelancerList({ freelancers }) {
  if (!freelancers.length)
    return <p className="text-gray-600">No se encontraron freelancers.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {freelancers.map((item) => (
        <FreelancerCard
          key={item.usuario._id}
          usuario={item.usuario}
          servicio={item.servicio}
        />
      ))}
    </div>
  );
}
