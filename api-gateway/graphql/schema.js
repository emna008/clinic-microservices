const { buildSchema } = require('graphql');
const patientClient = require('../grpc/patientClient');
const appointmentClient = require('../grpc/appointmentClient');
const medicalRecordClient = require('../grpc/medicalRecordClient');

const schema = buildSchema(`
  type Patient { id:ID firstName:String lastName:String dateOfBirth:String gender:String phone:String email:String address:String bloodType:String createdAt:String }
  type Appointment { id:ID patientId:String doctorName:String specialty:String dateTime:String reason:String status:String createdAt:String }
  type MedicalRecord { id:ID patientId:String appointmentId:String doctorName:String diagnosis:String notes:String prescriptions:[String] createdAt:String updatedAt:String }
  type PatientFullProfile { patient:Patient appointments:[Appointment] records:[MedicalRecord] }
  type DeleteResult { success:Boolean message:String }
  type PatientsList { patients:[Patient] total:Int }

  type Query {
    patient(id:ID!): Patient
    patients(page:Int, limit:Int): PatientsList
    searchPatients(query:String!): PatientsList
    appointment(id:ID!): Appointment
    appointmentsByPatient(patientId:ID!): [Appointment]
    appointmentsByDoctor(doctorName:String!): [Appointment]
    medicalRecord(id:ID!): MedicalRecord
    recordsByPatient(patientId:ID!): [MedicalRecord]
    patientFullProfile(patientId:ID!): PatientFullProfile
  }

  type Mutation {
    createPatient(firstName:String! lastName:String! dateOfBirth:String gender:String phone:String email:String address:String bloodType:String): Patient
    updatePatient(id:ID! firstName:String lastName:String phone:String email:String address:String): Patient
    deletePatient(id:ID!): DeleteResult
    createAppointment(patientId:ID! doctorName:String! specialty:String dateTime:String! reason:String): Appointment
    updateAppointmentStatus(id:ID! status:String!): Appointment
    cancelAppointment(id:ID!): DeleteResult
    createMedicalRecord(patientId:ID! appointmentId:ID doctorName:String diagnosis:String notes:String): MedicalRecord
    addPrescription(recordId:ID! prescription:String!): MedicalRecord
    updateDiagnosis(recordId:ID! diagnosis:String!): MedicalRecord
  }
`);

const root = {
  patient: ({ id }) => patientClient.getPatient({ id }),
  patients: ({ page=1, limit=10 }) => patientClient.listPatients({ page, limit }),
  searchPatients: ({ query }) => patientClient.searchPatients({ query }),
  appointment: ({ id }) => appointmentClient.getAppointment({ id }),
  appointmentsByPatient: async ({ patientId }) => (await appointmentClient.listAppointmentsByPatient({ patientId })).appointments,
  appointmentsByDoctor: async ({ doctorName }) => (await appointmentClient.listAppointmentsByDoctor({ doctorName })).appointments,
  medicalRecord: ({ id }) => medicalRecordClient.getRecord({ id }),
  recordsByPatient: async ({ patientId }) => (await medicalRecordClient.getRecordsByPatient({ patientId })).records,
  patientFullProfile: async ({ patientId }) => {
    const [patient, apptResult, recResult] = await Promise.all([
      patientClient.getPatient({ id: patientId }),
      appointmentClient.listAppointmentsByPatient({ patientId }),
      medicalRecordClient.getRecordsByPatient({ patientId }),
    ]);
    return { patient, appointments: apptResult.appointments, records: recResult.records };
  },
  createPatient: (args) => patientClient.createPatient(args),
  updatePatient: (args) => patientClient.updatePatient(args),
  deletePatient: ({ id }) => patientClient.deletePatient({ id }),
  createAppointment: (args) => appointmentClient.createAppointment(args),
  updateAppointmentStatus: ({ id, status }) => appointmentClient.updateAppointmentStatus({ id, status }),
  cancelAppointment: ({ id }) => appointmentClient.cancelAppointment({ id }),
  createMedicalRecord: (args) => medicalRecordClient.createRecord(args),
  addPrescription: ({ recordId, prescription }) => medicalRecordClient.addPrescription({ recordId, prescription }),
  updateDiagnosis: ({ recordId, diagnosis }) => medicalRecordClient.updateDiagnosis({ recordId, diagnosis }),
};

module.exports = { schema, root };
