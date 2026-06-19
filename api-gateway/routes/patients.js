const express = require('express');
const router = express.Router();
const patientClient = require('../grpc/patientClient');

router.post('/', async (req, res) => {
  try { res.status(201).json(await patientClient.createPatient(req.body)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/', async (req, res) => {
  try {
    const { page=1, limit=10 } = req.query;
    res.json(await patientClient.listPatients({ page: parseInt(page), limit: parseInt(limit) }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/search', async (req, res) => {
  try { res.json(await patientClient.searchPatients({ query: req.query.q || '' })); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
router.get('/:id', async (req, res) => {
  try { res.json(await patientClient.getPatient({ id: req.params.id })); }
  catch (e) { res.status(e.code===5?404:500).json({ error: e.code===5?'Patient non trouvé':e.message }); }
});
router.put('/:id', async (req, res) => {
  try { res.json(await patientClient.updatePatient({ id: req.params.id, ...req.body })); }
  catch (e) { res.status(e.code===5?404:500).json({ error: e.message }); }
});
router.delete('/:id', async (req, res) => {
  try { res.json(await patientClient.deletePatient({ id: req.params.id })); }
  catch (e) { res.status(e.code===5?404:500).json({ error: e.message }); }
});
module.exports = router;
