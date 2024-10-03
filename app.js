const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,  // Asegúrate de que la clave está correctamente asignada
});

const openai = new OpenAIApi(configuration);

const express = require('express');
const app = express();
app.use(express.json());

// Listar archivos
app.get('/files', async (req, res) => {
  try {
    const response = await openai.listFiles();
    const files = response.data.data.map(file => ({
      id: file.id,
      filename: file.filename,
    }));
    res.json(files);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error al listar archivos' });
  }
});

// Eliminar archivo
app.delete('/files/:id', async (req, res) => {
  const fileId = req.params.id;
  try {
    await openai.deleteFile(fileId);
    res.json({ message: `Archivo con ID ${fileId} eliminado correctamente` });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error al eliminar el archivo' });
  }
});

// definimos puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
