// models/user.js

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
  