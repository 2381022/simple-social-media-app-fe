import React, { useState, useEffect } from 'react';
import { JadwalLatihan } from '../utils/api';

interface JadwalLatihanFormProps {
  initialData?: Partial<JadwalLatihan>;
  onSubmit: (data: Omit<JadwalLatihan, 'id' | 'admin'> & { admin_id?: number }) => void;
}

const JadwalLatihanForm: React.FC<JadwalLatihanFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<Omit<JadwalLatihan, 'id' | 'admin'> & { admin_id?: number }>({
    tanggal: initialData?.tanggal ? new Date(initialData.tanggal) : new Date(),
    jam: initialData?.jam || '',
    tempat: initialData?.tempat || '',
    admin_id: initialData?.admin?.id
  });

  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'tanggal') {
      // Ensure we create a proper Date object
      const date = new Date(value);
      console.log('Date input changed:', { value, parsedDate: date });
      setFormData(prev => ({ ...prev, [name]: date }));
    } else if (name === 'admin_id') {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSubmit(formData);
  };

  // Format date for input[type="date"]
  const formatDateForInput = (date: Date) => {
    const formatted = date.toISOString().split('T')[0];
    console.log('Formatting date for input:', { date, formatted });
    return formatted;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="admin_id">
          Admin ID
        </label>
        <input
          type="number"
          id="admin_id"
          name="admin_id"
          value={formData.admin_id || ''}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Enter Admin ID"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tanggal">
          Tanggal
        </label>
        <input
          type="date"
          id="tanggal"
          name="tanggal"
          value={formatDateForInput(formData.tanggal)}
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
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {initialData ? 'Update' : 'Create'} Jadwal
      </button>
    </form>
  );
};

export default JadwalLatihanForm; 