from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from openai import OpenAI

from pypdf import PdfReader
from io import BytesIO
import sys

print("PYTHON PATH:", sys.executable)

import json
import os

# LOAD ENV
load_dotenv()

print(os.getenv("OPENROUTER_API_KEY"))

# OPENROUTER CLIENT
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# FASTAPI
app = FastAPI()

# CONNECT FRONTEND
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CHAT ROUTE
@app.post("/chat")
async def chat(
    message: str = Form(...),
    history: str = Form("[]"),
    file: UploadFile = File(None)
):
    try:

        history = json.loads(history)

        print("=" * 50)

        if file:
            print("FILE RECEIVED:", file.filename)
        else:
            print("NO FILE RECEIVED")

        print("=" * 50)

        # SYSTEM MESSAGE
        messages = [
            {
                "role": "system",
                "content": """
You are Analy AI.

You are a professional AI scholarship and study abroad assistant.
Provide clear, detailed, student-friendly answers.
"""
            }
        ]

        # ADD CHAT HISTORY
        messages.extend(history)

        # HANDLE PDF
        if file and file.filename.lower().endswith(".pdf"):

            pdf_bytes = await file.read()

            pdf_reader = PdfReader(BytesIO(pdf_bytes))

            text_content = ""

            for page in pdf_reader.pages:
                text_content += page.extract_text() or ""

            print("TEXT LENGTH:", len(text_content))
            print("FIRST 500 CHARS:")
            print(text_content[:500])

            messages.append({
                "role": "system",
                "content": f"""
The user uploaded a PDF.

Filename: {file.filename}

Document Content:

{text_content[:15000]}
"""
            })

        # ADD USER MESSAGE
        messages.append({
            "role": "user",
            "content": message
        })

        print("TOTAL MESSAGES:", len(messages))
        print("LAST MESSAGE:")
        print(messages[-1])

        completion = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=messages
        )

        reply = completion.choices[0].message.content

        return {
            "response": reply
        }

    except Exception as e:
        print("ERROR:", str(e))

        return {
            "response": f"Error: {str(e)}"
        }