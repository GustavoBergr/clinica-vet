import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { tutoresAPI, animaisAPI, consultasAPI } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tutores: 0, animais: 0, consultas: 0, agendadas: 0 });
  const [recentConsultas, setRecentConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tutoresAPI.listar({ limit: 1 }),
      animaisAPI.listar({ limit: 1 }),
      consultasAPI.listar({ limit: 5 }),
      consultasAPI.listar({ search: 'agendada', limit: 1 }),
    ]).then(([t, a, c, ag]) => {
      setStats({
        tutores: t.data.total,
        animais: a.data.total,
        consultas: c.data.total,
        agendadas: ag.data.total,
      });
      setRecentConsultas(c.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const statusBadge = (s) => {
    const map = { agendada: 'badge-amber', realizada: 'badge-green', cancelada: 'badge-red' };
    return <span className={`badge ${map[s] || 'badge-slate'}`}>{s}</span>;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  return (
    <Layout title="Dashboard" subtitle="Visão geral da clínica">
      <div className="welcome-banner">
        <h2>Bem-vindo ao VetCare 🐾</h2>
        <p>Sistema de Gestão de Clínica Veterinária • Desenvolvido por Gustavo Berg Ribeiro</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/tutores')}>
              <div className="stat-icon">👤</div>
              <div className="stat-value">{stats.tutores}</div>
              <div className="stat-label">Tutores Cadastrados</div>
            </div>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/animais')}>
              <div className="stat-icon">🐾</div>
              <div className="stat-value">{stats.animais}</div>
              <div className="stat-label">Animais Cadastrados</div>
            </div>
            <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/consultas')}>
              <div className="stat-icon">📋</div>
              <div className="stat-value">{stats.consultas}</div>
              <div className="stat-label">Total de Consultas</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-value" style={{ color: '#d97706' }}>{stats.agendadas}</div>
              <div className="stat-label">Consultas Agendadas</div>
            </div>
          </div>

          <div className="table-card">
            <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Consultas Recentes</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/consultas')}>Ver todas →</button>
            </div>
            <div className="table-wrapper" style={{ marginTop: 16 }}>
              {recentConsultas.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>Nenhuma consulta encontrada</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Animal</th>
                      <th>Tutor</th>
                      <th>Data</th>
                      <th>Motivo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentConsultas.map(c => (
                      <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/consultas/${c.id}`)}>
                        <td><strong>{c.animal_nome}</strong><br /><small style={{ color: 'var(--slate-500)' }}>{c.especie}</small></td>
                        <td>{c.tutor_nome}</td>
                        <td>{formatDate(c.data_consulta)}</td>
                        <td>{c.motivo}</td>
                        <td>{statusBadge(c.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
