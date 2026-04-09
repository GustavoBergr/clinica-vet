import React from 'react';
import Layout from '../components/Layout';

export default function Sobre() {
  const tecnologias = [
    { icon: '⚛️', nome: 'React 18', desc: 'Biblioteca para construção de interfaces' },
    { icon: '🟢', nome: 'Node.js + Express', desc: 'Servidor backend RESTful' },
    { icon: '🗄️', nome: 'MySQL', desc: 'Banco de dados relacional' },
    { icon: '🔗', nome: 'Axios', desc: 'Comunicação HTTP com a API' },
    { icon: '🛣️', nome: 'React Router', desc: 'Roteamento entre páginas' },
  ];

  const funcionalidades = [
    'Cadastro, edição e exclusão de Tutores',
    'Cadastro, edição e exclusão de Animais',
    'Agendamento e gerenciamento de Consultas',
    'Visualização detalhada de cada entidade',
    'Paginação em todas as listagens',
    'Busca/filtro em tempo real',
    'Validações no frontend e backend',
    'Tratamento de erros com notificações',
    'Dashboard com estatísticas gerais',
  ];

  return (
    <Layout title="Sobre o Sistema" subtitle="Informações do projeto">
      {/* Student Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--teal-dark) 0%, var(--teal) 100%)',
        borderRadius: 'var(--radius)',
        padding: '36px 40px',
        color: 'white',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)',
          fontSize: '7rem', opacity: 0.1,
        }}>🎓</div>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.75, marginBottom: 6 }}>
          Trabalho Acadêmico — Desenvolvimento Web
        </p>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem', marginBottom: 8 }}>
          Gustavo Berg Ribeiro
        </h2>
        <p style={{ opacity: 0.85, fontSize: '0.95rem' }}>
          Sistema de Gestão de Clínica Veterinária — CRUD completo com React, Node.js e MySQL
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Sobre o Sistema */}
        <div className="detail-card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>📋 Sobre o Sistema</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.7, marginBottom: 14 }}>
            O <strong>VetCare</strong> é um sistema de gerenciamento para clínicas veterinárias, permitindo
            o controle completo de tutores, animais e consultas através de uma interface moderna e intuitiva.
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: 1.7 }}>
            O sistema implementa todas as operações CRUD (Create, Read, Update, Delete) com
            validações robustas no backend e feedback visual ao usuário.
          </p>
        </div>

        {/* Tecnologias */}
        <div className="detail-card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>🛠️ Tecnologias Utilizadas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tecnologias.map(t => (
              <div key={t.nome} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.3rem' }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--slate-900)' }}>{t.nome}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funcionalidades */}
      <div className="detail-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>✅ Funcionalidades Implementadas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {funcionalidades.map(f => (
            <div key={f} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', background: 'var(--teal-soft)',
              borderRadius: 'var(--radius-sm)', fontSize: '0.85rem',
              color: 'var(--slate-700)', fontWeight: 500,
            }}>
              <span style={{ color: 'var(--teal)', fontWeight: 700 }}>✓</span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Footer info */}
    </Layout>
  );
}
