import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJadwalLatihanById, createJadwalLatihan, updateJadwalLatihan, getAdmins } from '../utils/api';

interface FormData {
  tanggal: string;
  jam: string;
  tempat: string;
  admin_id: number | null;
}

const JadwalLatihanForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>({
    tanggal: '',
    jam: '',
    tempat: '',
    admin_id: null
  });
  const [admins, setAdmins] = useState<{ id: number; username: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
    if (id) {
      fetchJadwal();
    }
  }, [id]);

  const fetchAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
      // If this is a new form and we have admins, set the first admin as default
      if (!id && data.length > 0) {
        setFormData(prev => ({ ...prev, admin_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const fetchJadwal = async () => {
    try {
      setIsLoading(true);
      const data = await getJadwalLatihanById(Number(id));
      setFormData({
        tanggal: new Date(data.tanggal).toISOString().split('T')[0],
        jam: data.jam,
        tempat: data.tempat,
        admin_id: data.admin.id
      });
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      if (formData.admin_id === null) {
        throw new Error('Please select an admin');
      }

      const dataToSubmit = {
        ...formData,
        tanggal: new Date(formData.tanggal),
        admin_id: formData.admin_id
      };

      if (id) {
        await updateJadwalLatihan(Number(id), dataToSubmit);
      } else {
        await createJadwalLatihan(dataToSubmit);
      }
      navigate('/jadwal-latihan');
    } catch (error) {
      console.error('Error saving jadwal:', error);
      alert(error instanceof Error ? error.message : 'Failed to save schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'admin_id' ? Number(value) : value 
    }));
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id ? 'Edit Jadwal Latihan' : 'Create Jadwal Latihan'}
        </h1>
        <button
          onClick={() => navigate('/jadwal-latihan')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tanggal">
            Tanggal
          </label>
          <input
            type="date"
            id="tanggal"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jam">
            Jam
          </label>
          <input
            type="time"
            id="jam"
            name="jam"
            value={formData.jam}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tempat">
            Tempat
          </label>
          <input
            type="text"
            id="tempat"
            name="tempat"
            value={formData.tempat}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter tempat"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="admin_id">
            Admin
          </label>
          <select
            id="admin_id"
            name="admin_id"
            value={formData.admin_id || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select an admin</option>
            {admins.map(admin => (
              <option key={admin.id} value={admin.id}>
                {admin.username}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {id ? 'Update' : 'Create'} Jadwal
        </button>
      </form>
    </div>
  );
};

export default JadwalLatihanForm; 