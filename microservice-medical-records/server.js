const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../proto/medical_record.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase:true, longs:String, enums:String, defaults:true, oneofs:true });
const medicalRecordProto = grpc.loadPackageDefinition(packageDefinition).medicalrecord;
const handlers = require('./handlers/medicalRecordHandlers');
const server = new grpc.Server();
server.addService(medicalRecordProto.MedicalRecordService.service, {
  CreateRecord: handlers.createRecord,
  GetRecord: handlers.getRecord,
  GetRecordsByPatient: handlers.getRecordsByPatient,
  AddPrescription: handlers.addPrescription,
  UpdateDiagnosis: handlers.updateDiagnosis,
});
server.bindAsync(`0.0.0.0:${process.env.PORT||'50053'}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(`[Medical Records gRPC] Running on port ${port}`);
});
