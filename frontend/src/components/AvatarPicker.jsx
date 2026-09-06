// generates 6 DiceBear preset avatars (no upload needed, no API key needed)
const SEEDS = ["Felix", "Aneka", "Milo", "Zoe", "Leo", "Nina"];

const AvatarPicker = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {SEEDS.map((seed) => {
        const url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        return (
          <button
            key={seed}
            type="button"
            onClick={() => onSelect(url)}
            className="rounded-full overflow-hidden border-2 border-transparent hover:border-primary-500 transition"
          >
            <img src={url} alt={`Avatar ${seed}`} className="w-full h-full" />
          </button>
        );
      })}
    </div>
  );
};

export default AvatarPicker;