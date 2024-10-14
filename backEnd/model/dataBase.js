import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';
dotenv.config();

class Database {

    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: process.env.USUARIO_BD,
            database: 'BDVagasCandidatos'
        });
    }

    async executaComando(sql, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [rows] = await connection.query(sql, params);
            console.log(`Model: executarComando: rows = ${JSON.stringify(rows)}`);
            return rows;
        } catch (error) {
            console.error(`Erro ao executar comando SQL: ${sql}`, error);
            throw new Error('Erro ao executar comando SQL');
        } finally {
            connection.release();
        }
    }

    async executaComandoNonQuery(sql, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const results = await connection.query(sql, params);
            return results.affectedRows; 
        } catch (error) {
            console.error(`Erro ao executar comando non-query SQL: ${sql}`, error);
            throw new Error('Erro ao executar comando non-query SQL');
        } finally {
            connection.release();
        }
    }

    async beginTransaction() {
        console.log('Iniciando transação no pool de conexões...');
        const connection = await this.pool.getConnection();
        console.log('Conexão obtida para transação');
        await connection.beginTransaction();
        return connection;
    }

    async commitTransaction(connection) {
        try {
            await connection.commit();
            console.log('Transação concluída');
        } catch (error) {
            console.error('Erro ao cometer transação:', error);
            throw new Error('Erro ao cometer transação');
        } finally {
            connection.release();
        }
    }

    async rollbackTransaction(connection) {
        if (connection) {
            try {
                await connection.rollback();
                console.log('Transação revertida');
            } catch (error) {
                console.error('Erro ao reverter transação:', error);
                throw new Error('Erro ao reverter transação');
            } finally {
                connection.release();
            }
        }
    }
}

export default Database;
