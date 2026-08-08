"""
Very simple in-memory conversation tracker, keyed by phone number.

Lets a stateless SMS webhook behave like a short conversation - e.g.
"HI" shows a menu, and the next message is interpreted based on what
step that farmer is currently on.

NOTE: resets if the server restarts, and won't work across multiple
server instances. Fine for a hackathon demo - a real version would
use a database or Redis.
"""

from typing import Dict, Optional

_sessions: Dict[str, str] = {}


def get_state(phone: str) -> Optional[str]:
    return _sessions.get(phone)


def set_state(phone: str, state: Optional[str]):
    if state is None:
        _sessions.pop(phone, None)
    else:
        _sessions[phone] = state