
import { useState } from "react";
import { apiRequest } from "../utils/api";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const callApi = async (method, endpoint, options = {}) => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest(method, endpoint, options || {});
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  return { loading, error, callApi };
};