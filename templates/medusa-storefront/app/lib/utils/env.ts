export const getBaseURL = () => {
  return import.meta.env.VITE_BASE_URL || "https://localhost:8000";
};
