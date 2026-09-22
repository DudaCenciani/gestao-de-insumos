import { supabase } from './supabase.js';
import { requireAuth, logout, getPerfil, isAdmin } from './auth.js';
import { showToast, parseErrorMessage } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  const session = await requireAuth();
  if (!session) return;

  // Atualizar cabeçalho do usuário
  document.getElementById('user-email').innerText = session.user.email;
  const perfil = await getPerfil();
  document.getElementById('user-role').innerText = perfil.toUpperCase();
  document.getElementById('btn-logout').addEventListener('click', logout);

  // Ocultar link de materiais para quem não é admin
  const isUserAdmin = await isAdmin();
  const navMateriais = document.getElementById('nav-materiais');
  if (!isUserAdmin && navMateriais) {
    navMateriais.style.display = 'none';
  }

  const selectMaterial = document.getElementById('select-material');
  const groupSaldo = document.getElementById('group-info-saldo');
  const spanSaldo = document.getElementById('span-saldo-atual');
  const spanUnidade = document.getElementById('span-unidade');
  const inputQuantidade = document.getElementById('quantidade');
  const btnEnviar = document.getElementById('btn-enviar-requisicao');
  const form = document.getElementById('form-nova-requisicao');

  let materiaisMap = {};

  // Carregar materiais ativos
  async function loadMateriaisDisponiveis() {
    const { data, error } = await supabase
      .from('materiais')
      .select('*')
      .eq('ativo', true)
      .gt('saldo', 0)
      .order('nome', { ascending: true });

    if (error) {
      showToast(parseErrorMessage(error), 'error');
      selectMaterial.innerHTML = '<option value="">Erro ao carregar materiais</option>';
      return;
    }

    if (!data || data.length === 0) {
      selectMaterial.innerHTML = '<option value="">Nenhum material com saldo disponível</option>';
      return;
    }

    selectMaterial.innerHTML = '<option value="">-- Selecione um material --</option>' +
      data.map(m => {
        materiaisMap[m.id] = m;
        return `<option value="${m.id}">${m.nome} (${m.saldo} ${m.unidade} em estoque)</option>`;
      }).join('');
  }

  selectMaterial.addEventListener('change', (e) => {
    const selectedId = e.target.value;
    if (!selectedId || !materiaisMap[selectedId]) {
      groupSaldo.style.display = 'none';
      inputQuantidade.disabled = true;
      inputQuantidade.value = '';
      btnEnviar.disabled = true;
      return;
    }

    const mat = materiaisMap[selectedId];
    spanSaldo.innerText = mat.saldo;
    spanUnidade.innerText = mat.unidade;
    groupSaldo.style.display = 'flex';

    inputQuantidade.disabled = false;
    inputQuantidade.max = mat.saldo;
    inputQuantidade.value = '1';
    btnEnviar.disabled = false;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const materialId = selectMaterial.value;
    const quantidade = parseInt(inputQuantidade.value);
    const justificativa = document.getElementById('justificativa').value.trim();

    if (!materialId || !materiaisMap[materialId]) {
      showToast('Selecione um material válido.', 'error');
      return;
    }

    const mat = materiaisMap[materialId];
    if (quantidade < 1 || quantidade > mat.saldo) {
      showToast(`A quantidade deve ser entre 1 e ${mat.saldo}.`, 'error');
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.innerText = 'Enviando...';

    const { data, error } = await supabase
      .from('requisicoes')
      .insert([{
        material_id: materialId,
        solicitante_id: session.user.id,
        quantidade: quantidade,
        justificativa: justificativa || null,
        status: 'pendente'
      }]);

    if (error) {
      showToast(parseErrorMessage(error), 'error');
      btnEnviar.disabled = false;
      btnEnviar.innerText = 'Enviar Requisição';
    } else {
      showToast('Requisição criada com sucesso!', 'success');
      setTimeout(() => {
        window.location.href = 'painel.html';
      }, 600);
    }
  });

  loadMateriaisDisponiveis();
});
