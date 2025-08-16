import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "CRUD" },
    { path: "/", label: "All Users" },
    { path: "/adduser", label: "Add User" },
  ];

  const IconMenu = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
    </svg>
  );
  const IconClose = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M18.3 5.71L12 12.01l-6.3-6.3-1.4 1.41 6.29 6.29-6.3 6.3 1.41 1.4 6.3-6.29 6.29 6.3 1.41-1.41-6.3-6.3 6.3-6.29z" />
    </svg>
  );

  return (
    <nav className="bg-black text-white w-full shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold tracking-wide">
            CRUD
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path + label}
                to={path}
                className={({ isActive }) =>
                  `transition-colors font-medium ${
                    isActive
                      ? "text-sky-400 border-b-2 border-sky-400"
                      : "hover:text-sky-400"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-1 rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-black border-t border-gray-800">
          {navLinks.map(({ path, label }) => (
            <NavLink
              key={path + label}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 font-medium ${
                  isActive
                    ? "text-sky-400 bg-gray-900"
                    : "hover:bg-gray-900 hover:text-sky-400"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
