import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const UploadModal = ({ isOpen, onClose, onSuccess, photoToEdit = null }) => {
  const dialogRef = useRef(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(photoToEdit);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) dialog.showModal();
    else dialog.close();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && photoToEdit) {
      setTitle(photoToEdit.title || '');
      setDescription(photoToEdit.description || '');
    } else if (isOpen && !photoToEdit) {
      setTitle('');
      setDescription('');
    }
    setFile(null);
    setError('');
  }, [isOpen, photoToEdit]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!isEditMode && !file) {
      setError('Please choose an image to upload');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description || '');
      if (file) formData.append('image', file);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (isEditMode) {
        await axios.put(`/api/photos/${photoToEdit._id}`, formData, config);
      } else {
        await axios.post('/api/photos', formData, config);
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.error
        || err.response?.data?.message
        || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {isEditMode ? 'Update Photo' : 'Upload Photo'}
        </h3>

        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Description"
              className="textarea textarea-bordered"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">
                {isEditMode ? 'Replace image (optional)' : 'Image'}
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleFileChange}
              required={!isEditMode}
            />
            {isEditMode && photoToEdit?.imageUrl && (
              <p className="text-sm opacity-70 mt-2">
                Current image will be kept unless you choose a new file.
              </p>
            )}
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Upload'}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default UploadModal;