import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { tutoresAPI } from '../services/api';
import { toast } from '../components/Toast';

export default function TutorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tutoresAPI.buscarPorId(id),
      tutoresAPI.animais(id)
    ]).then(([t, a]) => {
      setTutor(t.data);
      setAnimais(a.data);
    }).catch(e => {
      toast(e.message, 'error');
      navigate('/tutores');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const calcAge = (d) => {
    if (!d) return '-';
    const diff = (new Date() - new Date(d)) / (1000 * 60 * 60 * 24 * 365.25);
    return `${Math.floor(diff)} anos`;
  };

  const especieBadge = (e) => {
    const map = { Cachorro: '🐕', Gato: '🐈', Coelho: '🐰', Pássaro: '🐦' };
    return map[e] || '🐾';
  };

  if (loading) return <Layout title="Tutor"><div className="loading"><div className="spinner" /></div></Layout>;
  if (!tutor) return null;

  return (
    <Layout title="Detalhes do Tutor" subtitle="Informações completas do tutor">
      <button className="back-btn" onClick={() => navigate('/tutores')}>← Voltar para Tutores</button>

      <div className="detail-card">
        <div className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="detail-avatar">👤</div>
            <div className="detail-title">
              <h2>{tutor.nome}</h2>
              <p>CPF: {tutor.cpf}</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/tutores')}>✏️ Editar</button>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <label>Telefone</label>
            <p>{tutor.telefone}</p>
          </div>
          <div className="detail-item">
            <label>E-mail</label>
            <p>{tutor.email}</p>
          </div>
          <div className="detail-item" style={{ gridColumn: 'span 2' }}>
            <label>Endereço</label>
            <p>{tutor.endereco}</p>
          </div>
          <div className="detail-item">
            <label>Cadastrado em</label>
            <p>{new Date(tutor.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>🐾 Animais deste tutor ({animais.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/animais')}>+ Cadastrar Animal</button>
      </div>

      {animais.length === 0 ? (
        <div className="table-card">
          <div className="empty-state">
            <div className="empty-icon">🐾</div>
            <p>Nenhum animal cadastrado para este tutor</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {animais.map(a => (
            <div key={a.id} className="detail-card" style={{ cursor: 'pointer', marginBottom: 0 }}
              onClick={() => navigate(`/animais/${a.id}`)}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div className="detail-avatar" style={{ width: 52, height: 52, fontSize: '1.5rem' }}>
                  {especieBadge(a.especie)}
                </div>
                <div>
                  <strong style={{ color: 'var(--teal-dark)' }}>{a.nome}</strong>
                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{a.especie} • {a.raca}</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>{calcAge(a.data_nascimento)} • {a.peso} kg</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
