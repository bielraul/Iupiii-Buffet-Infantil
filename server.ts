import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'db.json');

// Inicializa banco de dados mock se não existir
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({
    galeria: [],
    depoimentos: [],
    usuarios: [{
      id: 1,
      email: 'admin@iupiii.com',
      senha: '$2y$10$8wG3J7z8XQ/hU/U6OQ/8.uXkX7WvFv/XG7vR1v8f1v8f1v8f1v8f1', // Mock hash para '123456'
      nome: 'Administrador'
    }]
  }, null, 2));
}

function getDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveDb(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Middleware para simular atraso e logging
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });

  // API Mock - Autenticação
  app.post('/api/auth/login.php', (req, res) => {
    const { email, senha } = req.body;
    const db = getDb();
    const user = db.usuarios.find((u: any) => u.email === email);
    
    // Simulação simples de senha (em produção usaria password-hash)
    if (user && (senha === '123456' || email === 'admin@iupiii.com')) {
      res.json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso',
        usuario: { id: user.id, nome: user.nome, email: user.email }
      });
    } else {
      res.status(401).json({ sucesso: false, mensagem: 'E-mail ou senha incorretos' });
    }
  });

  app.get('/api/auth/verificar.php', (req, res) => {
    // No preview, vamos manter logado para facilitar o teste
    res.json({
      autenticado: true,
      usuario: { id: 1, nome: 'Administrador Iupiii', email: 'admin@iupiii.com' }
    });
  });

  app.post('/api/auth/logout.php', (req, res) => {
    res.json({ sucesso: true, mensagem: 'Sessão encerrada' });
  });

  // API Mock - Galeria
  app.get('/api/galeria/listar.php', (req, res) => {
    const db = getDb();
    res.json(db.galeria);
  });

  app.post('/api/galeria/salvar.php', (req, res) => {
    const db = getDb();
    const novoItem = {
      id: Date.now().toString(),
      ...req.body,
      dataCriacao: new Date().toISOString()
    };
    db.galeria.push(novoItem);
    saveDb(db);
    res.json({ sucesso: true, mensagem: 'Foto salva com sucesso!', id: novoItem.id });
  });

  // API Mock - Depoimentos
  app.get('/api/depoimentos/listar.php', (req, res) => {
    const db = getDb();
    res.json(db.depoimentos);
  });

  app.post('/api/depoimentos/salvar.php', (req, res) => {
    const db = getDb();
    const novoItem = {
      id: Date.now().toString(),
      ...req.body,
      data_criacao: new Date().toISOString()
    };
    db.depoimentos.push(novoItem);
    saveDb(db);
    res.json({ sucesso: true, mensagem: 'Depoimento enviado!', id: novoItem.id });
  });

  // Simulação de pasta de uploads (vazio para o preview)
  app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

  // Configuração do Vite
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
