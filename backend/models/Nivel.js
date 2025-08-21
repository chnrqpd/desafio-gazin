const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Nivel = sequelize.define(
    'Nivel',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nivel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'niveis',
      timestamps: true,
    }
  );

  Nivel.associate = function (models) {
    Nivel.hasMany(models.Desenvolvedor, {
      foreignKey: 'nivel_id',
      as: 'desenvolvedores',
    });
  };

  return Nivel;
};
