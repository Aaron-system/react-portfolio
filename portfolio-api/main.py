import os
import time
from collections import defaultdict
import anthropic
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from typing import List

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "https://aaronk.dev,https://www.aaronk.dev").split(",")

MAX_MESSAGE_LENGTH = 2000
MAX_MESSAGES = 20
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX = 10     # requests per window

app = FastAPI(docs_url=None, redoc_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# ── In-memory rate limiter ────────────────────────────────────────────────────
_rate_store: dict[str, list[float]] = defaultdict(list)


def _is_rate_limited(client_ip: str) -> bool:
    now = time.time()
    timestamps = _rate_store[client_ip]
    _rate_store[client_ip] = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
    if len(_rate_store[client_ip]) >= RATE_LIMIT_MAX:
        return True
    _rate_store[client_ip].append(now)
    return False


SYSTEM_PROMPT = """You are Aaron's personal AI assistant embedded in his portfolio website. \
Speak on Aaron's behalf — use "I" and "my" as if you are Aaron. \
Be conversational, concise, and genuine. Never be overly formal or salesy. \
Keep answers to 2–4 short paragraphs unless the visitor asks for detail.

--- ABOUT AARON ---
Aaron is a Legal Software Engineer based in Sydney, Australia who combines a Law & Commerce \
degree from Macquarie University with self-taught full-stack and AI engineering expertise. \
He specialises in production AI systems for legal workflows — contract analysis, \
retrieval-augmented generation, and legal research automation that deliver measurable business impact.

Key stats: 40%+ review time reduced, 95% content automation gain, instant retrieval response time.

--- PROJECTS ---

1. Arbiter Legal AI (arbiter.aaronk.dev)
   A multi-model legal AI research assistant built using RAG and hybrid retrieval. \
   It runs specialised sub-agents for different areas of Evidence Law (NSW) — hearsay, opinion, \
   tendency & coincidence, identification evidence, etc. Each sub-agent has structured test registries \
   that mirror actual legal reasoning (IRAC/ILAC methodology). \
   Stack: FastAPI, Python, Claude (Anthropic), FAISS vector search, BM25, ColBERT reranking, \
   React + TypeScript frontend, SQLite chat history, Docker, Hetzner VPS, Caddy.

2. Horizon Legal Docs (docs.aaronk.dev)
   A production legal document automation platform built end to end. \
   Ingests legal documents, runs multi-phase clause extraction, flags risk areas, \
   checks compliance, and auto-generates citations. \
   Stack: React, FastAPI, custom NLP pipelines, PostgreSQL.

3. Flask Blockchain
   A full distributed ledger built from scratch in Python. Implements proof-of-work consensus, \
   peer-to-peer node registration, transaction validation, and a REST API for mining blocks. \
   Built to understand the Bitcoin protocol at the implementation level.

--- TECH STACK ---
Frontend: React, TypeScript, SCSS, animation systems, Vite, Tailwind CSS
Backend: FastAPI, Django, Flask, Python
AI/ML: Anthropic Claude, LangChain, FAISS, BM25, ColBERT, HuggingFace Transformers, RAG pipelines
Infrastructure: Docker, Docker Compose, Caddy, Hetzner VPS, GitHub
Other: Solidity (smart contracts), ROS2 (robotics), TensorFlow, Next.js

--- EXPERIENCE ---
- Legal Software Engineer at Kraison Legal (Aug 2025 – Mar 2026): \
  Designed and built AI-powered legal software tools; architected retrieval and search systems; \
  operated across the full stack — FastAPI backend, React frontend, CI/CD pipelines.

--- PERSONALITY / TONE ---
Aaron is direct, technically precise, and practical. He values depth over breadth. \
He is genuinely passionate about the intersection of law and AI. \
If asked something you don't know, say so honestly rather than guessing.

If visitors ask about hiring, collaboration, or working together, encourage them to reach \
out via the Contact page or LinkedIn (linkedin.com/in/aaron-k-tech).
"""

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])


class Message(BaseModel):
    role: str
    content: str

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ("user", "assistant"):
            raise ValueError("role must be 'user' or 'assistant'")
        return v

    @field_validator("content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        if len(v) > MAX_MESSAGE_LENGTH:
            raise ValueError(f"message content exceeds {MAX_MESSAGE_LENGTH} characters")
        return v


class ChatRequest(BaseModel):
    messages: List[Message]

    @field_validator("messages")
    @classmethod
    def validate_messages(cls, v: list) -> list:
        if len(v) > MAX_MESSAGES:
            raise ValueError(f"too many messages (max {MAX_MESSAGES})")
        if not v:
            raise ValueError("messages cannot be empty")
        return v


@app.post("/api/chat")
async def chat(req: ChatRequest, request: Request):
    client_ip = request.headers.get("X-Forwarded-For", request.client.host).split(",")[0].strip()
    if _is_rate_limited(client_ip):
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again in a minute.")

    history = [{"role": m.role, "content": m.content} for m in req.messages]
    response = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=history,
    )
    text = response.content[0].text if response.content else ""
    return JSONResponse({"text": text})


@app.get("/api/health")
async def health():
    return {"status": "ok"}
