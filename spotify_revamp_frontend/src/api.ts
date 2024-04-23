import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 10000,
  withCredentials: true,
});

const getCsrfToken = async (): Promise<string> => {
    try {
      const response = await axiosInstance.get("/csrf");
      return response.data.csrfToken || '';
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
      return '';
    }
  };

// (async () => {
//   axiosInstance.defaults.headers.common["X-CSRFToken"] = await getCsrfToken();
// })();

export { axiosInstance, getCsrfToken };