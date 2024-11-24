import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientStore } from '../stores/usePatientStore';
import { activityService } from '../services/activityService';

export function useVoiceCommands() {
  const navigate = useNavigate();
  const { searchPatients } = usePatientStore();

  const handleSearchCommand = useCallback(async (transcript: string) => {
    const searchTerm = transcript.replace(/search for patient|search patient|find patient/i, '').trim();
    if (searchTerm) {
      await searchPatients(searchTerm);
      await activityService.logActivity({
        type: 'note',
        patientName: 'System',
        description: `Voice search performed for: ${searchTerm}`
      });
    }
  }, [searchPatients]);

  const handleNewPatientCommand = useCallback(() => {
    navigate('/patients/new');
  }, [navigate]);

  const handleNoteCommand = useCallback(async (transcript: string) => {
    const noteText = transcript.replace(/take note|create note|new note/i, '').trim();
    if (noteText) {
      await activityService.logActivity({
        type: 'note',
        patientName: 'Voice Note',
        description: noteText
      });
    }
  }, []);

  return {
    commands: [
      {
        keywords: ['search for patient', 'search patient', 'find patient'],
        action: handleSearchCommand
      },
      {
        keywords: ['new patient', 'add patient', 'create patient'],
        action: handleNewPatientCommand
      },
      {
        keywords: ['take note', 'create note', 'new note'],
        action: handleNoteCommand
      }
    ]
  };
}