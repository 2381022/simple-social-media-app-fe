import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Member, getMemberById, createMember, updateMember } from '../utils/api';
import MemberForm from '../components/MemberForm';

const MemberFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMember();
    }
  }, [id]);

  const fetchMember = async () => {
    try {
      setIsLoading(true);
      const data = await getMemberById(Number(id));
      setMember(data);
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: Omit<Member, 'id'>) => {
    try {
      setIsLoading(true);
      if (id) {
        await updateMember(Number(id), formData);
      } else {
        await createMember(formData);
      }
      navigate('/members');
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id ? 'Edit Member' : 'Create New Member'}
        </h1>
        <button
          onClick={() => navigate('/members')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to List
        </button>
      </div>
      <MemberForm
        initialData={member || undefined}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default MemberFormPage; 