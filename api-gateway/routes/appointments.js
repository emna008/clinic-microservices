const express = require('express');
const router = express.Router();
const appointmentClient = require('../grpc/appointmentClient');

router.post('/', async (req, res) => {
  try { res.status(201).json(await appointmentClient.createAppointment(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/patient/:patientId', async (req, res) => {
  try { res.json(await appointmentClient.listAppointmentsByPatient({ patientId: req.params.patientId })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/doctor/:doctorName', async (req, res) => {
  try { res.json(await appointmentClient.listAppointmentsByDoctor({ doctorName: req.params.doctorName })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/:id', async (req, res) => {
  try { res.json(await appointmentClient.getAppointment({ id: req.params.id })); }
  catch (e) { res.status(e.code===5?404:500).json({ error: e.message }); }
});
router.patch('/:id/status', async (req, res) => {
  try { res.json(await appointmentClient.updateAppointmentStatus({ id: req.params.id, status: req.body.status })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.delete('/:id', async (req, res) => {
  try { res.json(await appointmentClient.cancelAppointment({ id: req.params.id })); }
  catch (e) { res.status(e.code===5?404:500).json({ error: e.message }); }
});
module.exports = router;
