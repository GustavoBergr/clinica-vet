import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from './components/Toast';
import Dashboard from './pages/Dashboard';
import Tutores from './pages/Tutores';
import TutorDetail from './pages/TutorDetail';
import Animais from './pages/Animais';
import AnimalDetail from './pages/AnimalDetail';
import Consultas from './pages/Consultas';
import ConsultaDetail from './pages/ConsultaDetail';
import Sobre from './pages/Sobre';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tutores" element={<Tutores />} />
        <Route path="/tutores/:id" element={<TutorDetail />} />
        <Route path="/animais" element={<Animais />} />
        <Route path="/animais/:id" element={<AnimalDetail />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/consultas/:id" element={<ConsultaDetail />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
