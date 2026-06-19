const { Kafka } = require('kafkajs');
const kafka = new Kafka({
  clientId: 'patient-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});
const producer = kafka.producer();
let connected = false;
const connectProducer = async () => {
  if (!connected) { await producer.connect(); connected = true; }
};
const publishPatientRegistered = async (patientData) => {
  try {
    await connectProducer();
    await producer.send({
      topic: 'patient.registered',
      messages: [{
        key: patientData.id,
        value: JSON.stringify({
          patientId: patientData.id,
          firstName: patientData.firstName,
          lastName: patientData.lastName,
          email: patientData.email,
          phone: patientData.phone,
          timestamp: new Date().toISOString(),
        }),
      }],
    });
    console.log(`[Kafka] Published patient.registered for ${patientData.id}`);
  } catch (error) {
    console.error('[Kafka Producer] Error:', error.message);
  }
};
module.exports = { publishPatientRegistered };
