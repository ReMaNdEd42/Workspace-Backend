import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/sequelize.util'

export class Appointment extends Model { }

Appointment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false

        },
        note: {
            type: DataTypes.STRING,
            allowNull: true

        },
        startTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    },
    {
        sequelize,
        timestamps: false,
        createdAt: false,
    },

);

// Appointment.sync({ force: true })