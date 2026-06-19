const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const PROTO_PATH = path.resolve(__dirname, '../proto/appointment.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase:true, longs:String, enums:String, defaults:true, oneofs:true });
const appointmentProto = grpc.loadPackageDefinition(packageDefinition).appointment;
const handlers = require('./handlers/appointmentHandlers');
const server = new grpc.Server();
server.addService(appointmentProto.AppointmentService.service, {
  CreateAppointment: handlers.createAppointment,
  GetAppointment: handlers.getAppointment,
  UpdateAppointmentStatus: handlers.updateAppointmentStatus,
  ListAppointmentsByPatient: handlers.listAppointmentsByPatient,
  ListAppointmentsByDoctor: handlers.listAppointmentsByDoctor,
  CancelAppointment: handlers.cancelAppointment,
});
server.bindAsync(`0.0.0.0:${process.env.PORT||'50052'}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) { console.error(err); process.exit(1); }
  console.log(`[Appointments gRPC] Running on port ${port}`);
});
