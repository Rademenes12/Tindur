"use client";

import React, { useState, useCallback } from 'eact';
import { useForm, useFieldArray, Controller } from 'eact-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Upload, X, Plus, Languages, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Zakładany import klienta Supabase

// // Walidacja
const languageSchema = z.object({
  pl: z.string().min(3, "Tytuł za krótki"),
  en: z.string().min(3, "Tytuł za krótki"),
  is: z.string().min(3, "Tytuł za krótki"),
});

const descriptionSchema = z.object({
  pl: z.string().min(10, "Opis musi mieć min. 10 znaków"),
  en: z.string().min(10, "Opis musi mieć min. 10 znaków"),
  is: z.string().min(10, "Opis musi mieć min. 10 znaków"),
});

const experienceSchema = z.object({
  title: languageSchema,
  description: descriptionSchema,
  category: z.string().min(1, "Wymagane"),
  price: z.number().min(0),
  duration: z.number().min(1),
  max_participants: z.number().min(1),
  difficulty: z.enum(['easy', 'edium', 'hard']),
  location: z.string().min(1, "Wymagane"),
  included: z.array(z.string()),
  not_included: z.array(z.string()),
  cancellation_policy: z.enum(['flexible', 'oderate', 'trict']),
  images: z.array(z.string().url()),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  initialData?: ExperienceFormValues;
  onSubmit: (data: ExperienceFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function ExperienceForm({ initialData, onSubmit, isLoading }: ExperienceFormProps) {
  const [activeLang, setActiveLang] = useState<'pl' | 'en' | 'is'>('pl');
  const [isUploading, setIsUploading] = useState(false);

  // // Obsluga formularza
  const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      title: { pl: '', en: '', is: '' },
      description: { pl: '', en: '', is: '' },
      category: '',
      price: 0,
      duration: 60,
      max_participants: 10,
      difficulty: 'edium',
      location: '',
      included: [],
      not_included: [],
      cancellation_policy: 'oderate',
      images: []
    }
  });

  const { fields: includedFields, append: appendIncluded, remove: removeIncluded } = useFieldArray({ control, name: 'included' });
  const { fields: notIncludedFields, append: appendNotIncluded, remove: removeNotIncluded } = useFieldArray({ control, name: 'not_included' });

  // TipTap Editor setup
  const EditorComponent = ({ name }: { name: keyof ExperienceFormValues }) => {
    const editor = useEditor({
      extensions: [StarterKit],
      content: watch(name as keyof ExperienceFormValues) as string,
      onUpdate: ({ editor }) => {
        setValue(name as keyof ExperienceFormValues, editor.getHTML() as any, { shouldValidate: true });
      },
    });

    return (
      <div className="border rounded-md p-2 min-h-[150px] bg-white dark:bg-zinc-950">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />
      </div>
    );
  };

  // // Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        from('experience-images')
        upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('experience-images').getPublicUrl(fileName);
      const currentImages = watch('images');
      setValue('images', [...currentImages, publicUrl]);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold">Edytuj Doświadczenie</h2>
        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          {(['pl', 'en', 'is'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeLang === lang? 'bg-white dark:bg-zinc-700 shadow text-blue-600' : 'text-zinc-500'}`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* // Tłumaczenia Tytułu */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tytuł ({activeLang.toUpperCase()})</label>
          <input
            {...register(`title.${activeLang}`)}
            className={`w-full p-2 border rounded-md ${errors.title? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'}`}
            placeholder="Wprowadź tytuł..."
          />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.pl?.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kategoria</label>
          <input {...register('category')} className="w-full p-2 border rounded-md dark:bg-zinc-950" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cena (ISK)</label>
          <input type="number" {...register('price', { valueAsNumber: true })} className="w-full p-2 border rounded-md dark:bg-zinc-950" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Czas trwania (min)</label>
          <input type="number" {...register('duration', { valueAsNumber: true })} className="w-full p-2 border rounded-md dark:bg-zinc-950" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max uczestników</label>
          <input type="number" {...register('max_participants', { valueAsNumber: true })} className="w-full p-2 border rounded-md dark:bg-zinc-950" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Trudność</label>
          <select {...register('difficulty')} className="w-full p-2 border rounded-md dark:bg-zinc-950">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* // Opis (Rich Text) */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Opis ({activeLang.toUpperCase()})</label>
        <EditorComponent name={`description.${activeLang}`} />
      </div>

      {/* // Galeria zdjęć */}
      <div className="space-y-4">
        <label className="text-sm font-medium">Zdjęcia</label>
        <div className="grid grid-cols-4 gap-4">
          {watch('images').map((url, idx) => (
            <div key={idx} className="relative aspect-square group">
              <img src={url} className="w-full h-full object-cover rounded-lg" alt="preview" />
              <button 
                type="button"
                onClick={() => {
                  const imgs = watch('images');
                  setValue('images', imgs.filter((_, i) => i!== idx));
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            {isUploading? <Loader2 className="animate-spin text-blue-500" /> : <Upload className="text-zinc-400" />}
            <span className="text-xs text-zinc-500 mt-2">Dodaj zdjęcie</span>
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button type="button" className="px-6 py-2 text-sm font-medium text-zinc-600">Anuluj</button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading? <Loader2 className="animate-spin" size={18} /> : 'Zapisz zmiany'}
        </button>
      </div>
    </form>
  );
}