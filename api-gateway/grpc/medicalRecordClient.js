const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../../proto/medical_record.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase:true, longs:String, enums:String, defaults:true, oneofs:true });
const medicalRecordProto = grpc.loadPackageDefinition(packageDefinition).medicalrecord;
const client = new medicalRecordProto.MedicalRecordService(process.env.MEDICAL_RECORDS_GRPC_HOST || 'localhost:50053', grpc.credentials.createInsecure());
const call = (method, request) => new Promise((resolve, reject) => {
  client[method](request, (error, response) => { if (error) reject(error); else resolve(response); });
});
module.exports = {
  createRecord: (d) => call('CreateRecord', d),
  getRecord: (d) => call('GetRecord', d),
  getRecordsByPatient: (d) => call('GetRecordsByPatient', d),
  addPrescription: (d) => call('AddPrescription', d),
  updateDiagnosis: (d) => call('UpdateDiagnosis', d),
};
