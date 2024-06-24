import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/sequelize.util'


export class ChatMember extends Model { }

ChatMember.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        createdAt: false,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'chatId']
            }
        ]
    },
);

// ChatMember.sync({ force: true })