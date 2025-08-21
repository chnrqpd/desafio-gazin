import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Niveis from './pages/Niveis/Niveis';
import Desenvolvedores from './pages/Desenvolvedores/Desenvolvedores';
import './styles/globals.scss';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/niveis" element={<Niveis />} />
          <Route path="/desenvolvedores" element={<Desenvolvedores />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
