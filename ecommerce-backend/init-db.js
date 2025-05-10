const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use the same database configuration as in database.js
const sequelize = new Sequelize(
    'car_parts_db',
    'car_parts_db_owner',
    '0F4QXKRPmHBW',
    {
        host: 'ep-bold-union-a698c6lj.us-west-2.aws.neon.tech',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: console.log // Enable logging to see SQL queries
    }
);

async function initDatabase() {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Create database if it doesn't exist
        try {
            await sequelize.query('CREATE DATABASE car_parts_db;');
            console.log('Database created successfully');
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log('Database already exists, continuing...');
            } else {
                throw error;
            }
        }

        // Sync all models
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully.');

        // Import initial data
        const importData = require('./importData');
        await importData.importAllData();
        console.log('Initial data imported successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit with error code
    }
}

// Run the initialization
initDatabase(); 