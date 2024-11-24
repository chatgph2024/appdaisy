import { useEffect, useState } from 'react';
import { MicrophoneIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useVoiceCommands } from '../hooks/useVoiceCommands';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const { commands } = useVoiceCommands();

  const processCommand = async (transcript: string) => {
    setProcessing(true);
    try {
      for (const command of commands) {
        for (const keyword of command.keywords) {
          if (transcript.toLowerCase().includes(keyword.toLowerCase())) {
            await command.action(transcript);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error processing command:', error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        if (event.results[current].isFinal) {
          processCommand(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, [commands]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setTranscript('');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-900">Voice Assistant</h3>
          <p className="text-xs text-gray-500">Try saying:</p>
          <ul className="text-xs text-gray-500 mt-1 list-disc list-inside">
            <li>"Search for patient John"</li>
            <li>"Add new patient"</li>
            <li>"Take note: Patient reported improvement"</li>
          </ul>
        </div>
        
        {transcript && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">{transcript}</p>
            {processing && (
              <div className="flex items-center mt-2">
                <ArrowPathIcon className="h-4 w-4 text-gray-400 animate-spin mr-2" />
                <span className="text-xs text-gray-500">Processing command...</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={isListening ? stopListening : startListening}
          className={`${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'
          } text-white rounded-full p-3 transition-colors duration-200 flex items-center justify-center`}
        >
          {isListening ? (
            <StopIcon className="h-6 w-6" />
          ) : (
            <MicrophoneIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}