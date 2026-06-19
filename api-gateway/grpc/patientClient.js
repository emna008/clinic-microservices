const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../../proto/patient.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase:true, longs:String, enums:String, defaults:true, oneofs:true });
const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;
const client = new patientProto.PatientService(process.env.PATIENTS_GRPC_HOST || 'localhost:50051', grpc.credentials.createInsecure());
const call = (method, request) => new Promise((resolve, reject) => {
  client[method](request, (error, response) => { if (error) reject(error); else resolve(response); });
});
module.exports = {
  createPatient: (d) => call('CreatePatient', d),
  getPatient: (d) => call('GetPatient', d),
  updatePatient: (d) => call('UpdatePatient', d),
  deletePatient: (d) => call('DeletePatient', d),
  listPatients: (d) => call('ListPatients', d),
  searchPatients: (d) => call('SearchPatients', d),
};
