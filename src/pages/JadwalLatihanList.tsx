import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JadwalLatihan, getJadwalLatihan, deleteJadwalLatihan } from '../utils/api';

const JadwalLatihanList: React.FC = () => {
  const navigate = useNavigate();
  const [jadwalList, setJadwalList] = useState<JadwalLatihan[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      setIsLoading(true);
      const data = await getJadwalLatihan();
      setJadwalList(data);
    } catch (error) {
      console.error('Error fetching jadwal latihan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await deleteJadwalLatihan(id);
        fetchJadwal();
      } catch (error) {
        console.error('Error deleting jadwal latihan:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jadwal Latihan</h1>
        <button
          onClick={() => navigate('/jadwal-latihan/new')}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Schedule
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Tanggal</th>
              <th className="py-2 px-4 border-b">Jam</th>
              <th className="py-2 px-4 border-b">Tempat</th>
              <th className="py-2 px-4 border-b">Admin</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jadwalList.map((jadwal) => (
              <tr key={jadwal.id}>
                <td className="py-2 px-4 border-b">{jadwal.id}</td>
                <td className="py-2 px-4 border-b">{new Date(jadwal.tanggal).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{jadwal.jam}</td>
                <td className="py-2 px-4 border-b">{jadwal.tempat}</td>
                <td className="py-2 px-4 border-b">{jadwal.admin.username}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => navigate(`/jadwal-latihan/edit/${jadwal.id}`)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(jadwal.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JadwalLatihanList; 