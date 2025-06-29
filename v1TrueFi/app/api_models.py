# v1TrueFi/app/api_models.py
from typing import Any, Optional
from pydantic import BaseModel

class RichContentData(BaseModel):
    type: str
    data: Any
    title: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: str
    rich_content: Optional[RichContentData] = None
