const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        email: DataTypes.STRING,
        senha: DataTypes.STRING,
        isLogged: {
          field: 'isLogged',
          type: DataTypes.BOOLEAN
        }
      },
      { 
        sequelize,
        hooks: {
          beforeCreate: (user) => {
            const salt = bcrypt.genSaltSync();
            user.senha = bcrypt.hashSync(user.senha, salt);
          }
        } 
      }
    );
  }
  static associate(models){
    this.hasMany(models.Address, { foreignKey: 'userId', as: 'address' });
  } 
}

module.exports = User;