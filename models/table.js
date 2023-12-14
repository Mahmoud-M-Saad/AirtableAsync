module.exports = (sequelize, DataTypes) => {
    const tables = sequelize.define('User', {
        id:{
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
          },
        Name: DataTypes.STRING,
        number: DataTypes.STRING,
    });
  
    return User;
  };