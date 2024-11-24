import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const activityService = {
  async logActivity(activity: {
    type: 'note' | 'visit' | 'prescription';
    patientName: string;
    description: string;
  }) {
    return addDoc(collection(db, 'activities'), {
      ...activity,
      timestamp: serverTimestamp()
    });
  }
};