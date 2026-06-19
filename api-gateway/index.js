const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const { schema, root } = require('./graphql/schema');
const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments');
const medicalRecordsRouter = require('./routes/medicalRecords');

const app = express();
app.use(cors()); app.use(morgan('dev')); app.use(express.json());

app.get('/', (req, res) => res.json({
  status: 'ok', service: 'API Gateway - Clinic Management',
  rest: { patients: '/api/patients', appointments: '/api/appointments', records: '/api/records' },
  graphql: '/graphql',
}));

app.use('/api/patients', patientsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/records', medicalRecordsRouter);
app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(process.env.PORT || 3000, () => {
  console.log(`\n[API Gateway] http://localhost:3000`);
  console.log(`[API Gateway] GraphQL Playground: http://localhost:3000/graphql\n`);
});
