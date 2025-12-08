import FreelancerList from "../../components/freelancers/FreelancerList";

export default function FreelancersPage() {
  return (
    <div className="max-w-7xl mx-auto my-16 px-4">
      <h1 className="text-3xl font-bold mb-8">Freelancers Disponibles</h1>
      <FreelancerList />
    </div>
  );
}
