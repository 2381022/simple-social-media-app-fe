import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JadwalLatihan as JadwalLatihanType, getJadwalLatihan, deleteJadwalLatihan, createJadwalLatihan } from '../utils/api';
import JadwalLatihanForm from '../components/JadwalLatihanForm';

const JadwalLatihanPage: React.FC = () => {
  const [schedules, setSchedules] = useState<JadwalLatihanType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const data = await getJadwalLatihan();
      setSchedules(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schedules');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteJadwalLatihan(id);
        setSchedules(schedules.filter(schedule => schedule.id !== id));
      } catch (err) {
        setError('Failed to delete schedule');
        console.error(err);
      }
    }
  };

  const handleCreate = async (data: Omit<JadwalLatihanType, 'id' | 'admin'>) => {
    try {
      await createJadwalLatihan(data);
      fetchSchedules(); // Refresh the list
    } catch (err) {
      setError('Failed to create schedule');
      console.error(err);
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Jadwal Latihan</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Schedule</h2>
        <JadwalLatihanForm onSubmit={handleCreate} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="border rounded-lg p-4 shadow">
            <h3 className="font-bold text-lg mb-2">
              {new Date(schedule.tanggal).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <p className="text-gray-600 mb-1">Jam: {schedule.jam}</p>
            <p className="text-gray-600 mb-2">Tempat: {schedule.tempat}</p>
            <p className="text-sm text-gray-500">
              Created by: {schedule.admin.username}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate(`/jadwal-latihan/edit/${schedule.id}`)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(schedule.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JadwalLatihanPage; 