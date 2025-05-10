const Sequelize = require('sequelize');
require('dotenv').config();

class Database {
    // Static property to hold the single instance
    static instance;

    constructor() {
        if (!Database.instance) {
            // Initialize Sequelize connection
            this.sequelize = new Sequelize(
                'car_parts_db', // Use the correct database name
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

            // Cache the instance
            Database.instance = this;
        }

        // Return the single instance
        return Database.instance;
    }

    // Method to get the Sequelize instance
    getSequelizeInstance() {
        return this.sequelize;
    }

    // Method to test the connection
    async testConnection() {
        try {
            await this.sequelize.authenticate();
            console.log('Database connection has been established successfully.');
            return true;
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
        }
    }
}

// Exporting a single instance of the database connection
const databaseInstance = new Database();
module.exports = databaseInstance.getSequelizeInstance();
