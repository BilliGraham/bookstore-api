import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface BookAttributes {
  id?: number;
  title: string;
  author: string;
  genre: string;
  price: number;
  publicationYear: number;
  ISBN: string; // Changed to string as ISBN can have letters and be very long
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

class Book extends Model<BookAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public genre!: string;
  public price!: number;
  public publicationYear!: number;
  public ISBN!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    publicationYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Book',
    tableName: 'books',
    timestamps: true,
  }
);

export default Book;