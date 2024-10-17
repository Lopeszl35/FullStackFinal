import DataBase from '../dataBase.js';

const database = new DataBase();

class CandidatosModel {
    async adicionarCandidato(candidato, connection) {
        try {
            const [candidatoExiste] = await connection.query(`SELECT * FROM Candidato WHERE cand_cpf = ?`, [candidato.cpf]);

            if (candidatoExiste.length > 0) {
                await database.rollbackTransaction(connection);
                return { success: false, message: 'Candidato já cadastrado', candCpf: candidato.cpf };
            }

            const insertCandidatoQuery = `
                INSERT INTO Candidato (cand_cpf, cand_nome, cand_endereco, cand_telefone)
                VALUES (?, ?, ?, ?);
            `;
            await connection.query(insertCandidatoQuery, [
                candidato.cpf,
                candidato.nome,
                candidato.endereco,
                candidato.telefone
            ]);

            await database.commitTransaction(connection);
            return { success: true, message: 'Candidato inserido com sucesso', candCpf: candidato.cpf };
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
            const deleteCandidatoQuery = `DELETE FROM Candidato WHERE cand_cpf = ?`;
            const [result] = await connection.query(deleteCandidatoQuery, [cpf]);

            await database.commitTransaction(connection);
            if (result.affectedRows > 0) {
                return { success: true, message: 'Candidato excluído com sucesso' };
            } else {
                return { success: false, message: 'Candidato não encontrado' };
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
            await connection.query(insertCandidatoVagaQuery, [candCpf, vagaCodigo]);

            await database.commitTransaction(connection);
            return { success: true, message: `Candidatura realizada com sucesso para a vaga ${vagaCodigo}` };
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }
}

export default CandidatosModel;
