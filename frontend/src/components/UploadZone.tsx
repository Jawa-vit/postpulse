import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, CheckCircle, ArrowRight, RefreshCw, FileCode, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import type { SamplePost } from '../types';
import { apiService } from '../services/api';

interface UploadZoneProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
  samplePosts: SamplePost[];
  onSelectSample: (sample: SamplePost) => void;
  currentText: string;
  onTextChange: (text: string) => void;
  extractedMeta?: {
    fileName: string;
    fileType: string;
    wordCount: number;
    charCount: number;
    engine?: string;
  } | null;
  onMetaUpdate: (meta: any) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onAnalyze,
  isAnalyzing,
  samplePosts,
  onSelectSample,
  currentText,
  onTextChange,
  extractedMeta,
  onMetaUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl(null);
    }

    setIsExtracting(true);

    try {
      const res = await apiService.extractContent(file);
      if (res && res.text && res.text.trim()) {
        onTextChange(res.text.trim());
        onMetaUpdate({
          fileName: res.file_name || file.name,
          fileType: res.file_type || (file.type.includes('pdf') ? 'pdf' : 'image'),
          wordCount: res.word_count || res.text.trim().split(/\s+/).length,
          charCount: res.character_count || res.text.length,
          engine: res.details?.engine || (file.type.includes('pdf') ? 'PyMuPDF Parser' : 'Windows AI OCR')
        });
      } else {
        // If image has no detectable text (or pure graphic), clear old stale sample so user can write their draft
        onTextChange('');
        onMetaUpdate({
          fileName: file.name,
          fileType: file.type.includes('pdf') ? 'pdf' : 'image',
          wordCount: 0,
          charCount: 0,
          engine: 'Visual Attachment'
        });
      }
    } catch {
      // Fallback
      onMetaUpdate({
        fileName: file.name,
        fileType: file.type.includes('pdf') ? 'pdf' : 'image',
        wordCount: 0,
        charCount: 0,
        engine: 'Document Attached'
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onMetaUpdate(null);
  };

  const handleSubmit = () => {
    if (currentText.trim()) {
      onAnalyze(currentText);
    }
  };

  const wordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;
  const charCount = currentText.length;

  return (
    <div className="w-full glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-2xl space-y-6">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Content Ingestion & Extraction Engine
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
              PDF & OCR Ready
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Drop any social media screenshot, multi-page PDF draft, or type your post directly.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document / Image</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Direct Text Editor</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Upload Zone */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                  : 'border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/50 hover:bg-slate-900/80'
              }`}
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-indigo-600/20 to-cyan-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                Drag and drop your PDF or Screenshot here
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mb-3">
                Supports Instagram/LinkedIn screenshots, multi-column PDFs, or scanned documents.
              </p>
              <div className="inline-flex items-center space-x-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
                <span>Browse Local Files</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">PDF, PNG, JPG, WEBP</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {filePreviewUrl ? (
                  <img
                    src={filePreviewUrl}
                    alt="Uploaded preview"
                    className="w-16 h-16 object-cover rounded-lg border border-slate-700 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <FileText className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-white text-sm">{selectedFile.name}</div>
                  <div className="text-xs text-slate-400">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Document'}
                  </div>
                  <div className="mt-1">
                    {isExtracting ? (
                      <div className="flex items-center space-x-1.5 text-indigo-400 text-xs">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting document text with fast OCR...</span>
                      </div>
                    ) : extractedMeta && extractedMeta.wordCount > 0 ? (
                      <div className="flex items-center space-x-1.5 text-emerald-400 text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Extracted {extractedMeta.wordCount} words via {extractedMeta.engine || 'OCR'}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-sky-400 text-xs">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Document attached — you can edit or enter your post draft below.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-xs text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Change File
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Extracted / Current Content Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 font-semibold text-slate-300">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Extracted Document Text / Editable Draft</span>
            {extractedMeta && extractedMeta.wordCount > 0 && (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3" />
                <span>{extractedMeta.engine || 'Engine'}</span>
              </span>
            )}
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            {wordCount} words • {charCount} chars
          </span>
        </div>

        <div className="relative">
          <textarea
            value={currentText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Document text appears here automatically after upload. You can also write or edit your draft directly here..."
            rows={5}
            className="w-full bg-slate-900/90 text-slate-100 text-xs sm:text-sm rounded-xl p-4 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-y placeholder-slate-500 font-sans leading-relaxed"
          />
        </div>
      </div>

      {/* Quick Test Presets & Action Button */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quick Test Presets:</span>
          </span>
          {samplePosts.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectSample(sample)}
              className="text-xs bg-slate-900 hover:bg-indigo-600/15 text-slate-300 hover:text-indigo-300 border border-slate-800 hover:border-indigo-500/40 px-3 py-1.5 rounded-lg transition-all font-medium"
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Submit Action Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isAnalyzing || isExtracting || !currentText.trim()}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-xl shrink-0 ${
            isAnalyzing || isExtracting || !currentText.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] cursor-pointer'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Content DNA & Scroll Risk...</span>
            </>
          ) : (
            <>
              <span>Analyze & Profile Post</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
