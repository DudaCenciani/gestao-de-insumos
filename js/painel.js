import { supabase } from './supabase.js';
import { requireAuth, logout, getPerfil, isAdmin } from './auth.js';
import { showToast, renderStatusBadge, formatDate, parseErrorMessage } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuth();
  if (!session) return;

  // Cabeçalho do Usuário
  document.getElementById('user-email').innerText = session.user.email;
  const perfil = await getPerfil();
  const isUserAdmin = await isAdmin();
  document.getElementById('user-role').innerText = perfil.toUpperCase();
  document.getElementById('btn-logout').addEventListener('click', logout);

  const tbody = document.getElementById('tbody-requisicoes');
  const navMateriais = document.getElementById('nav-materiais');
  const containerFiltros = document.getElementById('container-filtros');
  const thSolicitante = document.getElementById('th-solicitante');
  const thAcoes = document.getElementById('th-acoes');
  const painelSubtitle = document.getElementById('painel-subtitle');

  let currentFilter = 'todas';

  if (!isUserAdmin) {
    if (navMateriais) navMateriais.style.display = 'none';
    painelSubtitle.innerText = 'Acompanhe o status das suas solicitações de materiais';
  } else {
    containerFiltros.style.display = 'block';
    thSolicitante.style.display = 'table-cell';
    thAcoes.style.display = 'table-cell';
    painelSubtitle.innerText = 'Gerencie todas as requisições de insumos da organização';
  }

  // Carregar requisições
  async function loadRequisicoes() {
    let query = supabase
      .from('requisicoes')
      .select(`
        id,
        quantidade,
        status,
        justificativa,
        criado_em,
        solicitante_id,
        materiais ( id, nome, unidade )
      `)
      .order('criado_em', { ascending: false });

    if (!isUserAdmin) {
      query = query.eq('solicitante_id', session.user.id);
    } else if (currentFilter !== 'todas') {
      query = query.eq('status', currentFilter);
    }

    const { data, error } = await query;

    if (error) {
      showToast(parseErrorMessage(error), 'error');
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Erro ao carregar requisições.</td></tr>';
      return;
    }

    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Nenhuma requisição encontrada.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(req => {
      const mat = req.materiais || { nome: 'Material Excluído/Desconhecido', unidade: 'un' };
      const statusBadge = renderStatusBadge(req.status);
      const dataCriacao = formatDate(req.criado_em);
      const solicitanteText = req.solicitante_id === session.user.id ? 'Você' : req.solicitante_id.substring(0, 8) + '...';

      let acoesHtml = '-';
      if (isUserAdmin) {
        if (req.status === 'pendente') {
          acoesHtml = `
            <div style="display: inline-flex; gap: 0.35rem;">
              <button class="btn btn-primary btn-sm btn-aprovar" data-id="${req.id}">Aprovar</button>
              <button class="btn btn-outline-danger btn-sm btn-recusar" data-id="${req.id}">Recusar</button>
            </div>
          `;
        } else if (req.status === 'aprovada') {
          acoesHtml = `
            <button class="btn btn-secondary btn-sm btn-entregar" data-id="${req.id}">Registrar Entrega</button>
          `;
        }
      }

      return `
        <tr>
          <td style="font-weight: 600;">
            ${mat.nome}
            ${req.justificativa ? `<div style="font-size: 0.75rem; color: var(--on-surface-variant); font-weight: normal;">Obs: ${req.justificativa}</div>` : ''}
          </td>
          <td>${req.quantidade} ${mat.unidade}</td>
          ${isUserAdmin ? `<td><span style="font-family: monospace; font-size: 0.8rem;">${solicitanteText}</span></td>` : ''}
          <td>${statusBadge}</td>
          <td>${dataCriacao}</td>
          ${isUserAdmin ? `<td style="text-align: right;">${acoesHtml}</td>` : ''}
        </tr>
      `;
    }).join('');

    attachActionEvents();
  }

  function attachActionEvents() {
    // Aprovar
    document.querySelectorAll('.btn-aprovar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (!confirm('Deseja realmente APROVAR esta requisição?')) return;

        const { error } = await supabase
          .from('requisicoes')
          .update({
            status: 'aprovada',
            resolvido_em: new Date().toISOString(),
            resolvido_por: session.user.id
          })
          .eq('id', id);

        if (error) {
          showToast(parseErrorMessage(error), 'error');
        } else {
          showToast('Requisição aprovada!', 'success');
          loadRequisicoes();
        }
      });
    });

    // Recusar
    document.querySelectorAll('.btn-recusar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (!confirm('Deseja realmente RECUSAR esta requisição?')) return;

        const { error } = await supabase
          .from('requisicoes')
          .update({
            status: 'recusada',
            resolvido_em: new Date().toISOString(),
            resolvido_por: session.user.id
          })
          .eq('id', id);

        if (error) {
          showToast(parseErrorMessage(error), 'error');
        } else {
          showToast('Requisição recusada.', 'info');
          loadRequisicoes();
        }
      });
    });

    // Registrar Entrega (Chama RPC entregar_requisicao)
    document.querySelectorAll('.btn-entregar').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (!confirm('Confirmar a entrega física e baixa no estoque deste material?')) return;

        const { error } = await supabase.rpc('entregar_requisicao', {
          p_requisicao_id: id
        });

        if (error) {
          showToast(parseErrorMessage(error), 'error');
        } else {
          showToast('Entrega registrada e estoque atualizado com sucesso!', 'success');
          loadRequisicoes();
        }
      });
    });
  }

  // Eventos de Filtro
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.getAttribute('data-status');
      loadRequisicoes();
    });
  });

  loadRequisicoes();
});
