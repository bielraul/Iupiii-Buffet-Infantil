/**
 * Tipagem para os itens de depoimentos do sistema.
 */
export interface DepoimentoItem {
  id?: string | number;
  nome: string;
  texto: string;
  nota: number;
  foto?: string | null;
  ordem: number;
  data_criacao?: string;
  url_foto?: string; // URL completa para exibição no front
}
