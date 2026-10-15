import api from "./api.js";

export const updateProfile = async (updates) => {
  const { data } = await api.put("/profile", updates);
  return data;
};

export const uploadAvatarImage = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post("/profile/avatar/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const setPresetAvatar = async (avatarUrl) => {
  const { data } = await api.put("/profile/avatar/preset", { avatarUrl });
  return data;
};

export const deleteAvatar = async () => {
  const { data } = await api.delete("/profile/avatar");
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};