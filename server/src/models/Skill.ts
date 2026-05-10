import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SkillAttributes {
  id: number;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'soft';
  proficiency: number;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SkillCreationAttributes extends Optional<SkillAttributes, 'id'> {}

class Skill extends Model<SkillAttributes, SkillCreationAttributes> implements SkillAttributes {
  public id!: number;
  public name!: string;
  public category!: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'soft';
  public proficiency!: number;
  public icon!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Skill.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('frontend', 'backend', 'database', 'devops', 'tools', 'soft'),
      allowNull: false
    },
    proficiency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100
      }
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'skills',
    timestamps: true
  }
);

export default Skill;