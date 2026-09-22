import { supabase } from './supabase.js';
import { showToast, parseErrorMessage } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Se já houver sessão ativa, redireciona direto para o painel
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.href = 'painel.html';
    return;
  }

  const form = document.getElementById('login-form');
  const btnSubmit = document.getElementById('btn-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showToast('Preencha e-mail e senha.', 'error');
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerText = 'Entrando...';

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      showToast(parseErrorMessage(error), 'error');
      btnSubmit.disabled = false;
      btnSubmit.innerText = 'Entrar';
      return;
    }

    showToast('Login realizado com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'painel.html';
    }, 500);
  });
});
