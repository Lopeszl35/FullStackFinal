import { validationResult } from 'express-validator';
import UsuariosModel from '../model/entities/usuariosModel.js';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secret = process.env.CHAVE_SECRETA;

const usuariosModel = new UsuariosModel();



class usuariosController {

    async adicionarUsuario(req, res) {
        console.log('Adicionando usuário');
        const errors = validationResult(req);
        console.log(JSON.stringify(errors));

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const {email, nome, senha } = req.body;
            const salt = await bycrypt.genSalt(10);
            const senhahash = await bycrypt.hash(senha, salt);

            const usuario = new UsuariosModel(email, nome, senhahash);
            await usuariosModel.adicionarUsuario(usuario);
            
            return res.status(201).json({message: `Usuário criado com sucesso`});
        } catch (error) {
            console.error('Erro ao adicionar usuário',error);
            res.status(500).json({ error: 'Erro ao adicionar usuário' });
        }

    }

    async logarUsuario(req, res) {
        const userInfo = req.body;
        console.log('Logando usuário...');
        const errors = validationResult(req);
        console.log(JSON.stringify(errors));

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(userInfo);

        try {
            const user = await usuariosModel.logarUsuario(userInfo.email);
            console.log('User encontrado: ', user);

            if (user) {
                const senhaDcrypt = bycrypt.compareSync(userInfo.senha, user.senha);
                console.log('Senha válida: ', senhaDcrypt);

                if (!senhaDcrypt) {
                    return res.status(401).json({ error: 'Credenciais inválidas' });
                }

                // Geração do token JWT
                const token = jwt.sign(
                    { id: user.id, email: user.email, nome: user.nome },
                    secret,  
                    { expiresIn: '1h' }
                );

                return res.status(200).json({ user: { id: user.id, email: user.email, nome: user.nome }, token });
            } else {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

        } catch (error) {
            console.error('Erro na autenticação do usuário:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

}

export default usuariosController
