import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { animaisAPI, tutoresAPI } from '../services/api';
import { toast } from '../components/Toast';

const EMPTY_FORM = { nome: '', especie: '', raca: '', data_nascimento: '', peso: '', tutor_id: '', observacoes: '' };
const ESPECIES = ['Cachorro', 'Gato', 'Coelho', 'Pássaro', 'Hamster', 'Tartaruga', 'Outro'];

export default function Animais() {
  const navigate = useNavigate();
  const [animais, setAnimais] = useState([]);
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
  const [tutoresList, setTutoresList] = useState([]);

  const fetchAnimais = useCallback(() => {
    setLoading(true);
    animaisAPI.listar({ page, limit: 8, search }).then(res => {
      setAnimais(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    }).catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchAnimais(); }, [fetchAnimais]);
  useEffect(() => { setPage(1); }, [search]);

  const loadTutores = () => {
    tutoresAPI.listar({ limit: 100 }).then(res => setTutoresList(res.data.data));
  };

  const openCreate = () => {
    loadTutores();
    setEditId(null); setForm(EMPTY_FORM); setFormError(''); setModal(true);
  };

  const openEdit = (a) => {
    loadTutores();
    setEditId(a.id);
    const dataNasc = a.data_nascimento ? a.data_nascimento.split('T')[0] : '';
    setForm({ nome: a.nome, especie: a.especie, raca: a.raca, data_nascimento: dataNasc, peso: a.peso, tutor_id: a.tutor_id, observacoes: a.observacoes || '' });
    setFormError('');
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    setFormError('');
    setSubmitting(true);
    try {
      if (editId) {
        await animaisAPI.atualizar(editId, form);
        toast('Animal atualizado com sucesso!');
      } else {
        await animaisAPI.criar(form);
        toast('Animal cadastrado com sucesso!');
      }
      setModal(false);
      fetchAnimais();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await animaisAPI.deletar(deleteId);
      toast('Animal removido com sucesso!');
      setDeleteId(null);
      fetchAnimais();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const especieBadge = (e) => {
    const map = { Cachorro: '🐕', Gato: '🐈', Coelho: '🐰', 'Pássaro': '🐦', Hamster: '🐹', Tartaruga: '🐢' };
    return map[e] || '🐾';
  };

  const calcAge = (d) => {
    if (!d) return '-';
    const diff = (new Date() - new Date(d)) / (1000 * 60 * 60 * 24 * 365.25);
    const years = Math.floor(diff);
    return years === 0 ? 'Menos de 1 ano' : `${years} ano${years !== 1 ? 's' : ''}`;
  };

  return (
    <Layout title="Animais" subtitle={`${total} animais cadastrados`}>
      <div className="toolbar">
        <input className="search-input" placeholder="Buscar por nome, espécie ou tutor..." value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn btn-primary" onClick={openCreate}>+ Novo Animal</button>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : animais.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🐾</div>
              <p>Nenhum animal encontrado</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Animal</th>
                  <th>Espécie / Raça</th>
                  <th>Idade</th>
                  <th>Peso</th>
                  <th>Tutor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {animais.map(a => (
                  <tr key={a.id}>
                    <td>
                      <span style={{ marginRight: 6 }}>{especieBadge(a.especie)}</span>
                      <strong style={{ cursor: 'pointer', color: 'var(--teal-dark)' }} onClick={() => navigate(`/animais/${a.id}`)}>{a.nome}</strong>
                    </td>
                    <td>{a.especie} • {a.raca}</td>
                    <td>{calcAge(a.data_nascimento)}</td>
                    <td>{a.peso} kg</td>
                    <td style={{ cursor: 'pointer', color: 'var(--teal-dark)' }} onClick={() => navigate(`/tutores/${a.tutor_id}`)}>{a.tutor_nome}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/animais/${a.id}`)}>👁 Ver</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>✏️ Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(a.id)}>🗑 Remover</button>
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

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Editar Animal' : 'Novo Animal'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="form-error">⚠️ {formError}</div>}
              <div className="form-grid">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Nome do Animal *</label>
                    <input name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Rex" />
                  </div>
                  <div className="form-group">
                    <label>Espécie *</label>
                    <select name="especie" value={form.especie} onChange={handleChange}>
                      <option value="">Selecione...</option>
                      {ESPECIES.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Raça *</label>
                    <input name="raca" value={form.raca} onChange={handleChange} placeholder="Ex: Golden Retriever" />
                  </div>
                  <div className="form-group">
                    <label>Peso (kg) *</label>
                    <input name="peso" type="number" step="0.01" value={form.peso} onChange={handleChange} placeholder="Ex: 12.5" />
                  </div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Data de Nascimento *</label>
                    <input name="data_nascimento" type="date" value={form.data_nascimento} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Tutor *</label>
                    <select name="tutor_id" value={form.tutor_id} onChange={handleChange}>
                      <option value="">Selecione o tutor...</option>
                      {tutoresList.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Observações</label>
                  <textarea name="observacoes" value={form.observacoes} onChange={handleChange} placeholder="Alergias, condições especiais, etc." />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Salvando...' : editId ? 'Salvar Alterações' : 'Cadastrar Animal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Confirmar exclusão</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--slate-700)', fontSize: '0.9rem' }}>
                Tem certeza que deseja remover este animal? Todas as consultas vinculadas também serão excluídas.
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
