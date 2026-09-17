import { jwtDecode } from "jwt-decode";

export default function isLoggedIn() {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Error decoding JWT:", error.message);
      return false;
    }
  }
  return false;
}