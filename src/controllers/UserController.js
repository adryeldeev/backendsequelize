const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')

function generateToken(params = {}){
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 78300
  }) 
}

module.exports = {
  async login(req, res) {
    const { senha, email, isLogged } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).send({
          status: 0,
          message: 'E-mail ou senha incorreta'
        });
      }

      if (!bcrypt.compareSync(senha, user.senha)) {
        return res.status(400).send({
          status: 0,
          message: 'E-mail ou Senha incorreta!'
        });
      }

      await user.update({ isLogged }); // Atualiza o campo isLogged no registro do usuário

      user.senha = undefined;

      const token = generateToken({id:user.id})
      return res.status(200).send({
        Status: 'Success',
        message: "Usuário logado com sucesso!",
        user, token
      });
    } catch (error) {
      return res.status(500).send({ message: "Erro ao fazer login." });
    }
  },

  async index(req, res) {
    try {
      const users = await User.findAll();
  
      if (!users) {
        return res.status(400).send({ message: 'Usuário não localizado' });
      }
  
      return res.status(200).send({ 
      Status:'Success',
        users
       });
    } catch (error) {
      console.error(error); // Imprimir o erro no console para depuração
      return res.status(500).send({ message: 'Erro ao buscar usuários.' });
    }
  },

  async store(req, res) {
    try {
      const { email, senha } = req.body;

      const user = await User.create({ email, senha });
      const token = generateToken({id:user.id})
      return res.status(200).send({
        Status: 'Success',
        message: 'Usuário cadastrado com sucesso!',
        user, token
      });
    } catch (error) {
      return res.status(500).send({ message: "Erro ao cadastrar usuário." });
    }
  },

  async update(req, res) {
    try {
      const { email, senha } = req.body;
      const { id } = req.params;

      await User.update({ email, senha }, {
        where: {
          id: id
        }
      });

      return res.status(200).send({
        Status: 'Success',
        message: 'Usuário atualizado com sucesso!',
      });
    } catch (error) {
      return res.status(500).send({ message: "Erro ao atualizar usuário." });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      const user = await User.destroy({
        where: {
          id: id
        }
      });

      if (!user) {
        return res.status(400).send({ message: 'Usuário não existe!' });
      }

      return res.status(200).send({
        Status: 'Success',
        message: 'Usuário deletado com sucesso!',
        user
      });
    } catch (error) {
      return res.status(500).send({ message: "Erro ao deletar usuário." });
    }
  },

  async isLogged(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(400).send({ message: 'Usuário não encontrado' });
      }

      return res.status(200).send({
        Status:'Success',
        isLogged: user.isLogged
      });
    } catch (error) {
      return res.status(500).send({ message: 'Erro ao verificar status de login.' });
    }
  },
  async getAdminCount(req, res) {
    try {
      const count = await User.count({ where: { isLogged: true } });
      return res.status(200).json({ adminCount: count });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao obter contagem de administradores' });
    }
  },
  async  getDashboard(req, res) {
    try {
      const { id } = req.user;
  
      const user = await User.findOne({ where: { id } });
  
      if (!user) {
        return res.status(400).json({ status: 'Error', message: 'Usuário não encontrado' });
      }
  
      const role = user.isLogged ? 'admin' : 'address';
  
      return res.json({ Status: 'Success', role, id });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao obter o painel de controle' });
    }
  },

  async logout(req, res) {
    try {
      const { id } = req.user;
  
      const user = await User.findOne({ where: { id } });
  
      if (!user) {
        return res.status(400).json({ Status: 'Error', message: 'Usuário não encontrado' });
      }
  
      await user.address.update({ isLogged: false }) // Atualize o campo isLogged para false no registro do usuário
  
      res.clearCookie('token'); // Limpa o cookie com o nome 'token'
  
      return res.json({ status: 'Success' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao fazer logout' });
    }
  }
  
 
 
};