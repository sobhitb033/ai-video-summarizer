from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import json

from app.youtube import download_video
from app.transcriber import transcribe_audio
from app.llm import generate_summary, generate_quiz
from app.captions import get_captions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_valid_transcript(text: str):
    if not text or len(text) < 100:
        return False

    bad_signals = [
        "google",
        "automated query",
        "unusual traffic",
        "403",
        "error",
        "forbidden"
    ]

    text_lower = text.lower()

    for word in bad_signals:
        if word in text_lower:
            return False

    return True


def stream_process(url: str):
    try:
        # STEP 1
        yield f"data: {json.dumps({'step': 'Downloading audio...'})}\n\n"
        audio_path = download_video(url)

        # STEP 2
        yield f"data: {json.dumps({'step': 'Checking captions...'})}\n\n"
        transcript = get_captions(url)

        if transcript:
            yield f"data: {json.dumps({'step': 'Using captions ⚡'})}\n\n"
        else:
            yield f"data: {json.dumps({'step': 'Transcribing audio... 🐢'})}\n\n"
            transcript = transcribe_audio(audio_path)

        if not is_valid_transcript(transcript):
            yield f"data: {json.dumps({'error': '❌ Could not extract valid lecture. Try another video.'})}\n\n"
            return

        # LIMIT SIZE
        transcript = transcript[:4000]

        # STEP 3
        yield f"data: {json.dumps({'step': 'Generating summary...'})}\n\n"
        summary = generate_summary(transcript)

        # STEP 4
        yield f"data: {json.dumps({'step': 'Generating quiz...'})}\n\n"
        quiz = generate_quiz(summary)

        # FINAL OUTPUT
        final = {
            "done": True,
            "summary": summary,
            "quiz": quiz
        }

        yield f"data: {json.dumps(final)}\n\n"

    except Exception as e:
        yield f"data: {json.dumps({'error': str(e)})}\n\n"


@app.get("/process-video-stream")
def process_video_stream(url: str):
    return StreamingResponse(stream_process(url), media_type="text/event-stream")