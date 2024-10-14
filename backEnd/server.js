import express from 'express';
import publicRoutes from './routes/publicRoutes.js';
import privateRoutesVagas from './routes/privateRoutes/gerenciarVagas.js';
import privateRoutesCandidatos from './routes/privateRoutes/gerenciarCandidatos.js';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

import { verifyToken } from './middleware/verifyToken.js';
dotenv.config();

const app = express();
const port = 3001;

app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// Rotas
app.use(publicRoutes);
app.use(verifyToken, privateRoutesVagas);
app.use(verifyToken, privateRoutesCandidatos);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

