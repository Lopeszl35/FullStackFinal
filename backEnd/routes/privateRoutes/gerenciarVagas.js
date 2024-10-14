import express from 'express';
import VagasControler from '../../controller/vagasControler.js';

const router = express.Router();
const vagasControler = new VagasControler();

//rota para adicionar vaga
router.post('/vagas', vagasControler.adicionarVaga.bind(vagasControler));

//rota para editar vaga
router.put('/vagas/:vaga_codigo', vagasControler.editarVaga.bind(vagasControler));

//rota para excluir vaga
router.delete('/vagas/:vaga_codigo', vagasControler.excluirVaga.bind(vagasControler));







export default router