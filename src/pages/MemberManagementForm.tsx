import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMemberManagementById, createMemberManagement, updateMemberManagement, getMembers, getJadwalLatihan } from '../utils/api';

interface FormData {
  member_id: number;
  role: string;
  assigned_by_id: number;
  jadwal_id: number;
}

const MemberManagementForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>({
    member_id: 0,
    role: '',
    assigned_by_id: 1, // This should be replaced with the actual admin ID from the auth context
    jadwal_id: 0
  });
  const [members, setMembers] = useState<{ id: number; username: string }[]>([]);
  const [jadwals, setJadwals] = useState<{ id: number; tanggal: string; jam: string; tempat: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchJadwals();
    if (id) {
      fetchManagement();
    }
  }, [id]);

  const fetchMembers = async () => {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchJadwals = async () => {
    try {
      const data = await getJadwalLatihan();
      setJadwals(data);
    } catch (error) {
      console.error('Error fetching jadwals:', error);
    }
  };

  const fetchManagement = async () => {
    try {
      setIsLoading(true);
      const data = await getMemberManagementById(Number(id));
      setFormData({
        member_id: data.member.id,
        role: data.role,
        assigned_by_id: data.assigned_by.id,
        jadwal_id: data.jadwal_id || 0
      });
    } catch (error) {
      console.error('Error fetching member management:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (id) {
        await updateMemberManagement(Number(id), formData);
      } else {
        await createMemberManagement(formData);
      }
      navigate('/member-management');
    } catch (error) {
      console.error('Error saving member management:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'member_id' || name === 'jadwal_id' ? Number(value) : value }));
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id ? 'Edit Member Management' : 'Assign New Role'}
        </h1>
        <button
          onClick={() => navigate('/member-management')}
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
            value={formData.member_id}
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
            Jadwal Latihan
          </label>
          <select
            id="jadwal_id"
            name="jadwal_id"
            value={formData.jadwal_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Select a jadwal</option>
            {jadwals.map(jadwal => (
              <option key={jadwal.id} value={jadwal.id}>
                {new Date(jadwal.tanggal).toLocaleDateString()} - {jadwal.jam} at {jadwal.tempat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter role"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {id ? 'Update' : 'Create'} Assignment
        </button>
      </form>
    </div>
  );
};

export default MemberManagementForm; 