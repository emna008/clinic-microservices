const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { publishAppointmentCreated } = require('../kafka/producer');
const grpc = require('@grpc/grpc-js');

const createAppointment = async (call, callback) => {
  try {
    const { patientId, doctorName, specialty, dateTime, reason } = call.request;
    if (!patientId || !doctorName || !dateTime) return callback({ code: grpc.status.INVALID_ARGUMENT, message: 'patientId, doctorName, dateTime are required' });
    const id = uuidv4(); const createdAt = new Date().toISOString();
    db.prepare(`INSERT INTO appointments (id,patientId,doctorName,specialty,dateTime,reason,status,createdAt) VALUES (?,?,?,?,?,?,'scheduled',?)`)
      .run(id, patientId, doctorName, specialty||'', dateTime, reason||'', createdAt);
    const appointment = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    await publishAppointmentCreated(appointment);
    callback(null, appointment);
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const getAppointment = (call, callback) => {
  try {
    const a = db.prepare('SELECT * FROM appointments WHERE id = ?').get(call.request.id);
    if (!a) return callback({ code: grpc.status.NOT_FOUND, message: `Appointment ${call.request.id} not found` });
    callback(null, a);
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const updateAppointmentStatus = (call, callback) => {
  try {
    const { id, status } = call.request;
    const valid = ['scheduled','completed','cancelled'];
    if (!valid.includes(status)) return callback({ code: grpc.status.INVALID_ARGUMENT, message: `Status must be: ${valid.join(', ')}` });
    const existing = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
    if (!existing) return callback({ code: grpc.status.NOT_FOUND, message: `Appointment ${id} not found` });
    db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, id);
    callback(null, db.prepare('SELECT * FROM appointments WHERE id = ?').get(id));
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const listAppointmentsByPatient = (call, callback) => {
  try {
    const appointments = db.prepare('SELECT * FROM appointments WHERE patientId = ?').all(call.request.patientId);
    callback(null, { appointments });
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const listAppointmentsByDoctor = (call, callback) => {
  try {
    const appointments = db.prepare('SELECT * FROM appointments WHERE doctorName = ?').all(call.request.doctorName);
    callback(null, { appointments });
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const cancelAppointment = (call, callback) => {
  try {
    const existing = db.prepare('SELECT * FROM appointments WHERE id = ?').get(call.request.id);
    if (!existing) return callback({ code: grpc.status.NOT_FOUND, message: `Appointment ${call.request.id} not found` });
    db.prepare("UPDATE appointments SET status='cancelled' WHERE id=?").run(call.request.id);
    callback(null, { success: true, message: 'Rendez-vous annulé' });
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

module.exports = { createAppointment, getAppointment, updateAppointmentStatus, listAppointmentsByPatient, listAppointmentsByDoctor, cancelAppointment };
