import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { animaisAPI, consultasAPI } from '../services/api';
import { toast } from '../components/Toast';

export default function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      animaisAPI.buscarPorId(id),
      consultasAPI.listar({ limit: 100 }),
    ]).then(([a, c]) => {
      setAnimal(a.data);
      setConsultas(c.data.data.filter(x => x.animal_id === parseInt(id)));
    }).catch(e => {
      toast(e.message, 'error');
      navigate('/animais');
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  const calcAge = (d) => {
    if (!d) return '-';
    const diff = (new Date() - new Date(d)) / (1000 * 60 * 60 * 24 * 365.25);
    const years = Math.floor(diff);
    return years === 0 ? 'Menos de 1 ano' : `${years} ano${years !== 1 ? 's' : ''}`;
  };

  const especieBadge = (e) => {
    const map = { Cachorro: '🐕', Gato: '🐈', Coelho: '🐰', 'Pássaro': '🐦', Hamster: '🐹', Tartaruga: '🐢' };
    return map[e] || '🐾';
  };

  const statusBadge = (s) => {
    const map = { agendada: 'badge-amber', realizada: 'badge-green', cancelada: 'badge-red' };
    return <span className={`badge ${map[s] || 'badge-slate'}`}>{s}</span>;
  };

  if (loading) return <Layout title="Animal"><div className="loading"><div className="spinner" /></div></Layout>;
  if (!animal) return null;

  return (
    <Layout title="Detalhes do Animal" subtitle="Informações completas do animal">
      <button className="back-btn" onClick={() => navigate('/animais')}>← Voltar para Animais</button>

      <div className="detail-card">
        <div className="detail-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="detail-avatar" style={{ fontSize: '2.2rem' }}>{especieBadge(animal.especie)}</div>
            <div className="detail-title">
              <h2>{animal.nome}</h2>
              <p>{animal.especie} • {animal.raca}</p>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/animais')}>✏️ Editar</button>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <label>Idade</label>
            <p>{calcAge(animal.data_nascimento)}</p>
          </div>
          <div className="detail-item">
            <label>Data de Nascimento</label>
            <p>{formatDate(animal.data_nascimento)}</p>
          </div>
          <div className="detail-item">
            <label>Peso</label>
            <p>{animal.peso} kg</p>
          </div>
          <div className="detail-item">
            <label>Tutor</label>
            <p
              style={{ cursor: 'pointer', color: 'var(--teal-dark)' }}
              onClick={() => navigate(`/tutores/${animal.tutor_id}`)}
            >
              {animal.tutor_nome}
            </p>
          </div>
          <div className="detail-item">
            <label>Telefone do Tutor</label>
            <p>{animal.tutor_telefone}</p>
          </div>
          {animal.observacoes && (
            <div className="detail-item" style={{ gridColumn: 'span 2' }}>
              <label>Observações</label>
              <p>{animal.observacoes}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>📋 Histórico de Consultas ({consultas.length})</h3>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/consultas')}>+ Nova Consulta</button>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          {consultas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>Nenhuma consulta registrada para este animal</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Motivo</th>
                  <th>Diagnóstico</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/consultas/${c.id}`)}>
                    <td>{formatDate(c.data_consulta)}</td>
                    <td>{c.motivo}</td>
                    <td>{c.diagnostico || <span style={{ color: 'var(--slate-400)' }}>—</span>}</td>
                    <td>R$ {parseFloat(c.valor).toFixed(2)}</td>
                    <td>{statusBadge(c.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
