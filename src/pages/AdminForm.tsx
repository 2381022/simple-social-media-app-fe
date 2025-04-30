import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminById, createAdmin, updateAdmin } from '../utils/api';
import { motion } from 'framer-motion';

interface FormData {
  username: string;
  password: string;
}

const AdminForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAdmin();
    }
  }, [id]);

  const fetchAdmin = async () => {
    try {
      setIsLoading(true);
      const admin = await getAdminById(Number(id));
      setFormData({
        username: admin.username,
        password: '' // Don't pre-fill password for security
      });
    } catch (error) {
      console.error('Error fetching admin:', error);
      setError('Failed to fetch admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (id) {
        await updateAdmin(Number(id), formData);
      } else {
        await createAdmin(formData);
      }
      navigate('/admins');
    } catch (error) {
      console.error('Error saving admin:', error);
      setError('Failed to save admin data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-emerald-500 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">
        {id ? 'Edit Admin' : 'Create New Admin'}
      </h1>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="username" className="block text-emerald-400 text-sm font-bold mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="bg-gray-900 shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-emerald-400 text-sm font-bold mb-2">
            {id ? 'New Password (leave blank to keep current)' : 'Password'}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!id}
            className="bg-gray-900 shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admins')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none transition-colors duration-200"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none transition-colors duration-200"
          >
            {isLoading ? 'Saving...' : id ? 'Update Admin' : 'Create Admin'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AdminForm; 