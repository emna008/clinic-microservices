const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { publishPatientRegistered } = require('../kafka/producer');
const grpc = require('@grpc/grpc-js');

const createPatient = async (call, callback) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, phone, email, address, bloodType } = call.request;
    if (!firstName || !lastName) return callback({ code: grpc.status.INVALID_ARGUMENT, message: 'firstName and lastName are required' });
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    db.prepare(`INSERT INTO patients (id,firstName,lastName,dateOfBirth,gender,phone,email,address,bloodType,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)`)
      .run(id, firstName, lastName, dateOfBirth||'', gender||'', phone||'', email||'', address||'', bloodType||'', createdAt);
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
    await publishPatientRegistered(patient);
    callback(null, patient);
  } catch (error) {
    callback({ code: grpc.status.INTERNAL, message: error.message });
  }
};

const getPatient = (call, callback) => {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(call.request.id);
    if (!patient) return callback({ code: grpc.status.NOT_FOUND, message: `Patient ${call.request.id} not found` });
    callback(null, patient);
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const updatePatient = (call, callback) => {
  try {
    const { id, firstName, lastName, phone, email, address } = call.request;
    const existing = db.prepare('SELECT * FROM patients WHERE id = ?').get(id);
    if (!existing) return callback({ code: grpc.status.NOT_FOUND, message: `Patient ${id} not found` });
    db.prepare(`UPDATE patients SET firstName=COALESCE(NULLIF(?,''),firstName), lastName=COALESCE(NULLIF(?,''),lastName), phone=COALESCE(NULLIF(?,''),phone), email=COALESCE(NULLIF(?,''),email), address=COALESCE(NULLIF(?,''),address) WHERE id=?`)
      .run(firstName, lastName, phone, email, address, id);
    callback(null, db.prepare('SELECT * FROM patients WHERE id = ?').get(id));
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const deletePatient = (call, callback) => {
  try {
    const existing = db.prepare('SELECT * FROM patients WHERE id = ?').get(call.request.id);
    if (!existing) return callback({ code: grpc.status.NOT_FOUND, message: `Patient ${call.request.id} not found` });
    db.prepare('DELETE FROM patients WHERE id = ?').run(call.request.id);
    callback(null, { success: true, message: 'Patient supprimé avec succès' });
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const listPatients = (call, callback) => {
  try {
    const page = call.request.page || 1;
    const limit = call.request.limit || 10;
    const offset = (page - 1) * limit;
    const patients = db.prepare('SELECT * FROM patients LIMIT ? OFFSET ?').all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM patients').get().count;
    callback(null, { patients, total });
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const searchPatients = (call, callback) => {
  try {
    const q = `%${call.request.query}%`;
    const patients = db.prepare(`SELECT * FROM patients WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ?`).all(q, q, q);
    callback(null, { patients, total: patients.length });
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

module.exports = { createPatient, getPatient, updatePatient, deletePatient, listPatients, searchPatients };
