import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

for (const envPath of [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '.env'),
]) {
    if (typeof process.loadEnvFile === 'function' && fs.existsSync(envPath)) {
        process.loadEnvFile(envPath);
        break;
    }
}

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const PORT = Number(process.env.PORT) || 3000;
const DATABASE_FILE = process.env.DATABASE_FILE || './leads.db';
const RELATORIO_SENHA = process.env.SENHA_RELATORIO;

// Colunas do schema atual: o formulário do totem grava nome, telefone e e-mail.
const EXPECTED_COLUMNS = ['id', 'name', 'telefone', 'email', 'created_at'];

let db;

const CREATE_LEADS = (tabela) => `
  CREATE TABLE IF NOT EXISTS ${tabela}(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    telefone TEXT,
    email TEXT,
    created_at DATETIME
  )
`;

function getBrazilDateTime() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return formatter.format(now).replace(' ', ' ');
}

async function setupDB() {
  db = await open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database
  });

  await db.exec(CREATE_LEADS('leads'));

  // Schema antigo: recria a tabela no formato novo e copia o que der, em vez
  // de dropar — as colunas que faltavam entram como NULL.
  const columns = await db.all('PRAGMA table_info(leads)');
  const current = columns.map((column) => column.name).sort().join(',');

  if (current !== [...EXPECTED_COLUMNS].sort().join(',')) {
    console.log('Schema antigo detectado. Migrando a tabela leads...');

    const mantidas = EXPECTED_COLUMNS.filter((coluna) =>
      columns.some((column) => column.name === coluna)
    );

    await db.exec('BEGIN');
    try {
      await db.exec(CREATE_LEADS('leads_novo'));
      await db.exec(
        `INSERT INTO leads_novo (${mantidas.join(', ')}) SELECT ${mantidas.join(', ')} FROM leads`
      );
      await db.exec('DROP TABLE leads');
      await db.exec('ALTER TABLE leads_novo RENAME TO leads');
      await db.exec('COMMIT');
    } catch (error) {
      await db.exec('ROLLBACK');
      throw error;
    }
  }
}

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/auth', (request, response) => {
  const { password } = request.body;
  if (!password) {
    return response.status(400).json({ message: 'Senha não informada.' });
  }
  if (password !== RELATORIO_SENHA) {
    return response.status(401).json({ message: 'Senha incorreta.' });
  }
  return response.json({ message: 'Autenticado com sucesso.' });
});

app.get('/leads', async (request, response) => {
  const { startDate, endDate } = request.query;

  let query = 'SELECT id, name, telefone, email, created_at FROM leads';
  const params = [];

  if (startDate && endDate) {
    query += ' WHERE created_at BETWEEN ? AND ?';
    params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const leads = await db.all(query, params);
    response.json(leads);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

app.post('/leads', async (request, response) => {
    const { name, nome, telefone, celular, email } = request.body;

    const cleanName = String(nome ?? name ?? '').trim();
    const telefoneDigits = onlyDigits(telefone ?? celular);
    const cleanEmail = String(email || '').trim().toLowerCase();

    if (cleanName.length < 3) {
      return response.status(400).json({ message: 'Informe seu nome completo.' });
    }

    if (telefoneDigits.length < 10) {
      return response.status(400).json({ message: 'Informe um celular válido com DDD.' });
    }

    if (!EMAIL_RE.test(cleanEmail)) {
      return response.status(400).json({ message: 'Informe um e-mail válido.' });
    }

    const created_at = getBrazilDateTime();

    try {
      const { lastID } = await db.run(
        'INSERT INTO leads (name, telefone, email, created_at) VALUES (?, ?, ?, ?)',
        [cleanName, telefoneDigits, cleanEmail, created_at]
      );

      response.json({ message: 'Cadastrado com sucesso!', id: lastID });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Erro ao cadastrar.' });
    }
});

await setupDB();

app.listen(PORT, () => {
  console.log(`Api rodando...`);
});
