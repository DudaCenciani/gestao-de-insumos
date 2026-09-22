import { supabase } from './supabase.js';
import { requireAdmin, logout, getPerfil } from './auth.js';
import { showToast, parseErrorMessage } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAdmin();
  if (!session) return;

  // Atualizar cabeçalho do usuário
  document.getElementById('user-email').innerText = session.user.email;
  const perfil = await getPerfil();
  document.getElementById('user-role').innerText = perfil.toUpperCase();
  document.getElementById('btn-logout').addEventListener('click', logout);

  const tbody = document.getElementById('tbody-materiais');
  const modalMaterial = document.getElementById('modal-material');
  const modalEntrada = document.getElementById('modal-entrada');

  // Carregar lista de materiais
  async function loadMateriais() {
    const { data, error } = await supabase
      .from('materiais')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      showToast(parseErrorMessage(error), 'error');
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Erro ao carregar materiais.</td></tr>';
      return;
    }

    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum material cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(m => {
      const isLowStock = m.saldo <= m.estoque_min;
      const statusText = m.ativo ? '<span style="color: #166534; font-weight: 600;">Ativo</span>' : '<span style="color: #991b1b; font-weight: 600;">Inativo</span>';

      return `
        <tr>
          <td style="font-weight: 600;">${m.nome}</td>
          <td>${m.unidade}</td>
          <td>
            <strong>${m.saldo}</strong> ${m.unidade}
            ${isLowStock ? '<span class="stock-alert">⚠️ Baixo Estoque</span>' : ''}
          </td>
          <td>${m.estoque_min} ${m.unidade}</td>
          <td>${statusText}</td>
          <td style="text-align: right;">
            <div style="display: inline-flex; gap: 0.35rem;">
              <button class="btn btn-secondary btn-sm btn-entrada" data-id="${m.id}" data-nome="${m.nome}">+ Entrada</button>
              <button class="btn btn-secondary btn-sm btn-editar" data-id="${m.id}" data-nome="${m.nome}" data-unidade="${m.unidade}" data-saldo="${m.saldo}" data-min="${m.estoque_min}">Editar</button>
              <button class="btn ${m.ativo ? 'btn-outline-danger' : 'btn-secondary'} btn-sm btn-toggle-ativo" data-id="${m.id}" data-ativo="${m.ativo}">
                ${m.ativo ? 'Desativar' : 'Reativar'}
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    attachTableEvents(data);
  }

  function attachTableEvents(materiais) {
    // Botão Entrada
    document.querySelectorAll('.btn-entrada').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const nome = e.target.getAttribute('data-nome');
        document.getElementById('entrada-material-id').value = id;
        document.getElementById('entrada-material-nome').innerText = `Material: ${nome}`;
        document.getElementById('entrada-quantidade').value = '';
        modalEntrada.style.display = 'flex';
      });
    });

    // Botão Editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const nome = e.target.getAttribute('data-nome');
        const unidade = e.target.getAttribute('data-unidade');
        const min = e.target.getAttribute('data-min');

        document.getElementById('modal-material-title').innerText = 'Editar Material';
        document.getElementById('material-id').value = id;
        document.getElementById('material-nome').value = nome;
        document.getElementById('material-unidade').value = unidade;
        document.getElementById('material-estoque-min').value = min;
        // O saldo não é editável diretamente para baixo ou ajuste manual na edição simples
        document.getElementById('group-saldo-inicial').style.display = 'none';

        modalMaterial.style.display = 'flex';
      });
    });

    // Botão Toggle Ativo/Inativo
    document.querySelectorAll('.btn-toggle-ativo').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const ativoAtual = e.target.getAttribute('data-ativo') === 'true';

        const { error } = await supabase
          .from('materiais')
          .update({ ativo: !ativoAtual })
          .eq('id', id);

        if (error) {
          showToast(parseErrorMessage(error), 'error');
        } else {
          showToast(`Material ${!ativoAtual ? 'reativado' : 'desativado'} com sucesso!`, 'success');
          loadMateriais();
        }
      });
    });
  }

  // Abrir Modal Novo Material
  document.getElementById('btn-novo-material').addEventListener('click', () => {
    document.getElementById('modal-material-title').innerText = 'Cadastrar Material';
    document.getElementById('material-id').value = '';
    document.getElementById('material-nome').value = '';
    document.getElementById('material-unidade').value = '';
    document.getElementById('material-saldo').value = '0';
    document.getElementById('material-estoque-min').value = '0';
    document.getElementById('group-saldo-inicial').style.display = 'block';

    modalMaterial.style.display = 'flex';
  });

  // Fechar Modais
  const closeModalMaterial = () => { modalMaterial.style.display = 'none'; };
  const closeModalEntrada = () => { modalEntrada.style.display = 'none'; };

  document.getElementById('btn-close-modal').addEventListener('click', closeModalMaterial);
  document.getElementById('btn-cancelar-modal').addEventListener('click', closeModalMaterial);
  document.getElementById('btn-close-entrada').addEventListener('click', closeModalEntrada);
  document.getElementById('btn-cancelar-entrada').addEventListener('click', closeModalEntrada);

  // Submit Cadastrar/Editar Material
  document.getElementById('form-material').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('material-id').value;
    const nome = document.getElementById('material-nome').value.trim();
    const unidade = document.getElementById('material-unidade').value.trim();
    const estoque_min = parseInt(document.getElementById('material-estoque-min').value) || 0;

    if (id) {
      // Update
      const { error } = await supabase
        .from('materiais')
        .update({ nome, unidade, estoque_min })
        .eq('id', id);

      if (error) {
        showToast(parseErrorMessage(error), 'error');
      } else {
        showToast('Material atualizado com sucesso!', 'success');
        closeModalMaterial();
        loadMateriais();
      }
    } else {
      // Insert
      const saldo = parseInt(document.getElementById('material-saldo').value) || 0;
      const { error } = await supabase
        .from('materiais')
        .insert([{ nome, unidade, saldo, estoque_min, ativo: true }]);

      if (error) {
        showToast(parseErrorMessage(error), 'error');
      } else {
        showToast('Material cadastrado com sucesso!', 'success');
        closeModalMaterial();
        loadMateriais();
      }
    }
  });

  // Submit Entrada de Estoque
  document.getElementById('form-entrada').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('entrada-material-id').value;
    const qtd = parseInt(document.getElementById('entrada-quantidade').value);

    if (!id || !qtd || qtd <= 0) {
      showToast('Informe uma quantidade válida.', 'error');
      return;
    }

    // Buscar saldo atual
    const { data: mat, error: fetchErr } = await supabase
      .from('materiais')
      .select('saldo')
      .eq('id', id)
      .single();

    if (fetchErr) {
      showToast(parseErrorMessage(fetchErr), 'error');
      return;
    }

    const novoSaldo = (mat.saldo || 0) + qtd;

    const { error: updateErr } = await supabase
      .from('materiais')
      .update({ saldo: novoSaldo })
      .eq('id', id);

    if (updateErr) {
      showToast(parseErrorMessage(updateErr), 'error');
    } else {
      showToast('Estoque atualizado com sucesso!', 'success');
      closeModalEntrada();
      loadMateriais();
    }
  });

  loadMateriais();
});
