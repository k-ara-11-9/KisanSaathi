// Converted directly from the old app.js globals. Each of these is a stand-in
// for a real API call — wire them up via services/*.js + hooks/useFetch.js
// when the backend is ready.

export const FEATURES = [
  { icon: '🔎', title: 'Disease detection', desc: 'Photograph a leaf and get a diagnosis with treatment steps in seconds.' },
  { icon: '💧', title: 'Smart irrigation', desc: 'Know exactly when and how much to water, based on soil and weather.' },
  { icon: '🧪', title: 'Fertilizer recommendation', desc: "Dosage guidance tuned to your soil's NPK levels and crop stage." },
  { icon: '🏪', title: 'Mandi prices', desc: 'Compare live prices across nearby markets before you sell.' },
  { icon: '💬', title: 'AI chat assistant', desc: 'Ask anything about your crop in plain language, any time.' },
  { icon: '⛅', title: 'Weather intelligence', desc: 'Hyperlocal forecasts built specifically for farm decisions.' },
];

export const HOW = [
  { n: '01', t: 'Upload crop image', d: 'Snap a photo of any leaf, stem, or fruit showing symptoms.' },
  { n: '02', t: 'Analyze farm data', d: 'AI cross-checks it against soil, weather, and crop-stage data.' },
  { n: '03', t: 'Receive recommendations', d: 'Get a treatment or care plan in your language, instantly.' },
  { n: '04', t: 'Increase yield', d: 'Act early, avoid losses, and sell at the right time and price.' },
];

export const BENEFITS = [
  'Catch disease outbreaks 5–7 days earlier than visual inspection alone',
  'Cut water usage without risking crop stress',
  "Apply fertilizer only when and where it's actually needed",
  'Always know which nearby mandi pays the best net price',
];

export const TESTIMONIALS = [
  { name: 'Sunita Patil', role: 'Grape farmer, Nashik', quote: "The irrigation alerts alone saved my crop during last year's dry spell." },
  { name: 'D. Ramesh Rao', role: 'Agricultural Officer, Guntur', quote: 'I use the disease reports to prioritize which villages need a visit first.' },
  { name: 'Harpreet Singh', role: 'Wheat farmer, Ludhiana', quote: 'I check mandi prices every morning now — never sell blind anymore.' },
];

export const TECH = ['TensorFlow', 'PyTorch', 'React', 'Node.js', 'PostgreSQL', 'FastAPI', 'Computer Vision', 'IoT Soil Sensors', 'Twilio SMS', 'OpenWeather API'];

export const TEAM = [
  { name: 'Ananya Deshmukh', role: 'ML Engineer' },
  { name: 'Rohit Verma', role: 'Full-stack Developer' },
  { name: 'Fatima Sheikh', role: 'UX Designer' },
  { name: 'Karthik Iyer', role: 'Agri-domain Lead' },
];

export const MANDI_ROWS = [
  { name: 'Lasalgaon Mandi', dist: '2.3 km', price: 2840, trend: 'up', transport: 120, profit: 2720 },
  { name: 'Niphad Mandi', dist: '4.1 km', price: 2690, trend: 'up', transport: 160, profit: 2530 },
  { name: 'Pimpalgaon Mandi', dist: '7.8 km', price: 2510, trend: 'flat', transport: 240, profit: 2270 },
  { name: 'Yeola Mandi', dist: '12.4 km', price: 2110, trend: 'down', transport: 340, profit: 1770 },
  { name: 'Chandwad Mandi', dist: '15.0 km', price: 2380, trend: 'down', transport: 410, profit: 1970 },
];

export const HISTORY_ROWS = [
  { date: '04 Aug 2026', crop: 'Tomato', disease: 'Early Blight', rec: 'Fungicide + spacing fix', weather: '28°C, Humid', result: 'Treated' },
  { date: '29 Jul 2026', crop: 'Onion', disease: 'None detected', rec: 'Routine irrigation', weather: '31°C, Dry', result: 'Healthy' },
  { date: '21 Jul 2026', crop: 'Tomato', disease: 'Leaf Curl Virus', rec: 'Remove infected plants', weather: '27°C, Humid', result: 'Contained' },
  { date: '14 Jul 2026', crop: 'Cotton', disease: 'None detected', rec: 'Nitrogen top-dressing', weather: '29°C, Cloudy', result: 'Healthy' },
  { date: '02 Jul 2026', crop: 'Tomato', disease: 'Powdery Mildew', rec: 'Sulfur spray applied', weather: '26°C, Humid', result: 'Treated' },
];

export const NOTIFICATIONS = [
  { icon: '🌧️', tag: 'Rain alert', title: 'Heavy rain expected tomorrow, 6–9 AM', time: '12 min ago', unread: true },
  { icon: '⚠️', tag: 'Disease alert', title: 'Early blight risk elevated for tomato in your area', time: '2 hrs ago', unread: true },
  { icon: '💧', tag: 'Irrigation reminder', title: 'Field 2 irrigation window opens at 6:00 AM', time: '5 hrs ago', unread: true },
  { icon: '🏷️', tag: 'Market update', title: 'Onion prices up 6% at Lasalgaon Mandi', time: 'Yesterday', unread: false },
  { icon: '🧪', tag: 'Fertilizer reminder', title: 'Nitrogen top-dressing due in 3 days', time: '2 days ago', unread: false },
];

export const CHAT_HISTORY = ['Tomato yellowing leaves', 'Best irrigation timing', 'Onion prices this week', 'Cotton pest question'];
export const SUGGESTED_Q = ['Should I irrigate today?', 'My leaves are yellow.', 'Best time to sell tomatoes?', 'Weather tomorrow?'];

export const SOIL_DATA = [
  { label: 'Nitrogen (N)', val: 58, color: 'var(--danger)' },
  { label: 'Phosphorus (P)', val: 74, color: 'var(--warning)' },
  { label: 'Potassium (K)', val: 81, color: 'var(--accent)' },
  { label: 'pH level', val: 66, color: 'var(--accent)' },
  { label: 'Moisture', val: 45, color: 'var(--info)' },
];
