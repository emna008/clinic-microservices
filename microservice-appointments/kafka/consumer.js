const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'appointment-service-consumer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'appointment-service-group' });
const startConsumer = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'patient.registered', fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        console.log(`[Kafka Consumer] Nouveau patient reçu, prêt pour RDV: ${data.patientId} - ${data.firstName} ${data.lastName}`);
      },
    });
    console.log('[Kafka Consumer] Appointments subscribed to patient.registered');
  } catch (error) {
    console.error('[Kafka Consumer] Error:', error.message);
    setTimeout(startConsumer, 5000);
  }
};
module.exports = { startConsumer };
