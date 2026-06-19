const { startConsumer } = require('./kafka/consumer');
require('./server');
startConsumer().catch(console.error);
console.log('[Medical Records Microservice] Starting...');
