/**
 * Representa as unidades do buffet disponíveis.
 */
export type UnidadeGaleria = "sao-miguel" | "vila-americana";

/**
 * Definição da estrutura de dados de uma foto na galeria vinda do MySQL.
 */
export interface GaleriaItem {
  id?: string | number;
  imagem: string; // Nome do arquivo no servidor PHP
  legenda: string;
  unidade: UnidadeGaleria;
  ordem: number;
  data_criacao?: string; // String de data do MySQL
  url?: string; // URL completa (calculada no serviço)
}
