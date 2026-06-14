from youtube_transcript_api import YouTubeTranscriptApi
import re


def extract_video_id(url: str):
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)
    return match.group(1) if match else None


def get_captions(url: str):
    try:
        video_id = extract_video_id(url)

        transcript = YouTubeTranscriptApi.get_transcript(
            video_id,
            languages=["hi", "en"]
        )

        return " ".join([t["text"] for t in transcript])

    except Exception:
        return None