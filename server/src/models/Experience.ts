import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ExperienceAttributes {
  id: number;
  company: string;
  role: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExperienceCreationAttributes extends Optional<ExperienceAttributes, 'id'> {}

class Experience extends Model<ExperienceAttributes, ExperienceCreationAttributes> implements ExperienceAttributes {
  public id!: number;
  public company!: string;
  public role!: string;
  public description!: string;
  public startDate!: Date;
  public endDate!: Date | null;
  public current!: boolean;
  public location!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Experience.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    company: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    current: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'experiences',
    timestamps: true
  }
);

export default Experience;