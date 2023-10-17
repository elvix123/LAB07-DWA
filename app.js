// app.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Configurar Express para servir archivos estáticos
app.use(express.static(__dirname));


// Conectar a la base de datos
mongoose.connect('mongodb://0.0.0.0/peliculas_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected!');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Definir el modelo de película
const peliculaSchema = new mongoose.Schema({
  titulo: String,
  director: String,
  año: Number,
  
});
const Pelicula = mongoose.model('Pelicula', peliculaSchema, 'Peliculas');

// Configurar la aplicación para usar JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  

// Ruta para agregar una película
app.post('/agregar-pelicula', async (req, res) => {
  const { titulo, director, año } = req.body;
  const pelicula = new Pelicula({ titulo, director, año });

  try {
    await pelicula.save();
    res.status(201).json(pelicula);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar la película' });
  }
});

// Ruta para mostrar todas las películas
app.get('/peliculas', async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ error: 'Error al recuperar las películas' });
  }
});

app.get('/cards', (req, res) => {
    res.sendFile(__dirname + '/cards.html');
  });

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
