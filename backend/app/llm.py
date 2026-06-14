from google import genai
from dotenv import load_dotenv
import os
import time
import json

load_dotenv()

API_KEYS = [
    os.getenv("GEMINI_KEY_1"),
    os.getenv("GEMINI_KEY_2")
]
def get_client(api_key):
    return genai.Client(api_key=api_key)


def generate_summary(transcript):

    prompt = f"""
You are an expert teacher.

Convert the lecture into CLEAN, BEAUTIFUL markdown notes.

STRICT RULES:
- ALWAYS put space after # (e.g. "# Heading")
- Use proper markdown
- Use headings (##, ###)
- Use bullet points
- Add spacing between sections
- Fix formatting issues
- Make it look like professional notes

IMPORTANT FORMATTING RULES:
- DO NOT use LaTeX
- DO NOT use $...$
- DO NOT use \\(...\\)
- DO NOT use mathematical markdown
- Write complexities in plain text:
  O(n)
  O(log n)
  O(n log n)
  O(n²)

- Render markdown tables correctly
- Never output escaped markdown
- Never output raw markdown symbols inside explanations

Transcript:
{transcript}
"""

    for attempt in range(3):
        for i, key in enumerate(API_KEYS):
            try:
                print(f"🔑 Using key {i+1}")
                client = get_client(key)

                res = client.models.generate_content(
                    model="gemini-3-flash-preview",
                    contents=prompt
                )

                return res.text.strip()

            except Exception as e:
                print("❌", e)

        time.sleep(2)

    return "❌ Summary failed"


def generate_quiz(summary):

    prompt = f"""
Create 10 MCQs.

STRICT: RETURN ONLY JSON.

Format:
[
  {{
    "question": "...",
    "options": ["A","B","C","D"],
    "answer": "A"
  }}
]

Notes:
{summary}
"""

    for attempt in range(3):
        for i, key in enumerate(API_KEYS):
            try:
                client = get_client(key)

                res = client.models.generate_content(
                    model="gemini-3-flash-preview",
                    contents=prompt
                )

                raw = res.text.strip()

                if raw.startswith("```"):
                    raw = raw.split("```")[1]

                data = json.loads(raw)

                if not isinstance(data, list):
                    raise ValueError("Bad quiz format")

                return data

            except Exception as e:
                print("❌", e)

        time.sleep(2)

    return []