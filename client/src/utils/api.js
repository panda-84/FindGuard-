import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (method, endpoint, options = {}) => {
  const { data, params, headers } = options;
  const token = localStorage.getItem("access_token"); 

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      params,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
    return response; 
  } catch (error) {
    console.error(error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong!");
    } else {
      throw new Error("Server not reachable!");
    }
  }
};
