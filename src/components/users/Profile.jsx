import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setIsLoading(false);
      } catch (error) {
        setLoadError('Error loading profile. Please try again.');
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.put("/api/users/me", {
        id: profile.user_id,
        username: profile.user.username,
        email: profile.user.email,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  if (loadError !== '') {
    return <p style={{ color: 'red' }}>{loadError}</p>;
  }

  const setUsername = (username) => {
    setProfile({ ...profile, user: { ...profile.user, username } });
  };

  const setEmail = (email) => {
    setProfile({ ...profile, user: { ...profile.user, email } });
  };

  return isLoading ? (
    <div className="card w-96 shadow-2xl bg-base-100 mx-auto mt-10">
      <div className="card-body">
        <div className="flex flex-col gap-4">
          <div className="skeleton h-8 w-3/4 mx-auto"></div>
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-6 w-full"></div>
          <div className="skeleton h-10 w-full"></div>
        </div>
      </div>
    </div>
  ) : (
    <div className="card w-96 shadow-2xl bg-base-100 mx-auto mt-10">
      <div className="card-body">
        <h2 className="text-2xl font-bold text-center">Update Profile</h2>

        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              value={profile?.user.username || ''}
              className="input input-bordered"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              value={profile?.user.email || ''}
              className="input input-bordered"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;