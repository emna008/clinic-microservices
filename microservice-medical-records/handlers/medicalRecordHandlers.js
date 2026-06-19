const { v4: uuidv4 } = require('uuid');
const { getCollection } = require('../db');
const grpc = require('@grpc/grpc-js');

const createRecord = async (call, callback) => {
  try {
    const { patientId, appointmentId, doctorName, diagnosis, notes, prescriptions } = call.request;
    if (!patientId) return callback({ code: grpc.status.INVALID_ARGUMENT, message: 'patientId is required' });
    const collection = await getCollection();
    const now = new Date().toISOString();
    const doc = await collection.insert({ id: uuidv4(), patientId, appointmentId: appointmentId||'', doctorName: doctorName||'', diagnosis: diagnosis||'', notes: notes||'', prescriptions: prescriptions||[], createdAt: now, updatedAt: now });
    callback(null, doc.toJSON());
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const getRecord = async (call, callback) => {
  try {
    const collection = await getCollection();
    const doc = await collection.findOne(call.request.id).exec();
    if (!doc) return callback({ code: grpc.status.NOT_FOUND, message: `Record ${call.request.id} not found` });
    callback(null, doc.toJSON());
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const getRecordsByPatient = async (call, callback) => {
  try {
    const collection = await getCollection();
    const docs = await collection.find({ selector: { patientId: { $eq: call.request.patientId } } }).exec();
    callback(null, { records: docs.map(d => d.toJSON()) });
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const addPrescription = async (call, callback) => {
  try {
    const collection = await getCollection();
    const doc = await collection.findOne(call.request.recordId).exec();
    if (!doc) return callback({ code: grpc.status.NOT_FOUND, message: `Record ${call.request.recordId} not found` });
    const updated = await doc.patch({ prescriptions: [...doc.prescriptions, call.request.prescription], updatedAt: new Date().toISOString() });
    callback(null, updated.toJSON());
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

const updateDiagnosis = async (call, callback) => {
  try {
    const collection = await getCollection();
    const doc = await collection.findOne(call.request.recordId).exec();
    if (!doc) return callback({ code: grpc.status.NOT_FOUND, message: `Record ${call.request.recordId} not found` });
    const updated = await doc.patch({ diagnosis: call.request.diagnosis, updatedAt: new Date().toISOString() });
    callback(null, updated.toJSON());
  } catch (error) { callback({ code: grpc.status.INTERNAL, message: error.message }); }
};

module.exports = { createRecord, getRecord, getRecordsByPatient, addPrescription, updateDiagnosis };
