import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Wand2, Loader2 } from 'lucide-react';
import Step1ClientDetails from '../components/brief-builder/Step1ClientDetails';
import Step2CampaignObjective from '../components/brief-builder/Step2CampaignObjective';
import Step3CreativePreferences from '../components/brief-builder/Step3CreativePreferences';
import Step4ReviewSubmit from '../components/brief-builder/Step4ReviewSubmit';
import BriefOutput from '../components/brief-builder/BriefOutput';

const STEPS = [
  'Client Details',
  'Campaign Objectives',
  'Creative Direction',
  'Final Review'
];

const BriefBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    clientName: '',
    industry: '',
    website: '',
    keyCompetitors: '',
    objective: '',
    targetAudience: '',
    budget: '',
    tone: 'Professional',
    imageryStyle: 'Photorealistic',
    colorDirection: '#4f46e5',
    dos: '',
    donts: ''
  });
  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0) {
      if (!formData.clientName) newErrors.clientName = 'Client name is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
      if (!formData.website) newErrors.website = 'Website is required';
      else if (!/^https?:\/\/.+/.test(formData.website)) newErrors.website = 'Enter a valid URL (including http/https)';
    } else if (step === 1) {
      if (!formData.objective) newErrors.objective = 'Please select an objective';
      if (!formData.targetAudience) newErrors.targetAudience = 'Briefly describe your target audience';
      if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Connect to AI Microservice
    try {
      const apiUrl = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/generate/brief`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('AI Service unavailable, using mock data:', error);
      // Fallback to mock for local dev without AI service running
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = {
        campaignTitle: `${formData.clientName} ${formData.objective.charAt(0).toUpperCase() + formData.objective.slice(1)} Performance 2025`,
        headlines: [
          `Experience the Future of ${formData.industry} with ${formData.clientName}.`,
          `Elevate Your Lifestyle. The ${formData.clientName} Difference.`,
          `Join thousands choosing ${formData.clientName} for ${formData.industry} excellence.`
        ],
        toneGuide: `The campaign should maintain a ${formData.tone} voice. Use language that resonates with ${formData.targetAudience}, focusing on clarity and authority while avoiding industry jargon.`,
        channels: [
          { name: 'Social Media (Meta)', budgetPct: 40 },
          { name: 'Search (Google Ads)', budgetPct: 35 },
          { name: 'Programmatic Display', budgetPct: 25 }
        ],
        visualDirection: `${formData.imageryStyle} aesthetics dominated by ${formData.colorDirection} accents. Imagery should focus on modern, clean environments that showcase the human element within ${formData.industry}.`
      };
      setResult(mockResult);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setCurrentStep(0);
    setFormData({
      clientName: '',
      industry: '',
      website: '',
      keyCompetitors: '',
      objective: '',
      targetAudience: '',
      budget: '',
      tone: 'Professional',
      imageryStyle: 'Photorealistic',
      colorDirection: '#4f46e5',
      dos: '',
      donts: ''
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1ClientDetails formData={formData} setFormData={setFormData} errors={errors} />;
      case 1:
        return <Step2CampaignObjective formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <Step3CreativePreferences formData={formData} setFormData={setFormData} />;
      case 3:
        return <Step4ReviewSubmit formData={formData} />;
      default:
        return null;
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
        <BriefOutput result={result} onReset={resetForm} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold tracking-tight uppercase">
            <Sparkles className="w-4 h-4" />
            AI Creative Assistant
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl tracking-tight">
            Creative Brief <span className="text-indigo-600 dark:text-indigo-500">Builder</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Generate high-performing, agency-grade creative briefs in seconds using our specialized AI models.
          </p>
        </header>

        {/* Stepper */}
        <nav className="mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          <ul className="flex justify-between items-center relative z-10 w-full">
            {STEPS.map((stepName, idx) => (
              <li key={idx} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${
                    currentStep === idx 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                      : currentStep > idx 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {currentStep > idx ? '✓' : idx + 1}
                </div>
                <span className={`mt-3 text-[10px] font-bold uppercase tracking-widest hidden md:block transition-colors duration-200 ${
                  currentStep === idx ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'
                }`}>
                  {stepName}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Form Area */}
        <main className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden min-h-[500px] flex flex-col">
          <div className="p-8 md:p-12 flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <footer className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || isGenerating}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-200 tracking-tight ${
                currentStep === 0 || isGenerating
                  ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep === STEPS.length - 1 ? (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Data...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    Submit to AI
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-2xl font-bold transition-all duration-200 shadow-lg hover:-translate-y-0.5 active:translate-y-0 group"
              >
                Continue
                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </footer>
        </main>

        <div className="mt-8 text-center">
            <p className="text-slate-400 dark:text-slate-600 text-xs font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-4">
                <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />
                Trusted by 500+ Content Agencies
                <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />
            </p>
        </div>
      </div>
    </div>
  );
};

export default BriefBuilder;
