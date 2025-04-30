import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAbsensiList, deleteAbsensi, Absensi } from '../utils/api';

const AbsensiList: React.FC = () => {
  const navigate = useNavigate();
  const [absensiList, setAbsensiList] = useState<Absensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAbsensiList();
  }, []);

  const fetchAbsensiList = async () => {
    try {
      setIsLoading(true);
      const data = await getAbsensiList();
      setAbsensiList(data);
    } catch (error) {
      console.error('Error fetching attendance list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await deleteAbsensi(id);
        fetchAbsensiList();
      } catch (error) {
        console.error('Error deleting attendance:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HADIR':
        return 'bg-green-100 text-green-800';
      case 'TIDAK_HADIR':
        return 'bg-red-100 text-red-800';
      case 'IZIN':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Attendance List</h1>
        <button
          onClick={() => navigate('/absensi/new')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Attendance
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {absensiList.map((absensi) => (
              <tr key={absensi.id}>
                <td className="px-6 py-4 border-b border-gray-300">
                  {absensi.member.username}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <div>
                    <div>{new Date(absensi.jadwal.tanggal).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">
                      {absensi.jadwal.jam} at {absensi.jadwal.tempat}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(absensi.status)}`}>
                    {absensi.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {absensi.keterangan || '-'}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {new Date(absensi.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <button
                    onClick={() => navigate(`/absensi/edit/${absensi.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(absensi.id)}
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

export default AbsensiList; 