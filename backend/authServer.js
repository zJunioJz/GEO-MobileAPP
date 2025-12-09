require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao PostgreSQL', err.stack);
  }
  console.log('Conectado ao PostgreSQL!');
  release();
});

// Middleware para autenticar o token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Extrai o token do cabeçalho

  if (!token) return res.sendStatus(401); 

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); 
    req.user = user; // Salva os dados do usuário no objeto de requisição
    next();
  });
}

// Rota para acessar um usuário
app.get('/user', authenticateToken, async (req, res) => {
  const userId = req.user.id; 
  const query = 'SELECT * FROM users WHERE id = $1';

  try {
    const userResult = await pool.query(query, [userId]);

    if (userResult.rows.length > 0) {
      res.json(userResult.rows[0]); // Retorna os dados do usuário
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error(error);
    console.error('Erro ao buscar dados do usuário:', error);
    res.sendStatus(500); 
  }
});

// Rota para verificar se o token é válido
app.get('/verify-token', authenticateToken, (req, res) => {
  res.sendStatus(200);
});

// Rota para login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login realizado com sucesso!', token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// Rota para atualizar um usuário
app.put('/update-user', authenticateToken, async (req, res) => {
  const userId = req.user.id; 
  const updates = req.body; 

  
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  
  const setQuery = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

  const query = `UPDATE users SET ${setQuery} WHERE id = $${fields.length + 1} RETURNING *`;

  try {
    const updatedUserResult = await pool.query(query, [...values, userId]);

    if (updatedUserResult.rows.length > 0) {
      res.json(updatedUserResult.rows[0]); 
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar dados do usuário:', error);
    res.sendStatus(500); 
  }
});

app.put('/update-password', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body; // Recebe a senha antiga e a nova senha

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'As senhas devem ser fornecidas.' });
  }

  try {
    
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const user = userResult.rows[0];

    // Verifica se a senha antiga está correta
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'A senha antiga está incorreta.' });
    }

    // Criptografa a nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha no banco de dados
    const updatePasswordQuery = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING *';
    const updatedUserResult = await pool.query(updatePasswordQuery, [hashedPassword, userId]);

    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar a senha:', error);
    res.status(500).json({ error: 'Erro ao atualizar a senha.' });
  }
});




// Rota para registrar um usuário
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
      const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
      const emailCheckResult = await pool.query(emailCheckQuery, [email]);

      if (emailCheckResult.rows.length > 0) {
          return res.status(400).json({ error: 'Este E-mail já está em uso. Tente outro.' });
      }

      const hash = await bcrypt.hash(password, 10);

     
      const atribuicaoIdDefault = 1; 

      const sql = 'INSERT INTO users (username, email, password, atribuicao_id) VALUES ($1, $2, $3, $4) RETURNING id';
      const result = await pool.query(sql, [username, email, hash, atribuicaoIdDefault]);

      // Geração do token
      const token = jwt.sign(
          { id: result.rows[0].id, email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      // Retorne a mensagem e o token
      res.json({ message: 'Usuário registrado com sucesso!', token }); 
  } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
  }
});



// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
