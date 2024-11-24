import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

interface Activity {
  id: string;
  type: 'note' | 'visit' | 'prescription';
  patientName: string;
  description: string;
  timestamp: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newActivities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      setActivities(newActivities);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li key={activity.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === 'note' ? 'bg-blue-100' :
                      activity.type === 'visit' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <span className={`text-sm ${
                        activity.type === 'note' ? 'text-blue-600' :
                        activity.type === 'visit' ? 'text-green-600' : 'text-purple-600'
                      }`}>
                        {activity.type[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{activity.patientName}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}