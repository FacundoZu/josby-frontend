import ServiceCard from "./ServiceCard";
import services from "../../data/services.json";

const Services = () => {

    return (
        <section className="max-w-7xl mx-auto my-16 px-4">
            <h2 className="sub-title">
                Servicios Populares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {services.map((s, i) => (
                    <ServiceCard key={i} service={s} />
                ))}
            </div>
        </section>
    );
};

export default Services