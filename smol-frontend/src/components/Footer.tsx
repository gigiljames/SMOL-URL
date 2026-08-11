import { BsInstagram } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { Link } from "react-router";
import { ROUTES } from "../constants/routes.ts";

function Footer() {
  return (
    <div className="w-full p-10 bg-gray-800 text-white/80 patrick-hand tracking-wider">
      <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
        <div className="flex flex-col gap-2 items-center lg:items-start">
          <h2 className="text-4xl matemasie">SMOL</h2>
          <p className="text-center">
            Long URLs clutter your chats. Shorten it using SMOL.
          </p>
        </div>
        <div className="grid grid-cols-3 text-xl gap-10 ">
          <Link to={ROUTES.SOCIALS.LINKEDIN} className="hover:text-blue-400">
            <FaLinkedin />
          </Link>
          <Link to={ROUTES.SOCIALS.YOUTUBE} className="hover:text-red-600">
            <IoLogoYoutube />
          </Link>
          <Link to={ROUTES.SOCIALS.INSTAGRAM} className="hover:text-purple-600">
            <BsInstagram />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
