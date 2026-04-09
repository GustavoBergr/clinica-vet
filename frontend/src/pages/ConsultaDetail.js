import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { consultasAPI } from '../services/api';
import { toast } from '../components/Toast';

export default function ConsultaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consulta, setConsulta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    consultasAPI.buscarPorId(id)
      .then(res => setConsulta(res.data))
      .catch(e => { toast(e.message, 'error'); navigate('/consultas'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  const statusBadge = (s) => {
    const map = { agendada: 'badge-amber', realizada: 'badge-green', cancelada: 'badge-red' };
    return <span className={`badge ${map[s] || 'badge-slate'}`}>{s}</span>;
  };

  const statusColor = (s) => {
    if (s === 'realizada') return 'var(--green)';
    if (s === 'cancelada') return 'var(--red)';
    return 'var(--amber)';
  };

  if (loading) return <Layout title="Consulta"><div className="loading"><div className="spinner" /></div></Layout>;
  if (!consulta) return null;

  return (
    <Layout title="Detalhes da Consulta" subtitle="Informações completas da consulta">
      <button className="back-btn" onClick={() => navigate('/consultas')}>← Voltar para Consultas</button>

      {/* Header Card */}
      <div className="detail-card" style={{ borderTop: `4px solid ${statusColor(consulta.status)}` }}>
        <div className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="detail-avatar">📋</div>
            <div className="detail-title">
              <h2>Consulta #{consulta.id}</h2>
              <p>{consulta.motivo}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {statusBadge(consulta.status)}
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/consultas')}>✏️ Editar</button>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <label>Animal</label>
            <p
              style={{ cursor: 'pointer', color: 'var(--teal-dark)' }}
              onClick={() => navigate(`/animais/${consulta.animal_id}`)}
            >
              {consulta.animal_nome}
            </p>
          </div>
          <div className="detail-item">
            <label>Espécie / Raça</label>
            <p>{consulta.especie} • {consulta.raca}</p>
          </div>
          <div className="detail-item">
            <label>Tutor</label>
            <p>{consulta.tutor_nome}</p>
          </div>
          <div className="detail-item">
            <label>Telefone do Tutor</label>
            <p>{consulta.tutor_telefone}</p>
          </div>
          <div className="detail-item">
            <label>Data da Consulta</label>
            <p>{formatDate(consulta.data_consulta)}</p>
          </div>
          <div className="detail-item">
            <label>Horário</label>
            <p>{consulta.hora_consulta ? consulta.hora_consulta.slice(0, 5) : '-'}</p>
          </div>
          <div className="detail-item">
            <label>Valor</label>
            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--teal-dark)' }}>
              R$ {parseFloat(consulta.valor).toFixed(2)}
            </p>
          </div>
          <div className="detail-item">
            <label>Status</label>
            <p>{statusBadge(consulta.status)}</p>
          </div>
        </div>
      </div>

      {/* Diagnóstico e Tratamento */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="detail-card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
            🔍 Diagnóstico
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
            {consulta.diagnostico || <span style={{ color: 'var(--slate-400)', fontStyle: 'italic' }}>Não informado</span>}
          </p>
        </div>
        <div className="detail-card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>
            💊 Tratamento
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--slate-700)', lineHeight: 1.6 }}>
            {consulta.tratamento || <span style={{ color: 'var(--slate-400)', fontStyle: 'italic' }}>Não informado</span>}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" onClick={() => navigate(`/animais/${consulta.animal_id}`)}>
          🐾 Ver Animal
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(`/tutores/${consulta.tutor_id || ''}`)}>
          👤 Ver Tutor
        </button>
      </div>
    </Layout>
  );
}
