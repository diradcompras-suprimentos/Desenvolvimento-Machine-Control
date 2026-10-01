const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// S3 configuration
const s3Configured =
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_S3_BUCKET &&
  process.env.AWS_S3_REGION;

let s3Client = null;
if (s3Configured) {
  s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({ uploadEnabled: !!s3Configured });
});

// CRUD: List all
app.get('/api/equipamentos', (req, res) => {
  const rows = db.prepare('SELECT * FROM equipamentos ORDER BY id DESC').all();
  res.json(rows);
});

// CRUD: Get by ID
app.get('/api/equipamentos/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Equipamento não encontrado' });
  res.json(row);
});

// CRUD: Create
app.post('/api/equipamentos', (req, res) => {
  const { nome, marca, modelo, serie, local, status, imagem_url } = req.body;
  const data_cadastro = new Date().toLocaleDateString('pt-BR');
  const result = db.prepare(
    'INSERT INTO equipamentos (nome, marca, modelo, serie, local, status, imagem_url, data_cadastro) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(nome, marca || '', modelo || '', serie || '', local, status || 'Ativo', imagem_url || null, data_cadastro);
  const newRow = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newRow);
});

// CRUD: Update
app.put('/api/equipamentos/:id', (req, res) => {
  const { nome, marca, modelo, serie, local, status, imagem_url } = req.body;
  const row = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Equipamento não encontrado' });
  db.prepare(
    'UPDATE equipamentos SET nome = ?, marca = ?, modelo = ?, serie = ?, local = ?, status = ?, imagem_url = ? WHERE id = ?'
  ).run(
    nome ?? row.nome,
    marca ?? row.marca,
    modelo ?? row.modelo,
    serie ?? row.serie,
    local ?? row.local,
    status ?? row.status,
    imagem_url ?? row.imagem_url,
    req.params.id
  );
  const updated = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// CRUD: Delete
app.delete('/api/equipamentos/:id', (req, res) => {
  const result = db.prepare('DELETE FROM equipamentos WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Equipamento não encontrado' });
  res.status(204).send();
});

// Image upload to S3
app.post('/api/upload', upload.single('imagem'), async (req, res) => {
  if (!s3Configured) {
    return res.status(503).json({ error: 'Upload de imagens não configurado. Configure as credenciais AWS S3.' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }
  try {
    const key = `equipamentos/${Date.now()}-${req.file.originalname}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
    res.json({ url });
  } catch (err) {
    console.error('S3 upload error:', err);
    res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
  if (!s3Configured) {
    console.log('AVISO: Upload de imagens desabilitado. Configure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET e AWS_S3_REGION.');
  }
});
