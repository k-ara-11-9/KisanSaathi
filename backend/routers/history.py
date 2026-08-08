from fastapi import APIRouter, HTTPException
from typing import List
from services.history_service import get_all_history, get_history_entry
from schemas.history_schema import HistoryEntry

router = APIRouter(prefix="/history", tags=["History"])

@router.get("/", response_model=List[HistoryEntry])
def list_history():
    return get_all_history()

@router.get("/{entry_id}", response_model=HistoryEntry)
def get_entry(entry_id: str):
    entry = get_history_entry(entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="History entry not found")
    return entry