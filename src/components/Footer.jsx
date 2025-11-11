import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import josbyLogo from "../assets/imgs/josby-logo.png";

const Footer = () => {
  return (
    <footer className="bg-text-primary py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-center gap-10 pt-2">
          <div>
            <img src={josbyLogo} alt="Logo de Josby" className="w-52" />
          </div>

            <div className="flex flex-col gap-3 text-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <a
              href="#"
              className="text-text-secondary-light hover:text-white transition-colors"
            >
              Servicios
            </a>
            <a
              href="#"
              className="text-text-secondary-light hover:text-white transition-colors"
            >
              Freelancers
            </a>
            <a
              href="#"
              className="text-text-secondary-light hover:text-white transition-colors"
            >
              Ofrecer servicio
            </a>
          </div>

          <div>
            <h3 className="text-base text-center font-semibold text-text-secondary-light mb-4">
              Contacto
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-text-primary hover:bg-hover-cyan transition-colors"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-text-primary hover:bg-hover-cyan transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-text-primary hover:bg-hover-cyan transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-500 pt-8">
          <p className="text-sm text-center text-text-secondary-light/70">
            © Josby {new Date().getFullYear()}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
