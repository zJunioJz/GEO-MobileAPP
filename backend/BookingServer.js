// Importando as bibliotecas necessárias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

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
  

// Rota para criar uma nova aula
app.post('/create-booking', async (req, res) => {
    const { modalidade, professor, maxAlunos, date, start_time, end_time } = req.body;
  
    // Validação básica dos dados recebidos
    if (!modalidade || !professor || !maxAlunos || !date || !start_time || !end_time) {
      return res.status(400).json({ error: 'Todos os campos devem ser preenchidos.' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO bookings (modalidade, professor, max_alunos, date, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [modalidade, professor, maxAlunos, date, start_time, end_time]
      );
  
      const newBooking = result.rows[0];
  
      res.status(201).json({ message: 'Aula criada com sucesso!', booking: newBooking });
    } catch (error) {
      console.error('Erro ao criar a aula:', error);
      res.status(500).json({ error: 'Não foi possível criar a aula.' });
    }
  });

  app.get('/all-classes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bookings');
        const classes = result.rows;
        res.status(200).json(classes);
    } catch (error) {
        console.error('Erro ao buscar as turmas:', error);
        res.status(500).json({ error: 'Não foi possível buscar as turmas.' });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
