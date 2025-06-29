"""
v1TrueFi/app/api.py
───────────────────
FastAPI surface for the Penny (TrueFi.ai) agent.

Key improvements vs. previous version
-------------------------------------
1. **No circular import** – `ChatResponse` and `RichContentData` now come from
   `app.api_models`, so `truefi_agent.py` and `api.py` never import each other.
2. **Lean imports & comments** – removed unused imports / duplication.
3. **Same runtime behaviour** – all public endpoints, CORS rules, logging,
   and turn-counter logic stay identical.
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ────────────────────────────────────────────
# Internal imports
# ────────────────────────────────────────────
from .api_models import ChatResponse, RichContentData
from .truefi_agent import (
    penny_global_agent,
    inject_context,
    log_full_conversation_turn,
    maybe_log_scenario,
    global_conversation_id_uuid,
)

logger = logging.getLogger(__name__)

# ────────────────────────────────────────────
# FastAPI initialisation
# ────────────────────────────────────────────
app = FastAPI(title="TrueFi.ai Penny API – V1", version="1.0.0")

# CORS for local React dev, Vercel front-end, etc.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://www.truefi.ai",
        "https://truefi-app-devin-patels-projects-19f12be6.vercel.app",
        "https://truefi.ai"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ────────────────────────────────────────────
# Pydantic input model (output models are imported)
# ────────────────────────────────────────────
class ChatRequest(BaseModel):
    session_id: str
    message: str


# ────────────────────────────────────────────
# Simple in-process turn counter (per container)
# ────────────────────────────────────────────
api_turn_counter: int = 0

# ────────────────────────────────────────────
# Routes
# ────────────────────────────────────────────
@app.post("/api/chat", response_model=ChatResponse)
async def handle_chat_request(request: ChatRequest) -> ChatResponse:
    """
    Main chat endpoint.

    1. Injects long-term context into the user question.
    2. Invokes the global Penny agent.
    3. Returns plain text plus optional structured payload for the UI.
    4. Logs full turn & maybe logs a financial scenario.
    """
    global api_turn_counter
    api_turn_counter += 1

    logger.info(
        "API V1: session=%s turn=%s user='%s'",
        request.session_id,
        api_turn_counter,
        request.message,
    )

    # ── 1. Pre-process / context injection ──────────────────────────────
    processed_query = inject_context(request.message)

    # ── 2. Agent call ────────────────────────────────────────────────────
    try:
        agent_result = await penny_global_agent.ainvoke({"input": processed_query})
        raw_output = agent_result.get("output")
    except Exception as agent_err:  # noqa: BLE001
        logger.error("Agent invocation failed: %s", agent_err, exc_info=True)
        raw_output = "I'm sorry, I hit an unexpected error while processing your request."

    # ── 3. Parse agent output ────────────────────────────────────────────
    reply_text: str = "Sorry, I encountered an issue generating a response."
    rich_content: Optional[RichContentData] = None

    if isinstance(raw_output, dict):
        reply_text = raw_output.get("text_response", str(raw_output))
        payload = raw_output.get("structured_data_for_ui")
        if isinstance(payload, dict):
            try:
                rich_content = RichContentData(
                    type=str(payload.get("type", "unknown")),
                    data=payload.get("data"),
                    title=str(payload.get("title")) if payload.get("title") else None,
                )
            except Exception as parse_err:  # noqa: BLE001
                logger.error("Failed to parse structured payload: %s", parse_err, exc_info=True)
                rich_content = None
                if reply_text == str(raw_output):
                    reply_text = "Error processing structured agent output."
    elif isinstance(raw_output, str):
        reply_text = raw_output
    elif raw_output is not None:  # unexpected type
        reply_text = str(raw_output)
        logger.warning("Agent output had unexpected type %s; coerced to str.", type(raw_output))

    # ── 4. Persist logs / scenarios ──────────────────────────────────────
    log_full_conversation_turn(
        global_conversation_id_uuid,
        api_turn_counter,
        request.message,
        reply_text,
    )
    maybe_log_scenario(
        request.message,
        reply_text,
        global_conversation_id_uuid,
    )

    # ── 5. Return response ───────────────────────────────────────────────
    return ChatResponse(
        reply=reply_text,
        session_id=request.session_id,
        rich_content=rich_content,
    )
