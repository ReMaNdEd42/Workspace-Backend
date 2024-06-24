import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/sequelize.util'


export class Chat extends Model { }

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        createdAt: false,
    },
);

// Chat.sync({ force: true })