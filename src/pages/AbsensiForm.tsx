import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAbsensiById, createAbsensi, updateAbsensi, getMembers, getJadwalLatihan } from '../utils/api';

interface FormData {
  member_id: number | null;
  jadwal_id: number | null;
  status: 'HADIR' | 'TIDAK_HADIR' | 'IZIN';
  keterangan: string;
}

const AbsensiForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>({
    member_id: null,
    jadwal_id: null,
    status: 'HADIR',
    keterangan: ''
  });
  const [members, setMembers] = useState<{ id: number; username: string }[]>([]);
  const [jadwalList, setJadwalList] = useState<{ id: number; tanggal: string; jam: string; tempat: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
    if (id) {
      fetchAbsensi();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [membersData, jadwalData] = await Promise.all([
        getMembers(),
        getJadwalLatihan()
      ]);
      setMembers(membersData);
      setJadwalList(jadwalData);
      
      // If this is a new form and we have data, set the first items as default
      if (!id && membersData.length > 0 && jadwalData.length > 0) {
        setFormData(prev => ({
          ...prev,
          member_id: membersData[0].id,
          jadwal_id: jadwalData[0].id
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAbsensi = async () => {
    try {
      setIsLoading(true);
      const data = await getAbsensiById(Number(id));
      setFormData({
        member_id: data.member.id,
        jadwal_id: data.jadwal.id,
        status: data.status,
        keterangan: data.keterangan || ''
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      if (formData.member_id === null || formData.jadwal_id === null) {
        throw new Error('Please select both member and schedule');
      }

      const dataToSubmit = {
        ...formData,
        member_id: formData.member_id,
        jadwal_id: formData.jadwal_id
      };

      if (id) {
        await updateAbsensi(Number(id), {
          status: dataToSubmit.status,
          keterangan: dataToSubmit.keterangan
        });
      } else {
        await createAbsensi(dataToSubmit);
      }
      navigate('/absensi');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert(error instanceof Error ? error.message : 'Failed to save attendance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'member_id' || name === 'jadwal_id' ? Number(value) : value
    }));
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id ? 'Edit Attendance' : 'Create Attendance'}
        </h1>
        <button
          onClick={() => navigate('/absensi')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="member_id">
            Member
          </label>
          <select
            id="member_id"
            name="member_id"
            value={formData.member_id || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a member</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>
                {member.username}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jadwal_id">
            Schedule
          </label>
          <select
            id="jadwal_id"
            name="jadwal_id"
            value={formData.jadwal_id || ''}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a schedule</option>
            {jadwalList.map(jadwal => (
              <option key={jadwal.id} value={jadwal.id}>
                {new Date(jadwal.tanggal).toLocaleDateString()} - {jadwal.jam} at {jadwal.tempat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="HADIR">Present</option>
            <option value="TIDAK_HADIR">Absent</option>
            <option value="IZIN">Permission</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="keterangan">
            Notes
          </label>
          <textarea
            id="keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
            placeholder="Enter notes (optional)"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {id ? 'Update' : 'Create'} Attendance
        </button>
      </form>
    </div>
  );
};

export default AbsensiForm; 