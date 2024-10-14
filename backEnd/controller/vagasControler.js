import { validationResult } from 'express-validator';
import VagasModel from '../model/entities/vagasModels.js';

const vagasModel = new VagasModel();

class VagasController {
    async adicionarVaga(req, res) {
        const errors = validationResult(req);
        const { cargo, salario, cidade, quantidade } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const result = await vagasModel.adicionarVaga({
                cargo,
                salario,
                cidade,
                quantidade
            });
            return res.status(201).json(result);
        } catch (error) {
            console.error('Erro ao adicionar vaga', error);
            res.status(500).json({ error: 'Erro ao adicionar vaga' });
        }
    }

    async editarVaga(req, res) {
        const errors = validationResult(req);
        const { vaga_codigo } = req.params;
        const { cargo, salario, cidade, quantidade } = req.body;

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const result = await vagasModel.editarVaga(vaga_codigo, {
                cargo,
                salario,
                cidade,
                quantidade
            });
            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao editar vaga', error);
            res.status(500).json({ error: 'Erro ao editar vaga' });
        }
    }

    async excluirVaga(req, res) {
        const { vaga_codigo } = req.params;

        try {
            const result = await vagasModel.excluirVaga(vaga_codigo);
            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ error: 'Vaga não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao excluir vaga', error);
            res.status(500).json({ error: 'Erro ao excluir vaga' });
        }
    }

    async obterTodasVagas(req, res) {
        try {
            const vagas = await vagasModel.obterTodasVagas();
            return res.status(200).json(vagas);
        } catch (error) {
            console.error('Erro ao obter vagas', error);
            return res.status(500).json({ error: 'Erro ao obter vagas' });
        }
    }
}

export default VagasController;
