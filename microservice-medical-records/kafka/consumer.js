const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const { getCollection } = require('../db');
const kafka = new Kafka({ clientId: 'medical-records-consumer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'medical-records-service-group' });
const startConsumer = async () => {
  try {
    const collection = await getCollection();
    await consumer.connect();
    await consumer.subscribe({ topic: 'appointment.created', fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        const now = new Date().toISOString();
        await collection.insert({
          id: uuidv4(), patientId: data.patientId, appointmentId: data.appointmentId,
          doctorName: data.doctorName, diagnosis: '', notes: 'Dossier initialisé automatiquement.',
          prescriptions: [], createdAt: now, updatedAt: now,
        });
        console.log(`[Kafka Consumer] Dossier médical créé automatiquement pour appointment ${data.appointmentId}`);
      },
    });
    console.log('[Kafka Consumer] Medical records subscribed to appointment.created');
  } catch (error) {
    console.error('[Kafka Consumer] Error:', error.message);
    setTimeout(startConsumer, 5000);
  }
};
module.exports = { startConsumer };
