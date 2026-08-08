import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
// import { detectDisease } from '../../services/diseaseService';

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

  const runAnalysis = () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);
    // Replace with: const res = await detectDisease(file); setResult(res);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        disease: 'Early Blight',
        confidence: 92,
        treatment: 'Apply a copper-based fungicide and improve plant spacing to reduce humidity.',
      });
    }, 1100);
  };

  return (
    <DashboardLayout>
      <div className="page-heading">
        <div className="eyebrow">Crop Health</div>
        <h1>Disease Detection</h1>
      </div>

      <div className="dash-grid">
        <div className="col-6">
          <Card title="Upload a leaf photo">
            {!file ? (
              <label className="dropzone" htmlFor="dz-input">
                <div className="dz-icon" aria-hidden="true">📷</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click to upload or drag a photo</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>JPG or PNG, up to 10MB</div>
                <input id="dz-input" type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </label>
            ) : (
              <div>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded leaf"
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: 260, objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <Button variant="primary" onClick={runAnalysis} disabled={analyzing}>
                    {analyzing ? 'Analyzing...' : 'Run Analysis'}
                  </Button>
                  <Button variant="outline" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="col-6">
          <Card title="Results">
            {analyzing && <Loader block label="AI is scanning every part of the plant..." />}
            {!analyzing && !result && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Upload a photo and run analysis to see a diagnosis here.</p>
            )}
            {!analyzing && result && (
              <div>
                <div className="chip chip-danger" style={{ marginBottom: 12 }}>{result.disease}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Confidence: <b style={{ color: 'var(--text-primary)' }}>{result.confidence}%</b>
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6 }}>{result.treatment}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
