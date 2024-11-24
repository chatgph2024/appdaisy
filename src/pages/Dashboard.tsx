import { useState, useEffect } from 'react';
import { usePatientStore } from '../stores/usePatientStore';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Spinner } from '../components/Spinner';
import RecentActivity from '../components/RecentActivity';

export default function Dashboard() {
  const { patients, loading, fetchPatients } = usePatientStore();
  const [stats, setStats] = useState({
    totalPatients: 0,
    notesToday: 0,
    pendingReviews: 0,
    averageNoteTime: '0'
  });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (patients.length > 0) {
      const today = format(new Date(), 'yyyy-MM-dd');
      setStats({
        totalPatients: patients.length,
        notesToday: patients.filter(p => format(new Date(p.lastVisit), 'yyyy-MM-dd') === today).length,
        pendingReviews: Math.floor(Math.random() * 5), // This would come from notes service in production
        averageNoteTime: '15m'
      });
    }
  }, [patients]);

  const statCards = [
    { name: 'Total Patients', value: stats.totalPatients, icon: UserGroupIcon },
    { name: 'Notes Today', value: stats.notesToday, icon: DocumentTextIcon },
    { name: 'Pending Reviews', value: stats.pendingReviews, icon: ChartBarIcon },
    { name: 'Average Note Time', value: stats.averageNoteTime, icon: ClockIcon },
  ];

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        Welcome Back, Dr. Smith
      </h2>
      
      {/* Stats Grid */}
      <div className="mt-8">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <RecentActivity />
      </div>
    </div>
  );
}