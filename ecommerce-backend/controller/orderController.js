/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         order_id:
 *           type: string
 *         user_id:
 *           type: string
 *         total_amount:
 *           type: number
 *         shipping_address:
 *           type: string
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 */

const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     part_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               total:
 *                 type: number
 *               shippingDetails:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created
 *       500:
 *         description: Server error
 */

const UserOrderItem = require('../models/userorderitem');
const UserOrder = require('../models/userorder');

const orderProducer = require('../services/kafka/orderProducer');
const orderConsumer = require('../services/kafka/orderConsumer');

// Initialize Kafka connections
async function initializeKafka() {
    try {
        await orderProducer.connect();
        await orderConsumer.connect();
        
        // Start processing orders
        await orderConsumer.startProcessing(async (orderData) => {
            // Process the order (e.g., update inventory, send notifications)
            console.log('Processing order:', orderData);
            // Add your order processing logic here
        });
    } catch (error) {
        console.error('Error initializing Kafka:', error);
    }
}

// Create a new order
async function createOrder(req, res) {
    try {
        const orderData = {
            orderId: Date.now().toString(),
            ...req.body,
            timestamp: new Date().toISOString()
        };

        // Send order to Kafka
        await orderProducer.sendOrder(orderData);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            orderId: orderData.orderId
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
}

// Initialize Kafka when the application starts
initializeKafka();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get user's orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

const getOrders = async (req, res) => {
    try {
      //const keycloakUserId = req.kauth.grant.access_token.content.sub;
      // Fetch all orders for the user
      const { user_id } = req.params
      const orders = await UserOrder.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']], // Order by createdAt descending
      });

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */

const getOrderById = async (req, res) => {
    try {
      const { order_id } = req.params;
      const { user_id } = req.params;

      // Fetch order and its items
      const order = await UserOrder.findOne({
        where: { order_id, user_id },
        include: [
          {
            model: UserOrderItem,
            as: 'items',
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};