const amqp = require('amqplib');

class OrderQueue {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.QUEUE_NAME = 'order_queue';
    }

    async connect() {
        try {
            // Connect to RabbitMQ server
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            
            // Create queue if it doesn't exist
            await this.channel.assertQueue(this.QUEUE_NAME, {
                durable: true // Queue will survive broker restart
            });

            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    // Send order to queue
    async sendOrder(orderData) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            // Convert order data to string
            const message = JSON.stringify(orderData);

            // Send to queue
            this.channel.sendToQueue(this.QUEUE_NAME, Buffer.from(message), {
                persistent: true // Message will survive broker restart
            });

            console.log('Order sent to queue:', orderData.orderId);
        } catch (error) {
            console.error('Error sending order to queue:', error);
            throw error;
        }
    }

    // Process orders from queue
    async processOrders(callback) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            console.log('Waiting for orders...');

            // Consume messages from queue
            this.channel.consume(this.QUEUE_NAME, async (msg) => {
                if (msg !== null) {
                    const orderData = JSON.parse(msg.content.toString());
                    console.log('Processing order:', orderData.orderId);

                    try {
                        // Process the order
                        await callback(orderData);
                        
                        // Acknowledge the message
                        this.channel.ack(msg);
                        console.log('Order processed successfully:', orderData.orderId);
                    } catch (error) {
                        console.error('Error processing order:', error);
                        // Reject the message and requeue
                        this.channel.nack(msg, false, true);
                    }
                }
            });
        } catch (error) {
            console.error('Error processing orders:', error);
            throw error;
        }
    }

    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('Queue connection closed');
        } catch (error) {
            console.error('Error closing queue connection:', error);
            throw error;
        }
    }
}

module.exports = new OrderQueue(); 