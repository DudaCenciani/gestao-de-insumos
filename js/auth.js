import { supabase } from './supabase.js';

/**
 * Retorna o perfil do usuário atual ('admin' ou 'solicitante')
 */
export async function getPerfil() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user.user_metadata?.perfil || 'solicitante';
}

/**
 * Retorna se o usuário atual é admin
 */
export async function isAdmin() {
  const perfil = await getPerfil();
  return perfil === 'admin';
}

/**
 * Guard de autenticação: redireciona para index.html se não estiver logado.
 * Retorna a sessão em caso de sucesso.
 */
export async function requireAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  return session;
}

/**
 * Guard de admin: redireciona para painel.html se não for admin.
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (!session) return null;

  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) {
    window.location.href = 'painel.html';
    return null;
  }
  return session;
}

/**
 * Realiza logout do usuário e redireciona para o login
 */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}
