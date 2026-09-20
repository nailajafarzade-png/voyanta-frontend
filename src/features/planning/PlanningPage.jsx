import { useState } from "react";
import voyanta from "../../assets/Logo Mark.png";
import { NavLink } from "react-router-dom";

import StepOneInterests from "./components/StepOneInterests";
import StepTwoCompanions from "./components/StepTwoCompanions";
import StepThreeBudget from "./components/StepThreeBudget";
import StepFourDates from "./components/StepFourDates";
import StepFiveHotelType from "./components/StepFiveHotelType";
import StepSixMealPreference from "./components/StepSixMealPreference";
import StepSevenTripPurpose from "./components/StepSevenTripPurpose";

function PlanningPage({ isOpen, onClose }) {
  const TOTAL_STEPS = 7;

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    interests: [],
    companion: "",
    peopleCount: 2,

    adults: 2,
    children: 1,

    budgetType: "",
    customBudget: "",
    startDate: "",
    endDate: "",

    hotelType: "",
    mealPreference: "",
    tripPurpose: [],
  });

  if (!isOpen) return null;

  // Hər step üçün seçim edilib-edilmədiyini yoxlayırıq
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.interests.length > 0;

      case 2:
        return formData.companion !== "";

      case 3:
        return (
          formData.budgetType !== "" &&
          (formData.budgetType !== "custom" ||
            formData.customBudget !== "")
        );

      case 4:
        return (
          formData.startDate !== "" &&
          formData.endDate !== ""
        );

      case 5:
        return formData.hotelType !== "";

      case 6:
        return formData.mealPreference !== "";

      case 7:
        return formData.tripPurpose.length > 0;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canGoNext()) {
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    if (!canGoNext()) {
      return;
    }

    console.log("Göndərilən məlumatlar:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-[680px] min-h-[500px] bg-[#F9FAFB] rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100 flex flex-col justify-between">

        <div>
          {/* HEADER */}
          <div className="w-full flex items-center justify-between mb-8">

            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <img
                src={voyanta}
                alt="Voyanta"
                className="w-6 h-6 object-contain"
              />

              <span className="font-bold text-xl tracking-tight text-slate-900">
                voyanta
              </span>
            </div>

            {/* Mobile back */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`sm:hidden p-1 text-slate-600 hover:text-slate-900 transition-colors ${
                currentStep === 1
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
              aria-label="Geri"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>

            {/* Progress */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map(
                (_, index) => {
                  const stepNum = index + 1;

                  return (
                    <div
                      key={stepNum}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        stepNum <= currentStep
                          ? "w-6 sm:w-7 bg-[#5B8DEF]"
                          : "w-4 sm:w-5 bg-slate-200"
                      }`}
                    />
                  );
                }
              )}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              aria-label="Bağla"
            >
              <svg
                className="w-6 h-6 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* STEPS */}
          <div className="w-full my-2">

            {currentStep === 1 && (
              <StepOneInterests
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {currentStep === 2 && (
              <StepTwoCompanions
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {currentStep === 3 && (
              <StepThreeBudget
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {currentStep === 4 && (
              <StepFourDates
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {currentStep === 5 && (
              <StepFiveHotelType
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {currentStep === 6 && (
              <StepSixMealPreference
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {currentStep === 7 && (
              <StepSevenTripPurpose
                formData={formData}
                setFormData={setFormData}
              />
            )}

          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center justify-center gap-3 mt-8">

          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="hidden sm:block px-7 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              Geri
            </button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              className={`w-full sm:w-auto px-8 py-3 sm:py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                canGoNext()
                  ? "bg-[#5B8DEF] hover:bg-[#4A7CE0]"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              <span>Növbəti</span>
              <span>→</span>
            </button>
          ) : (
            <NavLink
              to="/location"
              onClick={handleFinish}
              className={`w-full sm:w-auto px-8 py-3 sm:py-2.5 rounded-full text-white text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                canGoNext()
                  ? "bg-[#5B8DEF] hover:bg-[#4A7CE0]"
                  : "bg-slate-300 pointer-events-none"
              }`}
            >
              <span>Uyğunlaşmaları göstər</span>
              <span>✨</span>
            </NavLink>
          )}

        </div>
      </div>
    </div>
  );
}

export default PlanningPage;