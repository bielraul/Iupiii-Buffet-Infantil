/**
 * Configurações globais da API para o frontend.
 */

// Detecta se estamos rodando no ambiente de preview ou localmente
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const isAISPreview = window.location.hostname.includes("run.app") || window.location.hostname.includes("ais-dev");

// Se estiver no preview do AIS, usamos caminhos relativos para o servidor integrado
// Se estiver no localhost, o usuário provavelmente está testando com o XAMPP
export const BACKEND_URL = (isLocalhost && !isAISPreview) 
  ? "http://localhost/iupiii-backend" 
  : ""; // Vazio para usar caminhos relativos ao domínio atual

// Endpoints da Galeria
export const API_GALERIA = {
  LISTAR: `${BACKEND_URL}/api/galeria/listar.php`,
  SALVAR: `${BACKEND_URL}/api/galeria/salvar.php`,
  EDITAR: `${BACKEND_URL}/api/galeria/editar.php`,
  EXCLUIR: `${BACKEND_URL}/api/galeria/excluir.php`,
};

// Endpoints de Depoimentos
export const API_DEPOIMENTOS = {
  LISTAR: `${BACKEND_URL}/api/depoimentos/listar.php`,
  SALVAR: `${BACKEND_URL}/api/depoimentos/salvar.php`,
  EDITAR: `${BACKEND_URL}/api/depoimentos/editar.php`,
  EXCLUIR: `${BACKEND_URL}/api/depoimentos/excluir.php`,
};

// Endpoints de Autenticação
export const API_AUTH = {
  LOGIN: `${BACKEND_URL}/api/auth/login.php`,
  LOGOUT: `${BACKEND_URL}/api/auth/logout.php`,
  VERIFICAR: `${BACKEND_URL}/api/auth/verificar.php`,
};

// Caminho para a pasta de uploads
export const UPLOADS_URL = `${BACKEND_URL}/uploads/galeria`;
export const UPLOADS_DEPOIMENTOS_URL = `${BACKEND_URL}/uploads/depoimentos`;
