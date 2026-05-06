/**
 * Serviço responsável pelo CRUD da galeria utilizando o backend PHP + MySQL.
 */
import { GaleriaItem } from "../types/galeria";
import { API_GALERIA, UPLOADS_URL } from "../config/api";

export const galeriaService = {
  /**
   * Lista todas as fotos buscando do servidor PHP.
   */
  async listarFotosGaleria(): Promise<GaleriaItem[]> {
    try {
      const response = await fetch(API_GALERIA.LISTAR);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.sucesso) {
        throw new Error(data.mensagem || "Erro desconhecido ao carregar galeria.");
      }
      
      // Adicionar URL completa para cada imagem
      return data.dados.map((item: GaleriaItem) => ({
        ...item,
        url: `${UPLOADS_URL}/${item.imagem}`
      }));
    } catch (error) {
      console.error("Erro ao listar fotos:", error);
      throw error; // Repassamos o erro para ser tratado no componente
    }
  },

  /**
   * Adiciona uma nova foto enviando multipart/form-data para o PHP.
   */
  async adicionarFotoGaleria(
    arquivo: File, 
    dados: Omit<GaleriaItem, "id" | "imagem" | "data_criacao" | "url">
  ): Promise<void> {
    const formData = new FormData();
    formData.append("imagem", arquivo);
    formData.append("legenda", dados.legenda);
    formData.append("unidade", dados.unidade);
    formData.append("ordem", String(dados.ordem));

    const response = await fetch(API_GALERIA.SALVAR, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erro na comunicação com o servidor.");
    }

    const data = await response.json();
    if (!data.sucesso) throw new Error(data.mensagem);
  },

  /**
   * Atualiza os metadados de uma foto via JSON para o PHP.
   */
  async atualizarFotoGaleria(id: string | number, dados: Partial<GaleriaItem>): Promise<void> {
    const response = await fetch(API_GALERIA.EDITAR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...dados })
    });

    if (!response.ok) {
      throw new Error("Erro ao salvar alterações no servidor.");
    }

    const data = await response.json();
    if (!data.sucesso) throw new Error(data.mensagem);
  },

  /**
   * Remove uma foto do servidor e do banco.
   */
  async excluirFotoGaleria(item: GaleriaItem): Promise<void> {
    if (!item.id) return;

    const response = await fetch(API_GALERIA.EXCLUIR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id })
    });

    if (!response.ok) {
      throw new Error("Erro ao remover foto do servidor.");
    }

    const data = await response.json();
    if (!data.sucesso) throw new Error(data.mensagem);
  }
};
