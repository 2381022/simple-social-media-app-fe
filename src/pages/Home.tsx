import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const adminFeatures = [
    {
      title: 'Member Management',
      description: 'Manage user accounts and permissions',
      path: '/members',
      icon: '👥'
    },
    {
      title: 'Jadwal Latihan',
      description: 'Manage training schedules',
      path: '/jadwal-latihan',
      icon: '📅'
    },
    {
      title: 'Post Management',
      description: 'Manage posts and content',
      path: '/posts',
      icon: '📝'
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminFeatures.map((feature) => (
          <div
            key={feature.path}
            onClick={() => navigate(feature.path)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;