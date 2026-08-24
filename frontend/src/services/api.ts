import type { AnalysisResult, ExtractResponse, SamplePost } from '../types';

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    // If running on Vite dev server (port 5173), connect directly to local FastAPI server
    if (window.location.port === '5173') {
      return 'http://127.0.0.1:8000/api';
    }
    // In production or when served by backend, use relative /api
    return '/api';
  }
  return 'http://127.0.0.1:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

export const apiService = {
  /**
   * Check backend health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE_URL}/health`, { 
        method: 'GET',
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Upload file (PDF or Image) or raw text for fast extraction
   */
  async extractContent(file?: File, rawText?: string): Promise<ExtractResponse> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (rawText) {
      formData.append('raw_text', rawText);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(`${API_BASE_URL}/extract`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to extract content' }));
        throw new Error(err.detail || 'Extraction failed');
      }

      return res.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Extraction timed out. Backend is processing — you can also edit/paste directly.');
      }
      throw error;
    }
  },

  /**
   * Perform comprehensive Content DNA analysis (< 20ms)
   */
  async analyzePost(text: string): Promise<AnalysisResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Failed to analyze content' }));
        throw new Error(err.detail || 'Analysis failed');
      }

      return res.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Analysis timed out. Please try again.');
      }
      throw error;
    }
  },

  /**
   * Fetch sample posts
   */
  async getSamplePosts(): Promise<SamplePost[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/sample-posts`);
      if (res.ok) {
        return res.json();
      }
    } catch {
      // Fallback handled in frontend static list
    }
    return [];
  }
};
