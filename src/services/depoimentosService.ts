/**
 * Serviço responsável pelo CRUD de depoimentos utilizando o backend PHP + MySQL.
 */
import { DepoimentoItem } from "../types/depoimentos";
import { API_DEPOIMENTOS, UPLOADS_DEPOIMENTOS_URL } from "../config/api";

export const depoimentosService = {
  /**
   * Lista todos os depoimentos do servidor PHP.
   */
  async listarDepoimentos(): Promise<DepoimentoItem[]> {
    try {
      const response = await fetch(API_DEPOIMENTOS.LISTAR);
      if (!response.ok) throw new Error("Erro de conexão.");
      
      const data = await response.json();
      if (!data.sucesso) throw new Error(data.mensagem);
      
      // Adicionar URL completa da foto
      return data.dados.map((item: any) => ({
        ...item,
        url_foto: item.foto ? `${UPLOADS_DEPOIMENTOS_URL}/${item.foto}` : null
      }));
    } catch (error) {
      console.error("Erro ao listar depoimentos:", error);
      throw error;
    }
  },

  /**
   * Adiciona um novo depoimento (com foto opcional).
   */
  async adicionarDepoimento(
    dados: Omit<DepoimentoItem, "id" | "foto" | "data_criacao" | "url_foto">,
    arquivoFoto?: File
  ): Promise<void> {
    const formData = new FormData();
    formData.append("nome", dados.nome);
    formData.append("texto", dados.texto);
    formData.append("nota", String(dados.nota));
    formData.append("ordem", String(dados.ordem));
    
    if (arquivoFoto) {
      formData.append("foto", arquivoFoto);
    }

    const response = await fetch(API_DEPOIMENTOS.SALVAR, {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Erro de conexão ao salvar.");
    const data = await response.json();
    if (!data.sucesso) throw new Error(data.mensagem);
  },

  /**
   * Atualiza um depoimento existente.
   */
  async atualizarDepoimento(
    id: string | number,
    dados: Partial<DepoimentoItem>,
    arquivoFoto?: File
  ): Promise<void> {
    const formData = new FormData();
    formData.append("id", String(id));
    if (dados.nome) formData.append("nome", dados.nome);
    if (dados.texto) formData.append("texto", dados.texto);
    if (dados.nota) formData.append("nota", String(dados.nota));
    if (dados.ordem !== undefined) formData.append("ordem", String(dados.ordem));
    
    if (arquivoFoto) {
      formData.append("foto", arquivoFoto);
    }

    const response = await fetch(API_DEPOIMENTOS.EDITAR, {
      method: "POST", // Usamos POST para suportar multipart com FormData no PHP de forma simples
      body: formData
    });

    if (!response.ok) throw new Error("Erro de conexão ao editar.");
    const data = await response.json();
    if (!data.sucesso) throw new Error(data.mensagem);
  },

  /**
   * Exclui um depoimento.
   */
  async excluirDepoimento(id: string | number): Promise<void> {
    const response = await fetch(API_DEPOIMENTOS.EXCLUIR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (!response.ok) throw new Error("Erro de conexão ao excluir.");
    const data = await response.json();
    if (!data.sucesso) throw new Error(data.mensagem);
  }
};
