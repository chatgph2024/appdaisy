import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Patient } from '../types/patient';

const COLLECTION_NAME = 'patients';

export const patientService = {
  async getPatients() {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Patient[];
  },

  async addPatient(patient: Omit<Patient, 'id'>) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), patient);
    return {
      id: docRef.id,
      ...patient
    };
  },

  async updatePatient(id: string, patient: Partial<Patient>) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, patient);
    return {
      id,
      ...patient
    };
  },

  async deletePatient(id: string) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  async searchPatients(searchTerm: string) {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Patient[];
  }
};