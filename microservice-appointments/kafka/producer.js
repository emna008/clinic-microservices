const { Kafka } = require('kafkajs');
const kafka = new Kafka({ clientId: 'appointment-service-producer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const producer = kafka.producer();
let connected = false;
const connectProducer = async () => { if (!connected) { await producer.connect(); connected = true; } };
const publishAppointmentCreated = async (data) => {
  try {
    await connectProducer();
    await producer.send({
      topic: 'appointment.created',
      messages: [{ key: data.id, value: JSON.stringify({ appointmentId: data.id, patientId: data.patientId, doctorName: data.doctorName, specialty: data.specialty, dateTime: data.dateTime, timestamp: new Date().toISOString() }) }],
    });
    console.log(`[Kafka] Published appointment.created for ${data.id}`);
  } catch (error) { console.error('[Kafka Producer] Error:', error.message); }
};
module.exports = { publishAppointmentCreated };
