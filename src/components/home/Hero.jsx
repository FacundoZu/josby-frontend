import { useState } from "react";
import { GoSearch } from "react-icons/go";

const Hero = ({ onSearchChange, initialSearch }) => {
  const [searchInput, setSearchInput] = useState(initialSearch || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <section className="w-full bg-linear-to-r from-primary-dark/90 to-primary py-20 px-6">
      <div className="max-w-4xl mx-auto text-center text-white">

        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-text-primary">
          Encuentra el freelancer perfecto para tu proyecto
        </h1>

        <p className="mt-4 text-lg md:text-xl opacity-90 text-text-primary">
          Miles de profesionales listos para ayudarte con <br />
          diseño, programación, marketing y más
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col md:flex-row items-center justify-center w-full max-w-2xl mx-auto">

          <div className="flex bg-white p-3 shadow-lg w-full rounded-xl md:rounded-l-xl md:rounded-r-none">
            <GoSearch className="text-text-secondary-dark mx-2 cursor-pointer" size={24} />

            <input
              type="text"
              placeholder="Buscar por servicio o profesional"
              className="flex-1 outline-none px-2 text-text-secondary-dark"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <button
            type="submit"
            className="bg-primary-dark hover:bg-primary-dark/80 text-white font-semibold shadow-lg px-6 py-3 mt-3 md:mt-0 w-full md:w-auto rounded-xl md:rounded-r-xl md:rounded-l-none cursor-pointer"
          >
            Buscar
          </button>

        </form>

      </div>
    </section>
  );
};

export default Hero;
