/**
 * Serviço responsável pela autenticação do administrador no backend PHP.
 */
import { API_AUTH } from "../config/api";

export interface UsuarioLogado {
  id: string | number;
  nome: string;
  email: string;
}

export const authService = {
  /**
   * Realiza o login enviando email e senha.
   * Importante: Usamos credentials: 'include' para lidar com cookies/sessões cross-origin.
   */
  async login(email: string, senha: string): Promise<UsuarioLogado> {
    const response = await fetch(API_AUTH.LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
      // Importante para persistir o cookie da sessão PHP
      credentials: "include"
    });

    if (!response.ok) throw new Error("Erro de rede ao tentar logar.");
    
    const data = await response.json();
    if (!data.sucesso) throw new Error(data.mensagem);
    
    return data.dados;
  },

  /**
   * Encerra a sessão no servidor.
   */
  async logout(): Promise<void> {
    const response = await fetch(API_AUTH.LOGOUT, {
      method: "POST",
      credentials: "include"
    });

    if (!response.ok) throw new Error("Erro de rede ao tentar sair.");
    
    const data = await response.json();
    if (!data.sucesso) throw new Error(data.mensagem);
  },

  /**
   * Verifica se existe uma sessão ativa no servidor.
   */
  async verificarAuth(): Promise<UsuarioLogado | null> {
    try {
      const response = await fetch(API_AUTH.VERIFICAR, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) return null;
      
      const data = await response.json();
      if (!data.sucesso) return null;
      
      return data.dados;
    } catch (error) {
      console.error("Erro na verificação de auth:", error);
      return null;
    }
  }
};
