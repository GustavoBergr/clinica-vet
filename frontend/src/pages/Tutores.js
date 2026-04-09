import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { tutoresAPI } from '../services/api';
import { toast } from '../components/Toast';

const EMPTY_FORM = { nome: '', cpf: '', telefone: '', email: '', endereco: '' };

function formatCPF(v) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(v) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{4})$/, '$1-$2');
}

export default function Tutores() {
  const navigate = useNavigate();
  const [tutores, setTutores] = useState([]);
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

  const fetchTutores = useCallback(() => {
    setLoading(true);
    tutoresAPI.listar({ page, limit: 8, search }).then(res => {
      setTutores(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    }).catch(e => toast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchTutores(); }, [fetchTutores]);
  useEffect(() => { setPage(1); }, [search]);

  const openCreate = () => { setEditId(null); setForm(EMPTY_FORM); setFormError(''); setModal(true); };
  const openEdit = (t) => {
    setEditId(t.id);
    setForm({ nome: t.nome, cpf: t.cpf, telefone: t.telefone, email: t.email, endereco: t.endereco });
    setFormError('');
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cpf') setForm(f => ({ ...f, cpf: formatCPF(value) }));
    else if (name === 'telefone') setForm(f => ({ ...f, telefone: formatPhone(value) }));
    else setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    setFormError('');
    setSubmitting(true);
    try {
      if (editId) {
        await tutoresAPI.atualizar(editId, form);
        toast('Tutor atualizado com sucesso!');
      } else {
        await tutoresAPI.criar(form);
        toast('Tutor cadastrado com sucesso!');
      }
      setModal(false);
      fetchTutores();
    } catch (e) {
      setFormError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await tutoresAPI.deletar(deleteId);
      toast('Tutor removido com sucesso!');
      setDeleteId(null);
      fetchTutores();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <Layout title="Tutores" subtitle={`${total} tutores cadastrados`}>
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={openCreate}>+ Novo Tutor</button>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : tutores.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <p>Nenhum tutor encontrado</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {tutores.map(t => (
                  <tr key={t.id}>
                    <td><strong style={{ cursor: 'pointer', color: 'var(--teal-dark)' }} onClick={() => navigate(`/tutores/${t.id}`)}>{t.nome}</strong></td>
                    <td>{t.cpf}</td>
                    <td>{t.telefone}</td>
                    <td>{t.email}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/tutores/${t.id}`)}>👁 Ver</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>✏️ Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(t.id)}>🗑 Remover</button>
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
            <span>Mostrando página {page} de {totalPages} ({total} resultados)</span>
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
          <div className="modal">
            <div className="modal-header">
              <h3>{editId ? 'Editar Tutor' : 'Novo Tutor'}</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {formError && <div className="form-error">⚠️ {formError}</div>}
              <div className="form-grid">
                <div className="form-group">
                  <label>Nome completo *</label>
                  <input name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: João da Silva" />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>CPF *</label>
                    <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
                  </div>
                  <div className="form-group">
                    <label>Telefone *</label>
                    <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" />
                  </div>
                </div>
                <div className="form-group">
                  <label>E-mail *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@exemplo.com" />
                </div>
                <div className="form-group">
                  <label>Endereço *</label>
                  <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número, bairro, cidade/UF" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Salvando...' : editId ? 'Salvar Alterações' : 'Cadastrar Tutor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmação de Exclusão */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div className="modal-header">
              <h3>Confirmar exclusão</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--slate-700)', fontSize: '0.9rem' }}>
                Tem certeza que deseja remover este tutor? Todos os animais e consultas vinculados também serão excluídos.
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
