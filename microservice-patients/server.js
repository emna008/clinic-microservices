const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../proto/patient.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase:true, longs:String, enums:String, defaults:true, oneofs:true });
const patientProto = grpc.loadPackageDefinition(packageDefinition).patient;
const handlers = require('./handlers/patientHandlers');
const server = new grpc.Server();
server.addService(patientProto.PatientService.service, {
  CreatePatient: handlers.createPatient,
  GetPatient: handlers.getPatient,
  UpdatePatient: handlers.updatePatient,
  DeletePatient: handlers.deletePatient,
  ListPatients: handlers.listPatients,
  SearchPatients: handlers.searchPatients,
});
server.bindAsync(`0.0.0.0:${process.env.PORT||'50051'}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(`[Patients gRPC] Running on port ${port}`);
});
