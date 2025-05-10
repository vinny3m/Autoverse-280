const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'order-processor',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'order-processing-group' });

class OrderConsumer {
    async connect() {
        try {
            await consumer.connect();
            console.log('Consumer connected to Kafka');
        } catch (error) {
            console.error('Error connecting consumer to Kafka:', error);
            throw error;
        }
    }

    async startProcessing(callback) {
        try {
            await consumer.subscribe({ topic: 'orders', fromBeginning: true });
            
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        const orderData = JSON.parse(message.value.toString());
                        console.log('Processing order:', orderData.orderId);
                        
                        // Process the order using the provided callback
                        await callback(orderData);
                        
                        console.log('Order processed successfully:', orderData.orderId);
                    } catch (error) {
                        console.error('Error processing order:', error);
                    }
                }
            });
        } catch (error) {
            console.error('Error starting order processing:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await consumer.disconnect();
            console.log('Consumer disconnected from Kafka');
        } catch (error) {
            console.error('Error disconnecting consumer from Kafka:', error);
            throw error;
        }
    }
}

module.exports = new OrderConsumer(); 