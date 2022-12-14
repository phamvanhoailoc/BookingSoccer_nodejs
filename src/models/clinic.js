'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic.belongsTo(models.Allcode,{foreignKey:'area',targetKey:'keyMap',as: 'areaData'})
      Clinic.hasOne(models.Markdown,{foreignKey:'ClinicId'})
      Clinic.hasMany(models.Schedule,{foreignKey:'doctorId',as: 'doctorData'})
      Clinic.hasMany(models.User,{foreignKey:'positionId',as: 'positionData'})

    }
  };
  Clinic.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.TEXT,
    area: DataTypes.STRING,
    image: DataTypes.BLOB('long'),   
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};