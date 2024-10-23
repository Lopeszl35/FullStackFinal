import { validationResult } from 'express-validator';
import CandidatosModel from '../model/entities/candidatosModel.js';
import Database from '../model/dataBase.js';

const database = new Database();
const candidatosModel = new CandidatosModel();

class CandidatosController {
    /*
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
    } */

    async candidatarVaga(req, res) {
        const errors = validationResult(req);
        console.log('Validação de erros:', JSON.stringify(errors));
        console.log('Body:', req.body);
        const { candidatado, vagaCodigo } = req.body;
        const { cand_cpf, cand_nome, cand_endereco, cand_telefone } = candidatado;
        
        if (!errors.isEmpty()) {
            console.log('Erro na validação ao adicionar candidato:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        if (!cand_cpf || !cand_nome || !cand_endereco || !cand_telefone || !vagaCodigo) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        let connection = await database.beginTransaction();
        try {
            //Inicio tentando cadastrar candidato
            const candidato = {
                cand_cpf,
                cand_nome,
                cand_endereco,
                cand_telefone
            };
            console.log('Tentando adicionar candidato:', candidato);
            const adicionandoCandidato = await candidatosModel.adicionarCandidato(candidato, connection);
            if( !adicionandoCandidato.success ) {
                await database.rollbackTransaction(connection);
                return res.status(400).json({ error: adicionandoCandidato.message });
            }
            console.log('Resultado ao adicionar candidato:', adicionandoCandidato);
            //Fim tentando cadastrar candidato

            // Inicio tentando candidatar-se à vaga
            console.log('Tentando candidatar CPF:', cand_cpf, 'para a vaga:', vagaCodigo);
            const candidatandoVaga = await candidatosModel.candidatarVaga(cand_cpf, vagaCodigo, connection);
            if( !candidatandoVaga.success ) {
                await database.rollbackTransaction(connection);
                return res.status(400).json({ error: candidatandoVaga.message });
            }
            console.log(`Candidadato ${cand_nome} candidatado com sucesso a vaga ${vagaCodigo}!`);
            // Fim tentando candidatar-se à vaga

            const result = {
                adicionandoCandidato,
                candidatandoVaga
            };
            console.log('Result:', result);
            await database.commitTransaction(connection);
            return res.status(201).json(result);
        } catch (error) {
            console.error('Erro ao candidatar-se à vaga:', error);
            await database.rollbackTransaction(connection);
            return res.status(500).json({ error: 'Erro ao candidatar-se à vaga' });
        }
    }

    async obterTodosCandidatos(req, res) {
        try {
            console.log('Tentando obter todos os candidatos');
            const candidatos = await candidatosModel.obterTodosCandidatos();
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
        console.log('Excluindo candidato com CPF:', cpf);
        

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
