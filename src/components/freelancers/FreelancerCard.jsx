import { GrLocation } from "react-icons/gr";

export default function FreelancerCard({ data }) {
    return (
        <div className="flex flex-col justify-between bg-white p-4 rounded-2xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
                {data.image ? (
                    <img
                        src={data.image}
                        alt={data.firstname}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ): (
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {data.firstname.charAt(0).toUpperCase()}{data.lastname.charAt(0).toUpperCase()}
                    </div>
                )}

                <div>
                    <h2 className="text-lg font-semibold">{data.firstname} {data.lastname}</h2>
                    <p className="text-gray-600 text-sm">{data.email}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-sm">
                <GrLocation size={14} />
                <span>{data.location}</span>
            </div>

            <p className="text-gray-600 font-semibold my-2">{data.title}</p>
            <p className="text-gray-600 text-sm">{data.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
                {data.skills.map((skill, index) => (
                    <span
                        key={index}
                        className="bg-hover-morado text-white px-3 py-1 rounded-full text-xs"
                    >
                        {skill.name}
                    </span>
                ))}
            </div>

            <button className="contact-button self-end mt-6">
                Contactar
            </button>
        </div>
    );
}
