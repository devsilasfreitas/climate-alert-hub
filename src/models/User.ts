import { DataTypes, Model, Optional } from "sequelize";
import { database } from "../database";

export interface User {
    id: number;
    email: string;
    theme: "light" | "dark";
    reciveEmail: boolean;
    country:
        | "brazil"
        | "unitedStates"
        | "philippines"
        | "russia"
        | "mocambique";
    state: string | null;
    city: string | null;
    token: string;
}

export interface UserCreationAttributes extends Optional<User, "id"> {}
export interface UserInstance
    extends Model<User, UserCreationAttributes>,
        User {}

export const User = database.define<UserInstance, User>("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    theme: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "light",
        validate: {
            isIn: [["light", "dark"]],
        },
    },
    reciveEmail: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: DataTypes.CHAR(1200),
        allowNull: false,
    }
});
