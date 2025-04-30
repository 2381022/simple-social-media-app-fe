import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JadwalLatihan as JadwalLatihanType, getJadwalLatihanById, updateJadwalLatihan } from '../utils/api';
import JadwalLatihanForm from '../components/JadwalLatihanForm';

const EditJadwalLatihanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<JadwalLatihanType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchSchedule(parseInt(id));
    }
  }, [id]);

  const fetchSchedule = async (scheduleId: number) => {
    try {
      const data = await getJadwalLatihanById(scheduleId);
      setSchedule(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: Omit<JadwalLatihanType, 'id' | 'admin'> & { admin_id?: number }) => {
    if (!id) return;
    
    try {
      await updateJadwalLatihan(parseInt(id), data);
      navigate('/jadwal-latihan');
    } catch (err) {
      setError('Failed to update schedule');
      console.error(err);
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!schedule) return <div className="text-center p-4">Schedule not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Jadwal Latihan</h1>
      <JadwalLatihanForm
        initialData={schedule}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditJadwalLatihanPage; 