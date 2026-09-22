/**
 * Exibe notificação no canto superior direito
 */
export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

/**
 * Formata data no padrão brasileiro
 */
export function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Retorna o HTML de um badge de status
 */
export function renderStatusBadge(status) {
  const s = (status || '').toLowerCase();
  let label = status;
  let bgClass = 'status-badge';

  switch (s) {
    case 'pendente':
      label = 'Pendente';
      bgClass += ' status-pendente';
      break;
    case 'aprovada':
      label = 'Aprovada';
      bgClass += ' status-aprovada';
      break;
    case 'entregue':
      label = 'Entregue';
      bgClass += ' status-entregue';
      break;
    case 'recusada':
      label = 'Recusada';
      bgClass += ' status-recusada';
      break;
    default:
      bgClass += ' status-default';
  }

  return `<span class="${bgClass}">${label}</span>`;
}

/**
 * Traduz erros comuns do Supabase/Postgres para PT-BR
 */
export function parseErrorMessage(error) {
  if (!error) return 'Ocorreu um erro desconhecido.';
  const msg = error.message || String(error);

  if (msg.includes('Invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (msg.includes('Saldo insuficiente')) {
    return 'Erro: Saldo insuficiente em estoque.';
  }
  if (msg.includes('Só é possível entregar requisições aprovadas')) {
    return 'Apenas requisições com status "Aprovada" podem ser entregues.';
  }
  if (msg.includes('duplicate key value violates unique constraint')) {
    return 'Já existe um registro com este nome cadastrado.';
  }

  return msg;
}
