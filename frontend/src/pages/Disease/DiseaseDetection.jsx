import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { predictDisease } from '../../utils/api.js';

export default function DiseaseDetection() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await predictDisease(file);
      setResult(res);
    } catch (err) {
      setResult({ error: err.message || 'Analysis failed. Please try again.' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Crop Health</div>
        <h1>Disease Detection</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', maxWidth: 620, lineHeight: 1.6 }}>
          Upload a clear leaf photo and get a practical diagnosis with a suggested treatment plan.
        </p>
      </div>

      <div className="dash-grid">
        <div className="col-12">
          <Card className="disease-hero">
            <div className="disease-hero__title">
              <h3>Fast, practical crop screening</h3>
              <p>Use a sharp image taken in daylight to get better confidence and more relevant next steps.</p>
            </div>
            <div className="disease-checklist">
              <div className="check">✓ Focus on the leaf surface and visible spots</div>
              <div className="check">✓ Avoid blurry or highly shadowed photos</div>
              <div className="check">✓ Review the treatment guidance before spraying</div>
            </div>
          </Card>
        </div>

        <div className="col-7">
          <Card title="Upload a leaf photo">
            <div className="disease-upload-shell">
              {!file ? (
                <label
                htmlFor="dz-input"
                style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '48px 20px',
      border: '2px solid #4a8c3f',
      borderRadius: 12,
      cursor: 'pointer',
      background: 'rgba(74, 140, 63, 0.04)',
    }}
  >
    <div style={{ fontSize: '2rem', marginBottom: 8 }} aria-hidden="true">📷</div>
    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click to upload or drag a photo</div>
    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>JPG or PNG, up to 10MB</div>
    <input id="dz-input" type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
  </label>
) : (
                <div className="disease-upload-panel">
                  <div className="disease-display">
                    <img src={URL.createObjectURL(file)} alt="Uploaded leaf" />
                  </div>
                  <div className="result-actions">
                    <Button variant="primary" onClick={runAnalysis} disabled={analyzing}>
                      {analyzing ? 'Analyzing...' : 'Run Analysis'}
                    </Button>
                    <Button variant="outline" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="col-5">
          <Card title="Latest analysis">
            {analyzing && <Loader block label="AI is scanning every part of the plant..." />}

            {!analyzing && !result && (
              <div className="disease-result">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  Upload a photo and run analysis to see a diagnosis here.
                </p>
              </div>
            )}

            {!analyzing && result?.error && (
              <div className="disease-result">
                <p style={{ color: 'var(--danger, #c0392b)', fontSize: '0.88rem', margin: 0 }}>
                  {result.error}
                </p>
              </div>
            )}

            {!analyzing && result && !result.error && !result.disease && (
              <div className="disease-result">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                  {result.message || 'No leaf detected. Try a clearer photo.'}
                </p>
              </div>
            )}

            {!analyzing && result?.disease && (
              <div className="disease-result">
                <div className="result-score">
                  <span className={`chip ${result.is_healthy ? 'chip-leaf' : 'chip-danger'}`}>
                    {result.is_healthy ? 'Healthy' : result.disease}
                  </span>
                  <strong>{Math.round((result.confidence || 0) * 100)}% confidence</strong>
                </div>
                {result.crop && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Crop: {result.crop}
                  </p>
                )}
                {result.solution_brief && (
                  <div className="result-card">
                    <strong>Recommended action</strong>
                    <p style={{ margin: '6px 0 0', lineHeight: 1.6 }}>{result.solution_brief}</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}