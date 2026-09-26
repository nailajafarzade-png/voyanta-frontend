import OptionGrid from "./OptionGrid";
import StepShell from "./StepShell";

const INTERESTS = [
  { id: "nature", title: "Təbiət", emoji: "🖼️" },
  { id: "sea", title: "Dəniz", emoji: "🌊" },
  { id: "culture", title: "Tarix və mədəniyyət", emoji: "🏛️" },
];

function StepOneInterests({ formData, setFormData }) {
  const toggleInterest = (id) => {
    const list = formData.interests.includes(id)
      ? formData.interests.filter((item) => item !== id)
      : [...formData.interests, id];

    setFormData({ ...formData, interests: list });
  };

  return (
    <StepShell
      title="Nəyə maraqlısan?"
      description="Bir neçəsini seçə bilərsən — planını buna görə fərdiləşdirəcəyik."
    >
      <OptionGrid
        ariaLabel="Maraqlar"
        columns="grid-cols-1 sm:grid-cols-3"
        multiple
        options={INTERESTS}
        value={formData.interests}
        onSelect={toggleInterest}
      />
    </StepShell>
  );
}

export default StepOneInterests;
