import { useEffect, useState } from 'react';
import axios from 'axios';
import UploadModal from './UploadModal';

const Gallery = () => {
  const [photos, setPhotos] = useState(null);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoToEdit, setPhotoToEdit] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/photos', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPhotos(response.data);
      } catch (error) {
        setError('You are not authorized to view the posts.');
      }
    };

    if (refresh) {
      fetchPhotos();
      setRefresh(false);
    }
  }, [refresh]);

  const deletePhoto = async (photoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/photos/${photoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh(true);
    } catch (err) {
      if (err.response) setError(err.response.data.error);
    }
  };

  // Open modal for a NEW photo
  const openUploadModal = () => {
    setPhotoToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal for an EXISTING photo (Task 3)
  const openEditModal = (photo) => {
    setPhotoToEdit(photo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPhotoToEdit(null);
  };

  const handleSuccess = () => {
    setRefresh(true);
  };

  const photoGrid = () => {
    return photos?.photos.map(photo => (
      <div key={photo._id} className="card bg-base-100 shadow-xl">
        <figure>
          <img src={photo.imageUrl} alt={photo.title} />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{photo.title}</h2>
          <p>{photo.description}</p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-sm btn-accent"
              onClick={() => openEditModal(photo)}
            >
              Update
            </button>
            <button
            onClick={() => deletePhoto(photo.id)}
              className="btn btn-sm btn-error"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Upload button (Task 2) */}
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary" onClick={openUploadModal}>
          Upload Photo
        </button>
      </div>

      {/* Photo Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photoGrid()}
      </div>

      {/* Shared modal for upload + edit */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
        photoToEdit={photoToEdit}
      />
    </div>
  );
};

export default Gallery;