# INSY7314 ICE Task 5 – PhotoShare Frontend

React + Vite single-page application for the INSY7314 PhotoStore backend.

## Features

- JWT-based login / signup / logout
- User profile view and update (`/api/users/me`)
- Admin user management (promote, demote, delete)
- Photo gallery: view, upload, update, delete
- Upload form isolated as a reusable DaisyUI modal, shared between create and edit flows via the `photoToEdit` prop
- Cloudinary-backed file uploads using `multipart/form-data`

## Tech Stack

- React 19 + Vite
- React Router v7
- Axios
- Tailwind CSS v4 + DaisyUI v5

## Setup

```bash
npm install
npm run dev
