const { startConsumer } = require('./kafka/consumer');
require('./db');
require('./server');
startConsumer().catch(console.error);
console.log('[Appointments Microservice] Starting...');
