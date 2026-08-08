"""
Parses incoming SMS text into a structured command.

Expected formats (case-insensitive), e.g.:
    PRICE WHEAT
    WEATHER 110001
"""

from typing import Optional
from pydantic import BaseModel


class ParsedCommand(BaseModel):
    command: str
    argument: Optional[str] = None
    raw_text: str


def parse_incoming_sms(text: str) -> ParsedCommand:
    text = (text or "").strip()
    parts = text.split(maxsplit=1)

    if not parts:
        return ParsedCommand(command="UNKNOWN", argument=None, raw_text=text)

    command = parts[0].upper()
    argument = parts[1] if len(parts) > 1 else None

    return ParsedCommand(command=command, argument=argument, raw_text=text)
