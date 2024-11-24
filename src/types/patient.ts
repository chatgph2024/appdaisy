export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
  medicalRecordNumber: string;
}