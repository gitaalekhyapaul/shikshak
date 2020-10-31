import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="hidden md:block fixed top-0 left-0 mt-3 ml-3">
      <Link to="/">
        <img
          src="https://www.flaticon.com/svg/static/icons/svg/2762/2762438.svg"
          alt="shikshak"
          className="w-20"
        />
      </Link>
    </div>
  );
};

export default Navbar;
