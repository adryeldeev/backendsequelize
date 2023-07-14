const {Model, DataTypes} = require('sequelize')

class Address extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            hash: DataTypes.STRING,
            address: DataTypes.STRING,
            salario: DataTypes.FLOAT,
            image: DataTypes.STRING,
        },{
            sequelize
        })
    }
    
    
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        this.belongsTo
      }
    }

module.exports = Address