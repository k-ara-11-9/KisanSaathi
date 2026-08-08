// src/utils/api.js
//
// Central API client for the KisanSaathi backend.
// In dev, requests go to /api/* and Vite proxies them to FastAPI (see vite.config.js).
// In prod, set VITE_API_BASE_URL in your .env to the deployed backend URL.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {
      // response wasn't JSON, keep statusText
    }
    throw new ApiError(detail, res.status, detail);
  }
  // 204 No Content etc.
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Disease detection: POST /disease/predict
 * Accepts a File/Blob (e.g. from an <input type="file">).
 */
export async function predictDisease(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);

  const res = await fetch(`${BASE_URL}/disease/predict`, {
    method: 'POST',
    body: formData,
    // NOTE: do not set Content-Type manually — the browser sets the
    // multipart boundary automatically when body is a FormData instance.
  });
  return handleResponse(res);
}

/**
 * History: GET /history/
 */
/**
 * History: GET /history/{entry_id}
 */
export async function getHistoryEntry(entryId) {
  const res = await fetch(`${BASE_URL}/history/${entryId}`);
  return handleResponse(res);
}

/**
 * Recommendation: POST /recommendation
 * payload shape: { crop, growth_stage, latitude?, longitude?, soil?, farmer_routine?, diseases?, plan_days? }
 */
export async function getRecommendation(payload) {
  const res = await fetch(`${BASE_URL}/recommendation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/**
 * Chat: POST /chat
 * Free-text Q&A that returns a full recommendation with simple_advice tailored to the question.
 * payload shape: { message, disease_class?, language?, history? }
 */
export async function chatRecommendation(payload) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export { ApiError };
