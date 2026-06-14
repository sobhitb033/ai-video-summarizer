from faster_whisper import WhisperModel
import subprocess
import uuid
import os

model = WhisperModel(
    "tiny",
    device="cpu",
    compute_type="int8"
)


def transcribe_audio(audio_path):

    print("STEP 3: Preparing audio for transcription...")

    wav_path = f"temp_{uuid.uuid4()}.wav"

    subprocess.run([
        "ffmpeg",
        "-i", audio_path,
        "-ar", "16000",
        "-ac", "1",
        wav_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    print("STEP 4: Transcribing audio...")

    segments, info = model.transcribe(
        wav_path,
        language="hi"
    )

    transcript = ""

    for segment in segments:
        transcript += segment.text

    os.remove(wav_path)

    return transcript