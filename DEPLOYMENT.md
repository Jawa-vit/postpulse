# 🌐 PostPulse Hosting & Deployment Guide

This guide explains how to host **PostPulse** and get a **live working application URL** for your project submission.

---

## 🏆 Option 1: 1-Click Free Hosting on Render (Recommended)

Render hosts the full application (Frontend + Backend + PyMuPDF + Tesseract OCR) using the included multi-stage `Dockerfile`.

### Step-by-Step Instructions:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: PostPulse content intelligence platform"
   # Create a repository on github.com, then:
   git remote add origin https://github.com/<your-username>/postpulse.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [render.com](https://render.com) and create a free account.
   - Click **"New +"** in the top-right corner and select **"Web Service"**.
   - Connect your GitHub account and select your `postpulse` repository.
   - Configure the following settings:
     - **Name**: `postpulse` (or your preferred name)
     - **Region**: Choose the closest region (e.g., *Oregon (US West)* or *Frankfurt*)
     - **Runtime**: **Docker** (Render will automatically detect `Dockerfile`)
     - **Instance Type**: **Free**
   - Click **"Create Web Service"**.

3. **Get Your Live URL**:
   - Render will automatically build the React frontend, configure Python with Tesseract OCR, and launch FastAPI.
   - In 2–3 minutes, your live URL will be ready at:
     ```text
     https://postpulse-xxxx.onrender.com
     ```
   - Test it by visiting the URL in your browser!

---

## ⚡ Option 2: Deploying with Docker Locally or on a VPS

If you have Docker installed on your machine or cloud server (AWS, DigitalOcean, Hetzner):

```bash
# Build and run the unified full-stack container
docker compose up --build -d
```
Access the application at: `http://localhost:8000`

---

## 🚀 Option 3: Separate Frontend on Vercel + Backend on Render

If you prefer hosting the React frontend on **Vercel** and the FastAPI backend on **Render**:

### 1. Backend on Render:
- Create a Render Web Service for the `backend/` folder (Python environment: `pip install -r requirements.txt`, start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`).
- Note your backend URL: `https://your-backend.onrender.com`.

### 2. Frontend on Vercel:
- Go to [vercel.com](https://vercel.com) -> New Project -> Import your repo.
- Set **Root Directory** to `frontend`.
- Add an Environment Variable:
  - `VITE_API_URL` = `https://your-backend.onrender.com/api`
- Click **Deploy**.

---

## 📋 Submission Checklist

- [x] **Working application URL**: e.g. `https://postpulse-app.onrender.com`
- [x] **GitHub repository link**: `https://github.com/<your-username>/postpulse`
- [x] **Approach write-up**: [`APPROACH.md`](APPROACH.md) (200 words max)
- [x] **Project documentation**: [`README.md`](README.md)
