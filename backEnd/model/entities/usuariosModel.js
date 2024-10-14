import DataBase from '../dataBase.js';
const database = new DataBase();

class usuariosModel {
    constructor(email, nome, senha) {
        this.email = email;
        this.nome = nome;
        this.senha = senha;
    }

    async adicionarUsuario(usuario) {
        let connection = await database.beginTransaction();
        try {
            const [result] = await connection.query(
                'INSERT INTO usuarios (email, nome, senha) VALUES (?, ?, ?)',
                [usuario.email, usuario.nome, usuario.senha]
            );
            
            if (result.affectedRows > 0) {
                await database.commitTransaction(connection);
            } else {
                await database.rollbackTransaction(connection);
            }
        } catch (error) {
            await database.rollbackTransaction(connection);
            throw error;
        }
    }

    async logarUsuario(email) {
        try {
            const rows = await database.executaComando(
                'SELECT * FROM usuarios WHERE email = ?',
                [email]
            );
            return rows[0];
          
        } catch (error) {
            console.error('Erro ao logar o usuário:', error);
            throw error;
        }
    }
    
}

export default usuariosModel;