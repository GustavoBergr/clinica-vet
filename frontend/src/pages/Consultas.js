import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { consultasAPI, animaisAPI } from '../services/api';
import { toast } from '../components/Toast';

const EMPTY_FORM = {
  animal_id: '', data_consulta: '', hora_consulta: '',
  motivo: '', diagnostico: '', tratamento: '', valor: '', status: 'agendada'
};

export default function Consultas() {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [animaisList, setAnimaisList] = useState([]);

  const fetchConsultas = useCallback(() => {
    setLoading(true);
    consultasAPI.listar({ page, limit: 8, search })
      .then(res => {
        setConsultas(res.data.data);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchConsultas(); }, [fetchConsultas]);
  useEffect(() => { setPage(1); }, [search]);

  const loadAnimais = () => {
    animaisAPI.listar({ limit: 200 }).then(res => setAnimaisList(res.data.data));
  };

  const openCreate = () => {
    loadAnimais();
    setEditId(null); setForm(EMPTY_FORM); setFormError(''); setModal(true);
  };

  const openEdit = (c) => {
    loadAnimais();
    setEditId(c.id);
    setForm({
      animal_id: c.animal_id,
      data_consulta: c.data_consulta ? c.data_consulta.split('T')[0] : '',
      hora_consulta: c.hora_consulta ? c.hora_consulta.slice(0, 5) : '',
      motivo: c.motivo,
      diagnostico: c.diagnostico || '',
      tratamento: c.tratamento || '',
      valor: c.valor,
      status: c.status,
    });
    setFormError(''); setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    setFormError(''); setSubmitting(true);
    try {
      if (editId) {
        await consultasAPI.atualizar(editId, form);
        toast('Consulta atualizada com sucesso!');
      } else {
        await consultasAPI.criar(form);
        toast('Consulta cadastrada com sucesso!');
      }
      setModal(false);
      fetchConsultas();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await consultasAPI.deletar(deleteId);
      toast('Consulta removida com sucesso!');
      setDeleteId(null);
      fetchConsultas();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '-';

  const statusBadge = (s) => {
    const map = { agendada: 'badge-amber', realizada: 'badge-green', cancelada: 'badge-red' };
    return <span className={`badge ${map[s] || 'badge-slate'}`}>{s}</span>;
  };

  return (
    <Layout title="Consultas" subtitle={`${total} consultas registradas`}>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Buscar por animal, motivo ou status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={openCreate}>+ Nova Consulta</button>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : consultas.length === 0 ? (
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
                  <th>Data / Hora</th>
                  <th>Motivo</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {consultas.map(c => (
                  <tr key={c.id}>
                    <td>
                      <strong
                        style={{ cursor: 'pointer', color: 'var(--teal-dark)' }}
                        onClick={() => navigate(`/consultas/${c.id}`)}
                      >
                        {c.animal_nome}
                      </strong>
                      <br />
                      <small style={{ color: 'var(--slate-500)' }}>{c.especie}</small>
                    </td>
                    <td>{c.tutor_nome}</td>
                    <td>
                      {formatDate(c.data_consulta)}
                      <br />
                      <small style={{ color: 'var(--slate-500)' }}>
                        {c.hora_consulta ? c.hora_consulta.slice(0, 5) : ''}
                      </small>
                    </td>
                    <td style={{ maxWidth: 200 }}>{c.motivo}</td>
                    <td>R$ {parseFloat(c.valor).toFixed(2)}</td>
                    <td>{statusBadge(c.status)}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/consultas/${c.id}`)}>👁 Ver</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}>✏️ Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(c.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <span>Página {page} de {totalPages} ({total} resultados)</span>
            <div className="pagination-controls">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Criar/Editar */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal" style={{ maxWidth: 620 }}>
            <div className="modal-header">
              <h3>{editId ? 'Editar Consulta' : 'Nova Consulta'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="form-error">⚠️ {formError}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label>Animal *</label>
                  <select name="animal_id" value={form.animal_id} onChange={handleChange}>
                    <option value="">Selecione o animal...</option>
                    {animaisList.map(a => (
                      <option key={a.id} value={a.id}>{a.nome} ({a.especie}) — Tutor: {a.tutor_nome}</option>
                    ))}
                  </select>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Data *</label>
                    <input name="data_consulta" type="date" value={form.data_consulta} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Hora *</label>
                    <input name="hora_consulta" type="time" value={form.hora_consulta} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Motivo *</label>
                  <input name="motivo" value={form.motivo} onChange={handleChange} placeholder="Ex: Consulta de rotina, vacinação..." />
                </div>

                <div className="form-group">
                  <label>Diagnóstico</label>
                  <textarea name="diagnostico" value={form.diagnostico} onChange={handleChange} placeholder="Diagnóstico do veterinário..." />
                </div>

                <div className="form-group">
                  <label>Tratamento</label>
                  <textarea name="tratamento" value={form.tratamento} onChange={handleChange} placeholder="Tratamento prescrito..." />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Valor (R$) *</label>
                    <input name="valor" type="number" step="0.01" min="0" value={form.valor} onChange={handleChange} placeholder="0.00" />
                  </div>
                  <div className="form-group">
                    <label>Status *</label>
                    <select name="status" value={form.status} onChange={handleChange}>
                      <option value="agendada">Agendada</option>
                      <option value="realizada">Realizada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Salvando...' : editId ? 'Salvar Alterações' : 'Cadastrar Consulta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exclusão */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Confirmar exclusão</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--slate-700)', fontSize: '0.9rem' }}>
                Tem certeza que deseja remover esta consulta? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete}>Sim, remover</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
