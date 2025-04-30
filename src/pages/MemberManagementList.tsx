import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMemberManagementList, deleteMemberManagement, MemberManagement } from '../utils/api';

const MemberManagementList: React.FC = () => {
  const navigate = useNavigate();
  const [managements, setManagements] = useState<MemberManagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchManagements();
  }, []);

  const fetchManagements = async () => {
    try {
      setIsLoading(true);
      const data = await getMemberManagementList();
      setManagements(data);
    } catch (error) {
      console.error('Error fetching member managements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteMemberManagement(id);
        fetchManagements();
      } catch (error) {
        console.error('Error deleting member management:', error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Member Management</h1>
        <button
          onClick={() => navigate('/member-management/new')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Assign New Role
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
                Role
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Assigned By
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Assigned At
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {managements.map((management) => (
              <tr key={management.id}>
                <td className="px-6 py-4 border-b border-gray-300">
                  {management.member.username}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {management.role}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {management.assigned_by.username}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {new Date(management.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <button
                    onClick={() => navigate(`/member-management/edit/${management.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(management.id)}
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

export default MemberManagementList; 