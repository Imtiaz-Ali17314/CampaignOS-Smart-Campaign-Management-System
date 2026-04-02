import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Wand2, Loader2 } from 'lucide-react';
import Step1ClientDetails from '../components/brief-builder/Step1ClientDetails';
import Step2CampaignObjective from '../components/brief-builder/Step2CampaignObjective';
import Step3CreativePreferences from '../components/brief-builder/Step3CreativePreferences';
import Step4ReviewSubmit from '../components/brief-builder/Step4ReviewSubmit';
import BriefOutput from '../components/brief-builder/BriefOutput';

import Sidebar from '../components/dashboard/Sidebar';
import campaignData from '../data/campaigns.json';

const STEPS = [
  'Client Context',
  'Campaign Goal',
  'Creative DNA',
  'Final Submission'
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
    colorDirection: '#8b5cf6',
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
      clientName: '', industry: '', website: '', keyCompetitors: '',
      objective: '', targetAudience: '', budget: '',
      tone: 'Professional', imageryStyle: 'Photorealistic', colorDirection: '#8b5cf6',
      dos: '', donts: ''
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step1ClientDetails formData={formData} setFormData={setFormData} errors={errors} />;
      case 1: return <Step2CampaignObjective formData={formData} setFormData={setFormData} errors={errors} />;
      case 2: return <Step3CreativePreferences formData={formData} setFormData={setFormData} />;
      case 3: return <Step4ReviewSubmit formData={formData} />;
      default: return null;
    }
  };

  return (
    <div className="flex bg-background min-h-screen text-foreground">
      <Sidebar campaigns={campaignData.campaigns} />
      
      <main className="flex-1 overflow-x-hidden pt-10 px-6 md:px-12 pb-20 scrollbar-hide">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 space-y-4">
            <div className="status-pill bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3" />
              Creative Intelligence Core
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none">
              Strategize <span className="gradient-text">Anywhere.</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-xl">
              Construct agency-grade creative briefs powered by real-time industry intelligence.
            </p>
          </header>

          {result ? (
            <BriefOutput result={result} onReset={resetForm} />
          ) : (
            <>
              {/* Stepper */}
              <nav className="mb-10 flex flex-wrap items-center gap-4">
                {STEPS.map((stepName, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div 
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-300 border-2 ${
                        currentStep === idx 
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110' 
                          : currentStep > idx 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                          : 'bg-card border-border text-muted-foreground/40'
                      }`}
                    >
                      {currentStep > idx ? '✓' : idx + 1}
                    </div>
                    {currentStep === idx && (
                      <span className="text-xs font-black uppercase tracking-widest text-primary animate-fadeIn">
                        {stepName}
                      </span>
                    )}
                    {idx < STEPS.length - 1 && (
                      <div className="w-4 h-px bg-border/40 mx-1 hidden sm:block" />
                    )}
                  </div>
                ))}
              </nav>

              {/* Form Area */}
              <div className="glass-card rounded-[3rem] p-1 shadow-2xl shadow-primary/5 min-h-[550px] flex flex-col border-primary/5">
                <div className="p-8 md:p-12 flex-grow overflow-y-auto max-h-[60vh] scrollbar-hide">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'circOut' }}
                    >
                      {renderStep()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <footer className="p-8 bg-muted/5 border-t border-border/40 flex items-center justify-between rounded-b-[2.9rem]">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0 || isGenerating}
                    className="btn-premium py-2 content-center font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground disabled:opacity-0 transition-opacity"
                  >
                    Previous Phase
                  </button>

                  {currentStep === STEPS.length - 1 ? (
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="btn-premium btn-primary px-10 group"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-xs uppercase tracking-widest">Building Brief...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                          <span className="text-xs uppercase tracking-widest">Generate Strategy</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="btn-premium bg-foreground text-background px-10 group"
                    >
                      <span className="text-xs uppercase tracking-widest">Next Phase</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </footer>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BriefBuilder;
