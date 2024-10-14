import express from 'express';
import CandidatosControler from '../../controller/candidatosControler.js';

const router = express.Router();
const candidatosControler = new CandidatosControler();

//rota para obter todos os candidatos
router.get('/candidatos', candidatosControler.obterTodosCandidatos.bind(candidatosControler));

//rota para excluir candidato
router.delete('/candidatos/:cpf', candidatosControler.excluirCandidato.bind(candidatosControler));





export default router;