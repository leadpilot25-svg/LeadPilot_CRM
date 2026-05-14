export const getAppMode = () => {
  return localStorage.getItem("app_mode") || "solo";
};

export const setAppMode = (mode: "solo" | "team") => {
  localStorage.setItem("app_mode", mode);
};