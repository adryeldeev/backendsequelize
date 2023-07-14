const User = require('../models/User')
const Address = require('../models/Address')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  async index(req, res) {
    const { id } = req.params;
  
    try {
      const user = await User.findOne({
        where: { id },
        include: { association: 'address' },
      });
  
      if (!user) {
        return res.status(400).json({
          status: 0,
          message: 'Funcionário não encontrado',
        });
      }
  
      return res.status(200).send(user.address);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },
  
    async store(req, res) {
      try {
        const { id } = req.params;
        const { name, email, senha, address, salario } = req.body;
  
        const user = await User.findByPk(id);
  
        if (!user) {
          return res.status(400).json({
            status: 0,
            message: 'Usuário não encontrado!',
          });
        }
  
        const hash = await bcrypt.hash(senha.toString(), 10);
  
        if (!req.file) {
          return res.json({ Error: 'Nenhuma imagem enviada' });
        }
  
        const imageFilename = req.file.filename;
  
        const addressCreated = await Address.create({
          name,
          email,
          senha: hash,
          address,
          salario,
          image: imageFilename,
          UserId: user.id, // Associe o endereço ao usuário
        });
  
        if (addressCreated) {
          return res.json({ Status: 'Success' });
        } else {
          return res.json({ Error: 'Falha ao criar o endereço' });
        }
      } catch (error) {
        return res.status(400).send({ error: error.message });
      }
    },
  
    async delete(req, res) {
      const id = req.params.id;
  
      try {
        const address = await Address.findByPk(id);
        if (address) {
          await Address.destroy({ where: { id } });
  
          return res.status(200).json({
            status: 'Success',
            message: 'Funcionário apagado com sucesso!',
          });
        } else {
          return res.status(400).send({
            status: 0,
            message: 'Funcionário não encontrado!',
          });
        }
      } catch (error) {
        return res.status(400).send({ error: error.message });
      }
    },
  
    async update(req, res) {
      const id = req.params.id;
      const { salario } = req.body;
  
      try {
        const address = await Address.findByPk(id);
  
        if (address) {
          await Address.update({ salario }, { where: { id } });
  
          return res.status(200).send({
            status: 'Success',
            message: 'Salário atualizado com sucesso!',
          });
        } else {
          return res.status(400).send({
            status: 0,
            message: 'Funcionário não encontrado!',
          });
        }
      } catch (error) {
        return res.status(400).send({ error: error.message });
      }
    },
  
    employeelogin(req, res) {
      const { email, senha } = req.body;
  
      User.findOne({ where: { email } })
        .then((user) => {
          if (!user) {
            return res.json({ Status: 'Error', Error: 'Wrong Email or Password' });
          }
  
          bcrypt.compare(senha.toString(), user.senha, (err, response) => {
            if (err) return res.json({ Error: 'password error' });
            if (response) {
              const token = jwt.sign({ role: 'employee', id: user.id }, 'jwt-secret-key', {
                expiresIn: '1d',
              });
              res.cookie('token', token);
              return res.json({ Status: 'Success', id: user.id });
            }
          });
        })
        .catch((err) => {
          return res.json({ Status: 'Error', Error: 'Error in running query' });
        });
    },

    async getById(req, res) {
      const id = req.params.id;
    
      try {
        const user = await User.findOne({
          where: { id },
        });
    
        if (!user) {
          return res.json({ Status: 'Error', Error: 'Funcionário não encontrado' });
        }
    
        return res.json({ Status: 'Success', Result: user });
      } catch (error) {
        return res.json({ Error: 'Erro ao obter funcionário', Details: error.message });
      }
    },
    async getEmployeeCount(req, res) {
      try {
        const count = await User.count({
          where: {},
          col: 'id',
          distinct: true,
        });
  
        return res.status(200).send({
          status:'Success',
          employeeCount: count,
        });
      } catch (error) {
        return res.status(500).send({ message: 'Erro ao obter contagem de funcionários.' });
      }
    },
    async getEmployee(req, res) {
      try {
        const employees = await User.findAll(); // corrigido de 'count' para 'findAll'
        return res.json({ status: 'Success', result: employees });
      } catch (error) {
        // Trate o erro adequadamente aqui
        return res.json({ status: 'Error', error: 'Erro ao obter os funcionários' });
      }
    },
    async  getSalario(req, res) {
      try {
        const sumOfSalario = await Address.sum('salario');
    
        return res.status(200).json({ sumOfSalario });
      } catch (error) {
        return res.status(500).json({ error: 'Erro ao obter a soma dos salários' });
      }
    }
  };
  