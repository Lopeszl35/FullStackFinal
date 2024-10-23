import DataBase from '../dataBase.js';

const database = new DataBase();

class CandidatosModel {
    async adicionarCandidato(candidato, connection) {
        try {
            console.log('Model: Tentando adicionar candidato:', candidato);
            const [candidatoExiste] = await connection.query(`SELECT * FROM Candidato WHERE cand_cpf = ?`, [candidato.cpf]);

            if (candidatoExiste.length > 0) {
                await database.rollbackTransaction(connection);
                return { success: false, message: 'Candidato já cadastrado', candCpf: candidato.cand_cpf };
            }

            const insertCandidatoQuery = `
                INSERT INTO Candidato (cand_cpf, cand_nome, cand_endereco, cand_telefone)
                VALUES (?, ?, ?, ?);
            `;
            await connection.query(insertCandidatoQuery, [
                candidato.cand_cpf,
                candidato.cand_nome,
                candidato.cand_endereco,
                candidato.cand_telefone
            ]);

            await database.commitTransaction(connection);
            return { success: true, message: 'Candidato inserido com sucesso', candCpf: candidato.cand_cpf };
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }

    async editarCandidato(cpf, candidato) {
        const connection = await database.beginTransaction();
        try {
            const updateCandidatoQuery = `
                UPDATE Candidato
                SET cand_nome = ?, cand_endereco = ?, cand_telefone = ?
                WHERE cand_cpf = ?;
            `;
            const [result] = await connection.query(updateCandidatoQuery, [
                candidato.nome,
                candidato.endereco,
                candidato.telefone,
                cpf
            ]);

            await database.commitTransaction(connection);
            if (result.affectedRows > 0) {
                return { success: true, message: 'Candidato atualizado com sucesso' };
            } else {
                return { success: false, message: 'Candidato não encontrado' };
            }
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }

    async excluirCandidato(cpf) {
        const connection = await database.beginTransaction();
        try {
            const candidatoExiste = await database.executaComando(`SELECT * FROM Candidato WHERE cand_cpf = ?`, [cpf]);
            if (candidatoExiste.length === 0) {
                await database.rollbackTransaction(connection);
                return { success: false, message: 'Candidato não encontrado' };
            }
            const deleteCandidatoVagaQuery = `DELETE FROM Candidato_Vaga WHERE cand_cpf = ?`;
            const [resultVaga] = await connection.query(deleteCandidatoVagaQuery, [cpf]);

            const deleteCandidatoQuery = `DELETE FROM Candidato WHERE cand_cpf = ?`;
            const [resultCandidato] = await connection.query(deleteCandidatoQuery, [cpf]);

            
            if (resultCandidato.affectedRows > 0) {
                await database.commitTransaction(connection);
                return { success: true, message: 'Candidato excluído com sucesso' };
            } else {
                await database.rollbackTransaction(connection);
                return { success: false, message: 'Erro ao excluir candidato' };
            }
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }

    async obterTodosCandidatos() {
        try {
            const candidatos = await database.executaComando(`SELECT * FROM Candidato`);
            return candidatos;
        } catch (error) {
            throw error;
        }
    }

    async candidatarVaga(candCpf, vagaCodigo, connection) {
        try {
            const insertCandidatoVagaQuery = `
                INSERT INTO Candidato_Vaga (cand_cpf, vaga_codigo, data_inscricao, horario_inscricao)
                VALUES (?, ?, CURDATE(), CURTIME());
            `;
            const [result] = await connection.query(insertCandidatoVagaQuery, [candCpf, vagaCodigo]);

            if (result.affectedRows === 0) {
                await database.rollbackTransaction(connection);
                return { success: false, message: 'Candidatura não realizada' };
            }

            await database.commitTransaction(connection);
            return { success: true, message: `Candidatura realizada com sucesso para a vaga ${vagaCodigo}` };
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }
}

export default CandidatosModel;
