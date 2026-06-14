# 🎓 AI Video Summarizer & Quiz Generator

Transform YouTube educational videos into structured study notes and interactive quizzes using AI.

This project automatically:

- 📥 Extracts lecture audio from YouTube videos
- 📝 Generates accurate transcripts using Faster-Whisper
- 📚 Creates well-structured study notes using Google Gemini
- ❓ Generates MCQ quizzes from the generated notes
- 🎯 Helps students revise faster and learn more effectively

---

# 🚀 Features

### 🎥 YouTube Video Processing

- Paste any YouTube lecture URL
- Automatic audio extraction
- Supports long educational videos

### 🧠 AI-Powered Notes Generation

- Converts lectures into clean, organized notes
- Proper headings and subheadings
- Bullet points and explanations
- Markdown formatting support

### ❓ Automatic Quiz Generation

- Generates multiple-choice questions
- Instant feedback
- Score calculation
- Quiz retry functionality

### ⚡ Fast Processing

- Faster-Whisper transcription engine
- Efficient FastAPI backend
- Real-time progress updates

### 🌙 Modern UI

- Responsive design
- Dark mode support
- Interactive user experience

---

# 🛠 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Markdown
- Lucide React Icons

## Backend

- FastAPI
- Python 3.11
- Faster-Whisper
- FFmpeg
- Google Gemini API

## AI Models

- Faster-Whisper (Speech-to-Text)
- Gemini Flash (Notes & Quiz Generation)

---

# 📂 Project Structure

```text
ai-video-summarizer/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── youtube.py
│   │   ├── captions.py
│   │   ├── transcriber.py
│   │   └── llm.py
│   │
│   ├── requirements.txt
│   ├── .env.example
│   └── venv/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation Guide

## Prerequisites

Install the following:

### 1. Python 3.11

Download:

https://www.python.org/downloads/

Verify:

```bash
python3 --version
```

---

### 2. Node.js

Download:

https://nodejs.org

Verify:

```bash
node -v
npm -v
```

---

### 3. FFmpeg

#### Mac

```bash
brew install ffmpeg
```

#### Windows

Download:

https://ffmpeg.org/download.html

Verify:

```bash
ffmpeg -version
```

---

# 🔑 Gemini API Setup

Create a Gemini API key:

https://aistudio.google.com/app/apikey

---

Inside:

```text
backend/
```

create:

```text
.env
```

Add:

```env
GEMINI_KEY_1=YOUR_API_KEY_HERE
GEMINI_KEY_2=YOUR_SECOND_API_KEY_HERE
```

You may use the provided:

```text
.env.example
```

as a template.

---

# 🖥 Backend Setup

Move into backend:

```bash
cd backend
```

---

## Create Virtual Environment

### Mac / Linux

```bash
python3.11 -m venv venv
```

Activate:

```bash
source venv/bin/activate
```

---

### Windows

```bash
py -3.11 -m venv venv
```

Activate:

```bash
venv\Scripts\activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Start Backend Server

```bash
uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm start
```

Frontend runs at:

```text
http://localhost:3000
```

---

# 🎯 How To Use

### Step 1

Start Backend:

```bash
uvicorn app.main:app --reload
```

### Step 2

Start Frontend:

```bash
npm start
```

### Step 3

Open:

```text
http://localhost:3000
```

### Step 4

Paste a YouTube lecture URL.

Example:

```text
https://www.youtube.com/watch?v=VIDEO_ID
```

### Step 5

Click:

```text
Generate
```

### Step 6

Wait for:

- Audio Extraction
- Transcription
- Notes Generation
- Quiz Generation

### Step 7

Read generated notes and take the quiz.

---

# 📸 Screenshots

Add screenshots here later.

Example:

```md
## Home Page

![Home](screenshots/home.png)

## Summary Page

![Summary](screenshots/summary.png)

## Quiz Page

![Quiz](screenshots/quiz.png)
```

---

# 🔮 Future Improvements

- PDF export
- Notes download
- Quiz download
- Local video upload support
- Multi-language support
- User authentication
- Progress tracking
- Flashcard generation
- Lecture search functionality

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

# 📜 License

This project is intended for educational and learning purposes.

---

# 👨‍💻 Author

**Sobhit Bhalla**

- GitHub: https://github.com/sobhitb033

---

# ⭐ Support

If you found this project useful:

⭐ Star the repository

and share it with others.
