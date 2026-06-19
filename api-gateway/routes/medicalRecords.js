const express = require('express');
const router = express.Router();
const medicalRecordClient = require('../grpc/medicalRecordClient');

router.post('/', async (req, res) => {
  try { res.status(201).json(await medicalRecordClient.createRecord(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/patient/:patientId', async (req, res) => {
  try { res.json(await medicalRecordClient.getRecordsByPatient({ patientId: req.params.patientId })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/:id', async (req, res) => {
  try { res.json(await medicalRecordClient.getRecord({ id: req.params.id })); }
  catch (e) { res.status(e.code===5?404:500).json({ error: e.message }); }
});
router.patch('/:id/prescription', async (req, res) => {
  try { res.json(await medicalRecordClient.addPrescription({ recordId: req.params.id, prescription: req.body.prescription })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.patch('/:id/diagnosis', async (req, res) => {
  try { res.json(await medicalRecordClient.updateDiagnosis({ recordId: req.params.id, diagnosis: req.body.diagnosis })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
module.exports = router;
