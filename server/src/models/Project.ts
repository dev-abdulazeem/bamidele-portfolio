import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProjectAttributes {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public image!: string;
  public technologies!: string[];
  public githubUrl!: string;
  public liveUrl!: string;
  public featured!: boolean;
  public category!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    githubUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    liveUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    category: {
      type: DataTypes.STRING(50),
      defaultValue: 'fullstack'
    }
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true
  }
);

export default Project;