const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

class OrderProducer {
    async connect() {
        try {
            await producer.connect();
            console.log('Connected to Kafka');
        } catch (error) {
            console.error('Error connecting to Kafka:', error);
            throw error;
        }
    }

    async sendOrder(orderData) {
        try {
            await producer.send({
                topic: 'orders',
                messages: [
                    { 
                        key: orderData.orderId,
                        value: JSON.stringify(orderData)
                    }
                ]
            });
            console.log('Order sent to Kafka:', orderData.orderId);
        } catch (error) {
            console.error('Error sending order to Kafka:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await producer.disconnect();
            console.log('Disconnected from Kafka');
        } catch (error) {
            console.error('Error disconnecting from Kafka:', error);
            throw error;
        }
    }
}

module.exports = new OrderProducer(); 