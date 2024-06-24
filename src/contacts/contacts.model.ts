import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../utils/sequelize.util'

export enum ContactStatus {
    AVAILABLE,
    RESTRICTED,
    BLOCKED,
}

export class Contact extends Model { }

Contact.init(
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
        contactUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.SMALLINT,
            allowNull: false,
            defaultValue: ContactStatus.AVAILABLE
        }
    },
    {
        sequelize,
        timestamps: false,
        createdAt: false,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'contactUserId']
            }
        ],
    },

);

// Contact.sync({ force: true })