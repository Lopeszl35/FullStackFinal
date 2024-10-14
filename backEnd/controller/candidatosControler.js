import { validationResult } from 'express-validator';
import CandidatosModel from '../model/entities/candidatosModel.js';

const candidatosModel = new CandidatosModel();

class CandidatosController {
    // Adicionar candidato
    async adicionarCandidato(req, res) {
        const errors = validationResult(req);
        console.log('Validação de erros:', JSON.stringify(errors));
        const { cpf, nome, endereco, telefone } = req.body;
        
        if (!errors.isEmpty()) {
            console.log('Erro na validação ao adicionar candidato:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            console.log('Tentando adicionar candidato:', req.body);
            const result = await candidatosModel.adicionarCandidato({
                cpf,
                nome,
                endereco,
                telefone
            });
            console.log('Resultado ao adicionar candidato:', result);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Erro ao adicionar candidato:', error);
            res.status(500).json({ error: 'Erro ao adicionar candidato' });
        }
    }

    async candidatarVaga(req, res) {
        const { cpf, vagaCodigo } = req.body;

        try {
            console.log('Tentando candidatar CPF:', cpf, 'para a vaga:', vagaCodigo);
            const result = await candidatosModel.candidatarVaga(cpf, vagaCodigo);
            console.log('Resultado ao candidatar-se à vaga:', result);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Erro ao candidatar-se à vaga:', error);
            return res.status(500).json({ error: 'Erro ao candidatar-se à vaga' });
        }
    }

    // Obter todos os candidatos
    async obterTodosCandidatos(req, res) {
        try {
            console.log('Tentando obter todos os candidatos');
            const candidatos = await candidatosModel.obterTodosCandidatos();
            console.log('Resultado ao obter todos os candidatos:', candidatos);
            return res.status(200).json(candidatos);
        } catch (error) {
            console.error('Erro ao obter candidatos:', error);
            return res.status(500).json({ error: 'Erro ao obter candidatos' });
        }
    }

    /* Editar candidato
    async editarCandidato(req, res) {
        const errors = validationResult(req);
        const { cpf } = req.params;
        const { nome, endereco, telefone } = req.body;

        console.log('Validação de erros para edição:', JSON.stringify(errors));

        if (!errors.isEmpty()) {
            console.log('Erro na validação ao editar candidato:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            console.log('Tentando editar candidato com CPF:', cpf, 'com dados:', req.body);
            const result = await candidatosModel.editarCandidato(cpf, {
                nome,
                endereco,
                telefone
            });
            console.log('Resultado ao editar candidato:', result);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Erro ao editar candidato:', error);
            res.status(500).json({ error: 'Erro ao editar candidato' });
        }
    }*/

    async excluirCandidato(req, res) {
        const { cpf } = req.params;

        try {
            console.log('Tentando excluir candidato com CPF:', cpf);
            const result = await candidatosModel.excluirCandidato(cpf);
            console.log('Resultado ao excluir candidato:', result);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json({ error: 'Candidato não encontrado' });
            }
        } catch (error) {
            console.error('Erro ao excluir candidato:', error);
            res.status(500).json({ error: 'Erro ao excluir candidato' });
        }
    }
}

export default CandidatosController;
