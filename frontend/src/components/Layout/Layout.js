import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.scss';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="logo">
            <Link to="/">Gerenciamento de Desenvolvedores</Link>
          </h1>
          <nav className="nav">
            <Link
              to="/niveis"
              className={location.pathname === '/niveis' ? 'active' : ''}
            >
              Níveis
            </Link>
            <Link
              to="/desenvolvedores"
              className={
                location.pathname === '/desenvolvedores' ? 'active' : ''
              }
            >
              Desenvolvedores
            </Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
