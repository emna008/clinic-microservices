const { createRxDatabase } = require('rxdb');
const { getRxStorageMemory } = require('rxdb/plugins/storage-memory');

const schema = {
  version: 0, primaryKey: 'id', type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    patientId: { type: 'string', maxLength: 100 },
    appointmentId: { type: 'string', maxLength: 100 },
    doctorName: { type: 'string', maxLength: 200 },
    diagnosis: { type: 'string', maxLength: 2000 },
    notes: { type: 'string', maxLength: 5000 },
    prescriptions: { type: 'array', items: { type: 'string' } },
    createdAt: { type: 'string', maxLength: 50 },
    updatedAt: { type: 'string', maxLength: 50 },
  },
  required: ['id', 'patientId'],
};

let collection = null;
const getCollection = async () => {
  if (collection) return collection;
  const db = await createRxDatabase({ name: 'clinic_records', storage: getRxStorageMemory(), ignoreDuplicate: true });
  await db.addCollections({ medicalrecords: { schema } });
  collection = db.medicalrecords;
  console.log('[Medical Records DB] RxDB initialized');
  return collection;
};
module.exports = { getCollection };
