import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Sistema de Gerenciamento de Desenvolvedores</h1>
        <p>Gerencie níveis e desenvolvedores de forma simples e eficiente</p>

        <div className="actions">
          <Link to="/niveis" className="btn btn-primary">
            Gerenciar Níveis
          </Link>
          <Link to="/desenvolvedores" className="btn btn-secondary">
            Gerenciar Desenvolvedores
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
