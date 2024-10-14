import DataBase from '../dataBase.js';

const database = new DataBase();

class VagasModel {
    async adicionarVaga(vaga) {
        const connection = await database.beginTransaction();
        try {
            // Verifica se a vaga já está cadastrada
            const [vagaExiste] = await connection.query(`SELECT * FROM Vaga WHERE vaga_cargo = ? AND vaga_cidade = ?`, [vaga.cargo, vaga.cidade]);
            
            if (vagaExiste.length > 0) {
                await database.rollbackTransaction(connection);
                return { success: false, message: 'Vaga já cadastrada para essa cidade' };
            }

            // Inserir a nova vaga
            const insertVagaQuery = `
                INSERT INTO Vaga (vaga_cargo, vaga_salario, vaga_cidade, vaga_quantidade)
                VALUES (?, ?, ?, ?)
            `;
            await connection.query(insertVagaQuery, [
                vaga.cargo,
                vaga.salario,
                vaga.cidade,
                vaga.quantidade
            ]);

            await database.commitTransaction(connection);
            return { success: true, message: 'Vaga adicionada com sucesso' };
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }

    async editarVaga(vaga_codigo, vaga) {
        const connection = await database.beginTransaction();
        try {
            const updateVagaQuery = `
                UPDATE Vaga
                SET vaga_cargo = ?, vaga_salario = ?, vaga_cidade = ?, vaga_quantidade = ?
                WHERE vaga_codigo = ?
            `;
            const [result] = await connection.query(updateVagaQuery, [
                vaga.cargo,
                vaga.salario,
                vaga.cidade,
                vaga.quantidade,
                vaga_codigo
            ]);

            await database.commitTransaction(connection);
            if (result.affectedRows > 0) {
                return { success: true, message: 'Vaga atualizada com sucesso' };
            } else {
                return { success: false, message: 'Vaga não encontrada' };
            }
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }

    async excluirVaga(vaga_codigo) {
        const connection = await database.beginTransaction();
        try {
            const deleteVagaQuery = `DELETE FROM Vaga WHERE vaga_codigo = ?`;
            const [result] = await connection.query(deleteVagaQuery, [vaga_codigo]);

            await database.commitTransaction(connection);
            if (result.affectedRows > 0) {
                return { success: true, message: 'Vaga excluída com sucesso' };
            } else {
                return { success: false, message: 'Vaga não encontrada' };
            }
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }

    async obterTodasVagas() {
        const connection = await database.beginTransaction();
        try {
            const [result] = await connection.query('SELECT * FROM Vaga');
            await database.commitTransaction(connection);
            return result;
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }
}

export default VagasModel;
