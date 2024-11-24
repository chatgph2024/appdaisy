import PatientList from '../components/PatientList';
import VoiceAssistant from '../components/VoiceAssistant';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function Patients() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Patients
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            A list of all patients in your practice including their name, medical record number, and status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Add patient
          </button>
        </div>
      </div>
      <PatientList />
      <VoiceAssistant />
    </div>
  );
}