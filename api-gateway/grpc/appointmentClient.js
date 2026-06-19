const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../../proto/appointment.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase:true, longs:String, enums:String, defaults:true, oneofs:true });
const appointmentProto = grpc.loadPackageDefinition(packageDefinition).appointment;
const client = new appointmentProto.AppointmentService(process.env.APPOINTMENTS_GRPC_HOST || 'localhost:50052', grpc.credentials.createInsecure());
const call = (method, request) => new Promise((resolve, reject) => {
  client[method](request, (error, response) => { if (error) reject(error); else resolve(response); });
});
module.exports = {
  createAppointment: (d) => call('CreateAppointment', d),
  getAppointment: (d) => call('GetAppointment', d),
  updateAppointmentStatus: (d) => call('UpdateAppointmentStatus', d),
  listAppointmentsByPatient: (d) => call('ListAppointmentsByPatient', d),
  listAppointmentsByDoctor: (d) => call('ListAppointmentsByDoctor', d),
  cancelAppointment: (d) => call('CancelAppointment', d),
};
