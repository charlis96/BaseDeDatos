import express from 'express';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import verificarToken from './middlewares/authMiddleware.js';
import errorHandler from './middlewares/errorMiddleware.js';
import agenda from './routes/agendaRoutes.js';

const app = express();
app.use(express.json());

// Rutas públicas que no requieren autenticación
app.use('/api/auth', authRoutes);

// Middleware que verifica el token para todas las rutas siguientes
app.use(verificarToken);

// Rutas protegidas que requieren autenticación
app.use('/api/agenda', agenda);

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
