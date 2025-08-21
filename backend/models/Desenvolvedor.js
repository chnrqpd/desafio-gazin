const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Desenvolvedor = sequelize.define('Desenvolvedor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nivel_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'niveis',
                key: 'id'
            }
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sexo: {
            type: DataTypes.CHAR(1),
            allowNull: false
        },
        data_nascimento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        hobby: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'desenvolvedores',
        timestamps: true
    });

    Desenvolvedor.associate = function(models) {
        Desenvolvedor.belongsTo(models.Nivel, {
            foreignKey: 'nivel_id',
            as: 'nivel'
        });
    };

    return Desenvolvedor;
}