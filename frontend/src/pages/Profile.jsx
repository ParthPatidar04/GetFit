import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AvatarPicker from "../components/AvatarPicker.jsx";
import {
  getMe,
  updateProfile,
  uploadAvatarImage,
  setPresetAvatar,
  deleteAvatar,
} from "../services/profileService.js";

const BODY_TYPES = [
  { value: "ectomorph", label: "Ectomorph" },
  { value: "mesomorph", label: "Mesomorph" },
  { value: "endomorph", label: "Endomorph" },
];

const GOALS = [
  { value: "lose_weight", label: "Lose weight" },
  { value: "gain_muscle", label: "Gain muscle" },
  { value: "maintain", label: "Maintain" },
];

const DIETS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "non-vegetarian", label: "Non-vegetarian" },
  { value: "eggetarian", label: "Eggetarian" },
];

const PillGroup = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value)}
        className={`rounded-full px-4 py-2 text-sm font-medium border transition ${
          value === o.value
            ? "bg-accent text-accent-fg border-accent"
            : "bg-surface2 border-line text-muted hover:text-fg"
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Profile = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [bodyType, setBodyType] = useState(user?.bodyType || "");
  const [height, setHeight] = useState(user?.height || "");
  const [weight, setWeight] = useState(user?.weight || "");
  const [goal, setGoal] = useState(user?.goal || "");
  const [dietPreference, setDietPreference] = useState(user?.dietPreference || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null); // { text, ok }

  const persistUser = (updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  // fill the form with the saved profile from the server
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await getMe();
        setName(me.name || "");
        setBodyType(me.bodyType || "");
        setHeight(me.height ?? "");
        setWeight(me.weight ?? "");
        setGoal(me.goal || "");
        setDietPreference(me.dietPreference || "");
        setAvatarUrl(me.avatarUrl || "");
        persistUser(me);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateProfile({ name, bodyType, height, weight, goal, dietPreference });
      persistUser(updated);
      setMessage({ text: "Profile updated", ok: true });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Update failed", ok: false });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const { avatarUrl: newUrl } = await uploadAvatarImage(file);
      setAvatarUrl(newUrl);
      persistUser({ avatarUrl: newUrl });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Upload failed", ok: false });
    } finally {
      setUploading(false);
    }
  };

  const handlePresetSelect = async (url) => {
    try {
      await setPresetAvatar(url);
      setAvatarUrl(url);
      persistUser({ avatarUrl: url });
      setShowPicker(false);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Could not set avatar", ok: false });
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setAvatarUrl("");
      persistUser({ avatarUrl: "" });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Could not remove avatar", ok: false });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Profile</h1>
        <p className="text-sm text-muted">
          Your details help us build a diet plan that fits you.
        </p>
      </div>

      {/* avatar */}
      <section className="card p-5 sm:p-6">
        <h2 className="font-semibold mb-4">Profile picture</h2>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden bg-surface2 border border-line grid place-items-center text-2xl font-bold">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{name?.[0]?.toUpperCase() || "?"}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="btn-outline !py-2 cursor-pointer">
              {uploading ? "Uploading..." : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => setShowPicker((v) => !v)}
              className="btn-outline !py-2"
            >
              Choose avatar
            </button>
            {avatarUrl && (
              <button
                type="button"
                onClick={handleDeleteAvatar}
                className="btn-outline !py-2 !text-brand"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {showPicker && (
          <div className="mt-5">
            <AvatarPicker onSelect={handlePresetSelect} />
          </div>
        )}
      </section>

      {/* details */}
      <form onSubmit={handleSaveProfile} className="card p-5 sm:p-6 space-y-5">
        <h2 className="font-semibold">Body details</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Body type</label>
          <PillGroup options={BODY_TYPES} value={bodyType} onChange={setBodyType} />
          <p className="text-xs text-muted mt-2">
            Ectomorph: lean, Mesomorph: athletic, Endomorph: broader build.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Goal</label>
          <PillGroup options={GOALS} value={goal} onChange={setGoal} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Diet preference</label>
          <PillGroup options={DIETS} value={dietPreference} onChange={setDietPreference} />
        </div>

        {message && (
          <p className={`text-sm ${message.ok ? "text-accent-text" : "text-brand"}`}>
            {message.text}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-accent w-full">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;