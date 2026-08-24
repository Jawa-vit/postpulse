import type { AnalysisResult, ExtractResponse, SamplePost } from '../types';

const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:8000/api');

export const apiService = {
  /**
   * Check backend health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Upload file (PDF or Image) or raw text for extraction
   */
  async extractContent(file?: File, rawText?: string): Promise<ExtractResponse> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (rawText) {
      formData.append('raw_text', rawText);
    }

    const res = await fetch(`${API_BASE_URL}/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to extract content' }));
      throw new Error(err.detail || 'Extraction failed');
    }

    return res.json();
  },

  /**
   * Perform comprehensive Content DNA analysis
   */
  async analyzePost(text: string): Promise<AnalysisResult> {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to analyze content' }));
      throw new Error(err.detail || 'Analysis failed');
    }

    return res.json();
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
