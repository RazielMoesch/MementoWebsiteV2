import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ isLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="navbar-container">
      <Link to="/" className="navbar-title">Memento</Link>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/demo" onClick={() => setMenuOpen(false)}>Demo</Link>
        {isLoggedIn && (
          <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
        )}
        {!isLoggedIn && (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
