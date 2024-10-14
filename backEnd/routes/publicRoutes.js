import express from 'express';
import UsuariosControler from '../controller/usuariosControler.js';
import CandidatosControler from '../controller/candidatosControler.js';
import VagasControler from '../controller/vagasControler.js';


const router = express.Router();
const usuariosControler = new UsuariosControler();
const candidatosControler = new CandidatosControler();;
const vagasControler = new VagasControler();

// Rota de cadastro de usuário para gerenciamento
router.post('/cadastro', usuariosControler.adicionarUsuario.bind(usuariosControler));

// Rota de login com autenticação para gerenciamento
router.post('/login', usuariosControler.logarUsuario.bind(usuariosControler));

// Rota para cadastro de candidato para poder se candidatar a uma vaga
router.post('/candidatoCadastro', candidatosControler.adicionarCandidato.bind(candidatosControler));

//rota para obter todas as vagas
router.get('/vagas', vagasControler.obterTodasVagas.bind(vagasControler));

export default router;
