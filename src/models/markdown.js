'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Markdown.belongsTo(models.Clinic,{foreignKey: 'ClinicId'})
      
    }
  };
  Markdown.init({
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown: DataTypes.TEXT('long'),
    description: DataTypes.TEXT('long'),  
    ClinicId: DataTypes.STRING,
    specialtyId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Markdown',
  });
  return Markdown;
};