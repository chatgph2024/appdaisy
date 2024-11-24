import { create } from 'zustand';
import { Patient } from '../types/patient';
import { patientService } from '../services/patientService';

interface PatientStore {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  searchPatients: (searchTerm: string) => Promise<void>;
}

export const usePatientStore = create<PatientStore>((set) => ({
  patients: [],
  loading: false,
  error: null,

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const patients = await patientService.getPatients();
      set({ patients, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch patients', loading: false });
    }
  },

  addPatient: async (patient) => {
    set({ loading: true, error: null });
    try {
      const newPatient = await patientService.addPatient(patient);
      set((state) => ({
        patients: [...state.patients, newPatient],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add patient', loading: false });
    }
  },

  updatePatient: async (id, patient) => {
    set({ loading: true, error: null });
    try {
      await patientService.updatePatient(id, patient);
      set((state) => ({
        patients: state.patients.map(p => 
          p.id === id ? { ...p, ...patient } : p
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update patient', loading: false });
    }
  },

  deletePatient: async (id) => {
    set({ loading: true, error: null });
    try {
      await patientService.deletePatient(id);
      set((state) => ({
        patients: state.patients.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete patient', loading: false });
    }
  },

  searchPatients: async (searchTerm) => {
    set({ loading: true, error: null });
    try {
      const patients = await patientService.searchPatients(searchTerm);
      set({ patients, loading: false });
    } catch (error) {
      set({ error: 'Failed to search patients', loading: false });
    }
  }
}));