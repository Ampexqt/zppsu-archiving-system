import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// LOGIN
export const loginUser = async (data) => {
  const response = await axios.post(
    `${API_URL}/login`,
    data
  );

  return response.data;
};