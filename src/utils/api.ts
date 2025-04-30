import axios from 'axios';

const API_URL = 'https://final-project-web-2.vercel.app/api';

// JadwalLatihan interfaces and functions
export interface JadwalLatihan {
  id: number;
  tanggal: Date;
  jam: string;
  tempat: string;
  admin: {
    id: number;
    username: string;
  };
}

// Member interfaces and functions
export interface Member {
  id: number;
  username: string;
  password?: string;
}

// MemberManagement interfaces and functions
export interface MemberManagement {
  id: number;
  member: {
    id: number;
    username: string;
  };
  role: string;
  assigned_by: {
    id: number;
    username: string;
  };
  created_at: string;
  jadwal_id: number;
}

// Admin interfaces and functions
export interface Admin {
  id: number;
  username: string;
  created_at: string;
}

// Attendance interfaces and functions
export interface Absensi {
  id: number;
  member: {
    id: number;
    username: string;
  };
  jadwal: {
    id: number;
    tanggal: string;
    jam: string;
    tempat: string;
  };
  status: 'HADIR' | 'TIDAK_HADIR' | 'IZIN';
  keterangan?: string;
  created_at: string;
}

// Helper function to get auth headers
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

// Helper function to format date for API
const formatDateForAPI = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// JadwalLatihan API functions
export const getJadwalLatihan = async () => {
  const response = await axios.get(`${API_URL}/jadwal-latihan`, getAuthHeaders());
  return response.data;
};

export const getJadwalLatihanById = async (id: number) => {
  const response = await axios.get(`${API_URL}/jadwal-latihan/${id}`, getAuthHeaders());
  return response.data;
};

export const createJadwalLatihan = async (data: Omit<JadwalLatihan, 'id' | 'admin'>) => {
  // Format the date before sending
  const formattedData = {
    ...data,
    tanggal: formatDateForAPI(data.tanggal)
  };
  console.log('Sending data to API:', formattedData);
  const response = await axios.post(`${API_URL}/jadwal-latihan`, formattedData, getAuthHeaders());
  return response.data;
};

export const updateJadwalLatihan = async (id: number, data: Partial<JadwalLatihan> & { admin_id?: number }) => {
  // Format the date before sending
  const formattedData = {
    ...data,
    tanggal: data.tanggal ? formatDateForAPI(data.tanggal) : undefined
  };
  console.log('Sending update data to API:', formattedData);
  const response = await axios.patch(`${API_URL}/jadwal-latihan/${id}`, formattedData, getAuthHeaders());
  return response.data;
};

export const deleteJadwalLatihan = async (id: number) => {
  const response = await axios.delete(`${API_URL}/jadwal-latihan/${id}`, getAuthHeaders());
  return response.data;
};

// Member API functions
export const getMembers = async () => {
  const response = await axios.get(`${API_URL}/member`, getAuthHeaders());
  return response.data;
};

export const getMemberById = async (id: number) => {
  const response = await axios.get(`${API_URL}/member/${id}`, getAuthHeaders());
  return response.data;
};

export const createMember = async (data: Omit<Member, 'id'>) => {
  const response = await axios.post(`${API_URL}/member`, data, getAuthHeaders());
  return response.data;
};

export const updateMember = async (id: number, data: Partial<Member>) => {
  const response = await axios.patch(`${API_URL}/member/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deleteMember = async (id: number) => {
  const response = await axios.delete(`${API_URL}/member/${id}`, getAuthHeaders());
  return response.data;
};

// MemberManagement API functions
export const getMemberManagementList = async (): Promise<MemberManagement[]> => {
  const response = await fetch(`${API_URL}/pengelolaan-member`, getAuthHeaders());
  if (!response.ok) {
    throw new Error('Failed to fetch member management list');
  }
  return response.json();
};

export const getMemberManagementById = async (id: number): Promise<MemberManagement> => {
  const response = await fetch(`${API_URL}/pengelolaan-member/${id}`, getAuthHeaders());
  if (!response.ok) {
    throw new Error('Failed to fetch member management');
  }
  return response.json();
};

export const createMemberManagement = async (data: {
  member_id: number;
  role: string;
  assigned_by_id: number;
  jadwal_id: number;
}): Promise<MemberManagement> => {
  const response = await fetch(`${API_URL}/pengelolaan-member`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders().headers
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create member management');
  }
  return response.json();
};

export const updateMemberManagement = async (
  id: number,
  data: {
    member_id: number;
    role: string;
    assigned_by_id: number;
    jadwal_id: number;
  }
): Promise<MemberManagement> => {
  const response = await fetch(`${API_URL}/pengelolaan-member/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders().headers
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update member management');
  }
  return response.json();
};

export const deleteMemberManagement = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/pengelolaan-member/${id}`, {
    method: 'DELETE',
    ...getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete member management');
  }
};

// Admin API functions
export const getAdmins = async (): Promise<Admin[]> => {
  const response = await fetch(`${API_URL}/admin`, getAuthHeaders());
  if (!response.ok) {
    throw new Error('Failed to fetch admins');
  }
  return response.json();
};

export const getAdminById = async (id: number): Promise<Admin> => {
  const response = await fetch(`${API_URL}/admin/${id}`, getAuthHeaders());
  if (!response.ok) {
    throw new Error('Failed to fetch admin');
  }
  return response.json();
};

export const createAdmin = async (data: {
  username: string;
  password: string;
}): Promise<Admin> => {
  const response = await fetch(`${API_URL}/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders().headers
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create admin');
  }
  return response.json();
};

export const updateAdmin = async (
  id: number,
  data: {
    username: string;
    password?: string;
  }
): Promise<Admin> => {
  const response = await fetch(`${API_URL}/admin/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders().headers
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update admin');
  }
  return response.json();
};

export const deleteAdmin = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/${id}`, {
    method: 'DELETE',
    ...getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete admin');
  }
};

// Attendance API functions
export const getAbsensiList = async (): Promise<Absensi[]> => {
  const response = await fetch(`${API_URL}/absensi`, getAuthHeaders());
  if (!response.ok) {
    throw new Error('Failed to fetch attendance list');
  }
  return response.json();
};

export const getAbsensiById = async (id: number): Promise<Absensi> => {
  const response = await fetch(`${API_URL}/absensi/${id}`, getAuthHeaders());
  if (!response.ok) {
    throw new Error('Failed to fetch attendance');
  }
  return response.json();
};

export const createAbsensi = async (data: {
  member_id: number;
  jadwal_id: number;
  status: 'HADIR' | 'TIDAK_HADIR' | 'IZIN';
  keterangan?: string;
}): Promise<Absensi> => {
  const response = await fetch(`${API_URL}/absensi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders().headers
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create attendance');
  }
  return response.json();
};

export const updateAbsensi = async (
  id: number,
  data: {
    status: 'HADIR' | 'TIDAK_HADIR' | 'IZIN';
    keterangan?: string;
  }
): Promise<Absensi> => {
  const response = await fetch(`${API_URL}/absensi/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders().headers
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update attendance');
  }
  return response.json();
};

export const deleteAbsensi = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/absensi/${id}`, {
    method: 'DELETE',
    ...getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to delete attendance');
  }
};