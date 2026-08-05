"use client";

import React, { useState, useEffect, useCallback } from 'eact';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'eact-hook-form';
import * as z from 'zod';
import { Save, ChevronLeft, ChevronRight, Image as ImageIcon, DollarSign, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

// --- Schemas ---
const stepSchema = z.object({
  title_i18n: z.string().min(3, "Tytuł jest wymagany"),
  description_i18n: z.string().min(10, "Opis jest za krótki"),
  category: z.string().min(1, "Wybierz kategorię"),
  images: z.array(z.string()).optional(),
  price_cents: z.number().min(0),
  currency: z.string().length(3),
  cancellation_policy: z.string().min(5),
  duration_minutes: z.number().min(1),
  max_participants: z.number().min(1),
});

type FormValues = z.infer<typeof stepSchema>;

const STEPS = [
  { id: 1, name: 'Podstawy', icon: <AlertCircle size={18}/> },
  { id: 2, name: 'Zdjęcia', icon: <ImageIcon size={18}/> },
  { id: 3, name: 'Cennik', icon: <DollarSign size={18}/> },
  { id: 4, name: 'Harmonogram', icon: <Calendar size={18}/> },
  { id: 5, name: 'Publikacja', icon: <CheckCircle2 size={18}/> },
];

export default function NewExperiencePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm<FormValues>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      title_i18n: '',
      description_i18n: '',
      category: '',
      price_cents: 0,
      currency: 'PLN',
      cancellation_policy: 'Full refund within 24h',
      duration_minutes: 60,
      max_participants: 10
    }
  });

  const watchedValues = watch();

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSaveDraft();
    }, 30000);
    return () => clearTimeout(timer);
  }, [watchedValues]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    console.log("Saving draft to Supabase...", watchedValues);
    await new Promise(r => setTimeout(r, 1000)); // Simulate API
    setIsSaving(false);
  };

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header & Progress */}
      <header className="bg-white border-b px-8 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Experience</h1>
          <div className="flex gap-3">
            <button onClick={handleSaveDraft} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Save size={18} /> {isSaving? 'Saving...' : 'Save Draft'}
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
              Publish Experience
            </button>
          </div>
        </div>
        
        <div className="relative flex justify-between">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${currentStep >= step.id? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step.id}
              </div>
              <span className={`absolute top-10 text-xs font-medium ${currentStep >= step.id? 'text-indigo-600' : 'text-gray-400'}`}>{step.name}</span>
              {step.id < 5 && <div className={`absolute left-0 top-4 w-full h-1 -z-0 ${currentStep > step.id? 'bg-indigo-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Form Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
            <form onSubmit={handleSubmit(() => {})}>
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input {...register('title_i18n')} className="w-full p-2 border rounded-md" placeholder="e.g. Sunset Kayaking" />
                    {errors.title_i18n && <p className="text-red-500 text-xs mt-1">{errors.title_i18n.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea {...register('description_i18n')} className="w-full p-2 border rounded-md h-32" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select {...register('category')} className="w-full p-2 border rounded-md">
                      <option value="">Select category</option>
                      <option value="adventure">Adventure</option>
                      <option value="culture">Culture</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-500 transition cursor-pointer">
                    <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">Drag and drop photos here or click to upload</p>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Pricing</h2>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Price</label>
                      <input type="number" {...register('price_cents')} className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-medium mb-1">Currency</label>
                      <input {...register('currency')} className="w-full p-2 border rounded-md" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cancellation Policy</label>
                    <input {...register('cancellation_policy')} className="w-full p-2 border rounded-md" />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Schedule</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Duration (min)</label>
                      <input type="number" {...register('duration_minutes')} className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Participants</label>
                      <input type="number" {...register('max_participants')} className="w-full p-2 border rounded-md" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold mb-4">Review & Publish</h2>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
                    <p><strong>Title:</strong> {watchedValues.title_i18n}</p>
                    <p><strong>Category:</strong> {watchedValues.category}</p>
                    <p><strong>Price:</strong> {watchedValues.price_cents / 100} {watchedValues.currency}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="flex justify-between mt-8 max-w-2xl mx-auto">
            <button onClick={prevStep} disabled={currentStep === 1} className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-30">
              <ChevronLeft size={18} /> Back
            </button>
            {currentStep < 5? (
              <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg">
                Next <ChevronRight size={18} />
              </button>
            ) : (
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg">Confirm & Publish</button>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <aside className="w-96 bg-white border-l p-6 hidden xl:block">
          <h3 className="text-sm font-bold uppercase text-gray-400 mb-4">Live Preview</h3>
          <div className="border rounded-xl overflow-hidden shadow-lg">
            <div className="h-40 bg-gray-200 relative">
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 text-[10px] font-bold rounded">ADVENTURE</div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg leading-tight">{watchedValues.title_i18n || 'Untitled Experience'}</h4>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{watchedValues.description_i18n || 'No description provided...'}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-indigo-600 font-bold">{watchedValues.price_cents / 100} {watchedValues.currency}</span>
                <button className="text-xs bg-gray-100 px-3 py-1 rounded-full">Book Now</button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}