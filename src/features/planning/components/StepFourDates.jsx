function StepFourDates({ formData, setFormData }) {
  const getMaxEndDate = () => {
    if (!formData.startDate) return "";

    const date = new Date(formData.startDate);

    date.setDate(date.getDate() + 14);

    return date.toISOString().split("T")[0];
  };

  const handleStartDateChange = (e) => {
    const startDate = e.target.value;

    setFormData({
      ...formData,
      startDate,
      endDate: "",
    });
  };

  const handleEndDateChange = (e) => {
    setFormData({
      ...formData,
      endDate: e.target.value,
    });
  };

  return (
    <div className="flex flex-col items-center text-center w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        Nə vaxt səyahət etmək istəyirsən?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl my-6">
        {/* Gediş tarixi */}
        <div className="text-left">
          <label className="text-xs text-slate-500 mb-1.5 block">
            Gediş tarixi
          </label>

          <input
            type="date"
            value={formData.startDate}
            onChange={handleStartDateChange}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-[#5B8DEF]"
          />
        </div>

        {/* Dönüş tarixi */}
        <div className="text-left">
          <label className="text-xs text-slate-500 mb-1.5 block">
            Dönüş tarixi
          </label>

          <input
            type="date"
            value={formData.endDate}
            onChange={handleEndDateChange}
            min={formData.startDate || undefined}
            max={getMaxEndDate() || undefined}
            disabled={!formData.startDate}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-[#5B8DEF] disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="px-4 py-2.5 rounded-full bg-blue-50/70 border border-blue-100 text-[#5B8DEF] text-xs font-medium inline-flex items-center gap-2">
        <span>ℹ️</span>

        <span>
          Gediş tarixindən maksimum 14 gün ərzində dönüş tarixi seçə
          bilərsən.
        </span>
      </div>
    </div>
  );
}

export default StepFourDates;