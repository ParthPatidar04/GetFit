import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AvatarPicker from "../components/AvatarPicker.jsx";
import {
  updateProfile,
  uploadAvatarImage,
  setPresetAvatar,
  deleteAvatar,
} from "../services/profileService.js";

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [bodyType, setBodyType] = useState(user?.bodyType || "");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [goal, setGoal] = useState(user?.goal || "");
  const [dietPreference, setDietPreference] = useState(user?.dietPreference || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const persistUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const updated = await updateProfile({ name, bodyType, height, weight, goal, dietPreference });
      persistUser(updated);
      setMessage("Profile updated");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { avatarUrl: newUrl } = await uploadAvatarImage(file);
      setAvatarUrl(newUrl);
      persistUser({ avatarUrl: newUrl });
    } catch (err) {
      setMessage(err.response?.data?.message || "Upload failed");
    }
  };

  const handlePresetSelect = async (url) => {
    try {
      await setPresetAvatar(url);
      setAvatarUrl(url);
      persistUser({ avatarUrl: url });
      setShowPicker(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not set avatar");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setAvatarUrl("");
      persistUser({ avatarUrl: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not remove avatar");
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold">Profile</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
        >
          Back to dashboard
        </button>
      </nav>

      <main className="px-4 sm:px-6 py-8 max-w-lg mx-auto space-y-6">
        {/* avatar section */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Profile picture
          </h3>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">{name?.[0]?.toUpperCase() || "?"}</span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <label className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 cursor-pointer">
                Upload photo
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <button
                type="button"
                onClick={() => setShowPicker((v) => !v)}
                className="text-sm rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5"
              >
                Choose avatar
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="text-sm rounded-lg border border-red-300 text-red-500 px-3 py-1.5"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {showPicker && <AvatarPicker onSelect={handlePresetSelect} />}
        </div>

        {/* profile form */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 space-y-4"
        >
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Body details
          </h3>

          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Body type</label>
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select</option>
              <option value="ectomorph">Ectomorph</option>
              <option value="mesomorph">Mesomorph</option>
              <option value="endomorph">Endomorph</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select</option>
              <option value="lose_weight">Lose weight</option>
              <option value="gain_muscle">Gain muscle</option>
              <option value="maintain">Maintain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Diet preference</label>
            <select
              value={dietPreference}
              onChange={(e) => setDietPreference(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-vegetarian</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>

          {message && <p className="text-sm text-primary-600">{message}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-primary-600 text-white py-2 text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;