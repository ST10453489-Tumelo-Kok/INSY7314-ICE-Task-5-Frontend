import { useEffect, useState } from 'react';
import axios from 'axios';

const Profiles = () => {
  const [profiles, setProfiles] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfiles(response.data);
      } catch (error) {
        setError('You are not authorized to view this page.');
      }
    };
    fetchProfiles();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles({
        ...profiles,
        users: profiles?.users.filter(user => user.user_id !== userId),
      });
    } catch (err) {
      if (err.response) setError(err.response.data.error);
      else setError('Something went wrong. Please try again.');
    }
  };

  const promoteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${userId}/promote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles({
        ...profiles,
        users: profiles?.users.map(user =>
          user.user_id === userId ? { ...user, role: 'admin' } : user
        ),
      });
    } catch (err) {
      if (err.response) setError(err.response.data.error);
      else setError('Something went wrong. Please try again.');
    }
  };

  const demoteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${userId}/demote`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles({
        ...profiles,
        users: profiles?.users.map(user =>
          user.user_id === userId ? { ...user, role: 'user' } : user
        ),
      });
    } catch (err) {
      if (err.response) setError(err.response.data.error);
      else setError('Something went wrong. Please try again.');
    }
  };

  const userTable = () => {
    return profiles?.users.map(user => (
      <tr key={user.user_id}>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td className="flex gap-2 justify-center">
          {user.role !== 'admin' ? (
            <button className="btn btn-xs btn-warning" onClick={() => promoteUser(user.user_id)}>Promote</button>
          ) : (
            <button className="btn btn-xs btn-accent" onClick={() => demoteUser(user.user_id)}>Demote</button>
          )}
          <button className="btn btn-xs btn-error" onClick={() => deleteUser(user.user_id)}>Delete</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto w-full max-w-4xl mx-auto mt-10">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>{userTable()}</tbody>
      </table>
    </div>
  );
};

export default Profiles;