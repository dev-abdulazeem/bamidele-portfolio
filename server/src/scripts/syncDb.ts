import sequelize from '../config/database';
import User from '../models/User';
import Project from '../models/Project';
import Skill from '../models/Skill';
import Message from '../models/Message';
import Experience from '../models/Experience';

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Sync all models (force: false to preserve data)
    await sequelize.sync({ alter: true });
    console.log('All models synchronized.');

    // Create default admin user if not exists
    const bcrypt = await import('bcryptjs');
    const adminExists = await User.findOne({ where: { email: 'admin@bamidele.dev' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.default.hash('admin123', 10);
      await User.create({
        email: 'admin@bamidele.dev',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin created: admin@bamidele.dev / admin123');
    }

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database sync failed:', error);
    process.exit(1);
  }
};

syncDatabase();