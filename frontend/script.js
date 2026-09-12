// COGNIFY FRONTEND
// Open http://127.0.0.1:8000/frontend/ after starting the Python backend.
// Sample data remains available; real uploads use the existing Python agents.

// 1. Dummy data
// BACKEND INTEGRATION POINT: Candidate ranking API.
// Sample results are preserved for the existing demo; live results replace the displayed array.
// Keep this object shape, or update the rendering functions to match your API.
const sampleCandidates = [
  {
    id: 1,
    rank: 1,
    name: 'Aarav Gupta',
    initials: 'AG',
    role: 'AI/ML Engineer',
    matchScore: 94,
    skillsMatch: 92,
    experienceMatch: 90,
    projectEvidence: 96,
    experience: 3.5,
    github: 'Verified',
    recommendation: 'Strong Fit',
    color: 'purple',
    matchedSkills: ['Python', 'Machine Learning', 'FastAPI', 'SQL', 'REST APIs', 'Git'],
    missingSkills: ['AWS', 'MLOps'],
    education: 'B.Tech in Computer Science, Pune Institute of Computer Technology, 2022.',
    experienceSummary: '3.5 years building machine learning features and Python APIs. Delivered document search, model evaluation, and data processing workflows.',
    strengths: ['Strong Python knowledge', 'Relevant ML experience', 'Verified AI projects', 'Good role alignment'],
    concerns: ['Limited AWS experience', 'Limited MLOps evidence'],
    summary: 'Aarav Gupta is a strong fit for the AI Engineer role. Resume and GitHub analysis show strong Python, machine learning and LLM project experience. Main gaps are AWS and MLOps. Recommended for technical interview.',
    nextStep: 'Proceed to Technical Interview',
    projects: [
      {
        name: 'RAG Document Assistant',
        technologies: ['Python', 'LangChain', 'FAISS', 'FastAPI'],
        score: 96,
        reason: 'Strong evidence of LLM application development and retrieval pipeline implementation.',
        url: 'https://github.com/topics/retrieval-augmented-generation'
      },
      {
        name: 'ML Recommendation System',
        technologies: ['Python', 'scikit-learn', 'Pandas', 'SQL'],
        score: 91,
        reason: 'Demonstrates collaborative filtering, feature engineering, and recommendation evaluation.',
        url: 'https://github.com/topics/recommendation-system'
      }
    ]
  },
  {
    id: 2,
    rank: 2,
    name: 'Riya Mehta',
    initials: 'RM',
    role: 'Machine Learning Engineer',
    matchScore: 89,
    skillsMatch: 88,
    experienceMatch: 95,
    projectEvidence: 88,
    experience: 4,
    github: 'Verified',
    recommendation: 'Good Fit',
    color: 'cyan',
    matchedSkills: ['Python', 'Machine Learning', 'SQL', 'REST APIs', 'Git'],
    missingSkills: ['AWS', 'MLOps', 'Docker'],
    education: 'B.E. in Information Technology, Mumbai University, 2021.',
    experienceSummary: '4 years developing text classification and predictive analytics applications. Collaborated with product teams on model evaluation and API delivery.',
    strengths: ['Strong NLP foundations', 'Solid Python experience', 'Verified classification project', 'Meets experience requirement'],
    concerns: ['Limited cloud deployment evidence', 'No container deployment examples', 'Limited production monitoring'],
    summary: 'Riya Mehta is a good fit for the AI Engineer role. Her NLP work and four years of Python experience provide relevant foundations. Explore cloud deployment, Docker, and production ML operations during the interview.',
    nextStep: 'Proceed to Technical Interview',
    projects: [
      {
        name: 'Support Ticket Classifier',
        technologies: ['Python', 'PyTorch', 'Pandas', 'Flask'],
        score: 88,
        reason: 'Relevant NLP classification, model comparison, and documented validation metrics.',
        url: 'https://github.com/topics/text-classification'
      }
    ]
  },
  {
    id: 3,
    rank: 3,
    name: 'Karan Shah',
    initials: 'KS',
    role: 'Python Developer',
    matchScore: 84,
    skillsMatch: 81,
    experienceMatch: 80,
    projectEvidence: 82,
    experience: 2,
    github: 'Partial',
    recommendation: 'Consider',
    color: 'amber',
    matchedSkills: ['Python', 'Machine Learning', 'SQL', 'Git'],
    missingSkills: ['AWS', 'MLOps', 'Deep Learning', 'FastAPI'],
    education: 'B.Tech in Computer Engineering, Gujarat Technological University, 2023.',
    experienceSummary: '2 years supporting Python services and analytics tooling. Built data collection jobs, dashboards, and basic model prototypes.',
    strengths: ['Practical Python development', 'Good SQL foundations', 'Relevant analytics project'],
    concerns: ['Limited deep learning experience', 'Partial project evidence', 'Cloud and API framework gaps'],
    summary: 'Karan Shah has useful Python and SQL experience and meets the minimum experience requirement. Project evidence is partial, with gaps in deep learning, FastAPI, AWS, and MLOps. A focused technical screen can clarify readiness.',
    nextStep: 'Schedule an Initial Technical Screen',
    projects: [
      {
        name: 'Sales Prediction API',
        technologies: ['Python', 'Flask', 'scikit-learn', 'SQL'],
        score: 82,
        reason: 'Shows regression modeling and a basic API. Deployment and test coverage evidence is incomplete.',
        url: 'https://github.com/topics/sales-prediction'
      }
    ]
  },
  {
    id: 4,
    rank: 4,
    name: 'Ananya Rao',
    initials: 'AR',
    role: 'Data Scientist',
    matchScore: 81,
    skillsMatch: 80,
    experienceMatch: 88,
    projectEvidence: 85,
    experience: 3,
    github: 'Verified',
    recommendation: 'Consider',
    color: 'green',
    matchedSkills: ['Python', 'Machine Learning', 'SQL', 'AWS', 'Git'],
    missingSkills: ['MLOps', 'FastAPI', 'Docker'],
    education: 'M.Sc. in Data Science, Christ University, 2022.',
    experienceSummary: '3 years working on demand forecasting and experimentation. Built reproducible analysis workflows and communicated model results to business stakeholders.',
    strengths: ['Strong statistical foundations', 'Verified forecasting work', 'Clear project documentation'],
    concerns: ['Limited API delivery experience', 'No container pipeline evidence', 'Limited MLOps experience'],
    summary: 'Ananya Rao brings relevant forecasting and data science experience. Her verified projects demonstrate model development, while FastAPI, Docker, and production ML pipelines need further assessment for this engineering role.',
    nextStep: 'Review Engineering Readiness in Interview',
    projects: [
      {
        name: 'Demand Forecasting Toolkit',
        technologies: ['Python', 'Pandas', 'Prophet', 'SQL'],
        score: 85,
        reason: 'Clear evidence of time-series modeling, backtesting, and reproducible experiments.',
        url: 'https://github.com/topics/demand-forecasting'
      }
    ]
  },
  {
    id: 5,
    rank: 5,
    name: 'Aditya Verma',
    initials: 'AV',
    role: 'Junior ML Developer',
    matchScore: 78,
    skillsMatch: 76,
    experienceMatch: 65,
    projectEvidence: 76,
    experience: 1.5,
    github: 'Partial',
    recommendation: 'Low Fit',
    color: 'rose',
    matchedSkills: ['Python', 'SQL', 'Git', 'Machine Learning'],
    missingSkills: ['AWS', 'MLOps', 'FastAPI', 'Docker', 'Deep Learning'],
    education: 'B.Tech in Computer Science, Amity University, 2024.',
    experienceSummary: '1.5 years of internship and junior developer experience. Contributed to data preparation and supervised learning experiments.',
    strengths: ['Foundational Python skills', 'Interest in applied ML', 'Basic modeling experience'],
    concerns: ['Below the required experience', 'Limited production project evidence', 'Several core engineering gaps'],
    summary: 'Aditya Verma shows foundational Python and machine learning knowledge. His experience is below the two-year requirement, and project evidence is partial. A junior role may be more suitable while he develops deployment and engineering skills.',
    nextStep: 'Consider for a Junior Opportunity',
    projects: [
      {
        name: 'Customer Churn Notebook',
        technologies: ['Python', 'Pandas', 'scikit-learn'],
        score: 76,
        reason: 'Demonstrates exploratory analysis and baseline models, with limited evidence of production delivery.',
        url: 'https://github.com/topics/customer-churn-prediction'
      }
    ]
  }
];

let candidates = [];
let showingLiveResults = false;
let analyses = [];
let currentAnalysis = null;
const resultsStorageKey = 'cognify-results-v1';

// GitHub topic links above are sample destinations, not claimed candidate repositories.
const skillGapDetails = {
  AWS: { title: 'AWS Deployment', importance: 'High', evidence: 'No strong AWS deployment evidence found.' },
  MLOps: { title: 'MLOps', importance: 'Medium', evidence: 'Limited production pipeline evidence.' },
  Docker: { title: 'Docker', importance: 'Medium', evidence: 'No clear containerized application delivery evidence.' },
  'Deep Learning': { title: 'Deep Learning', importance: 'High', evidence: 'Limited evidence of training or deploying deep learning models.' },
  FastAPI: { title: 'FastAPI', importance: 'Medium', evidence: 'No strong FastAPI application evidence found.' }
};

const recommendationClasses = {
  'Strong Fit': 'badge-success',
  'Good Fit': 'badge-info',
  Consider: 'badge-warning',
  'Low Fit': 'badge-danger'
};

// 2. Small application state. Uploaded files live in memory only.
let uploadedResumes = [];
let jobDescriptionFile = null;
let githubRowCount = 0;
let selectedCandidate = null;
let activeRole = '';
let analysisInput = null;
let analysisRunning = false;
let analysisTimer = null;
let progress = 0;
let lastActivityIndex = -1;
let toastTimer = null;
let shortlistedIds = [];

// Real responses are persisted; sample results stay in memory. Active arrays
// refer to the selected entry so history and current results share the same data.
function selectAnalysis(analysis) {
  currentAnalysis = analysis;
  candidates = analysis ? analysis.candidates : [];
  shortlistedIds = analysis ? analysis.shortlistedIds : [];
  activeRole = analysis ? analysis.role : '';
  showingLiveResults = Boolean(analysis && analysis.mode === 'real');
  selectedCandidate = null;
}

function saveResults() {
  if (!showingLiveResults) return;
  try {
    localStorage.setItem(resultsStorageKey, JSON.stringify({
      version: 1,
      currentAnalysisId: currentAnalysis.id,
      analyses: analyses
    }));
  } catch (error) {
    // Storage may be disabled or full. Results remain usable in this session.
  }
}

function restoreResults() {
  try {
    const saved = JSON.parse(localStorage.getItem(resultsStorageKey) || 'null');
    if (!saved || saved.version !== 1 || !Array.isArray(saved.analyses)) return;
    analyses = saved.analyses.filter(function (analysis) {
      return analysis && analysis.mode === 'real' && typeof analysis.id === 'string' &&
        typeof analysis.role === 'string' && Number.isFinite(Date.parse(analysis.createdAt)) &&
        Array.isArray(analysis.shortlistedIds) && Array.isArray(analysis.candidates) &&
        analysis.candidates.every(function (candidate) {
          return candidate && candidate.source === 'analysis' &&
            ['string', 'number'].includes(typeof candidate.id) && typeof candidate.name === 'string' &&
            typeof candidate.github === 'string' &&
            ['matchedSkills', 'missingSkills', 'projects', 'strengths', 'concerns'].every(function (field) {
              return Array.isArray(candidate[field]);
            });
        });
    });
    analyses.forEach(function (analysis) {
      analysis.shortlistedIds = Array.from(new Set(analysis.shortlistedIds)).filter(function (id) {
        return analysis.candidates.some(function (candidate) { return candidate.id === id; });
      });
    });
    selectAnalysis(analyses.find(function (analysis) { return analysis.id === saved.currentAnalysisId; }) || analyses[0] || null);
  } catch (error) {
    // An unreadable saved result must never activate sample data.
    analyses = [];
    selectAnalysis(null);
  }
}

function completeAnalysis(result, input, mode) {
  const analysis = {
    id: result.analysisId || mode + '-' + Date.now(),
    mode: mode,
    role: (result.job && result.job.jobRole) || input.jobRole,
    department: (result.job && result.job.department) || input.department || '',
    candidates: Array.isArray(result.candidates) ? result.candidates : [],
    shortlistedIds: [],
    status: result.status || 'completed',
    createdAt: new Date().toISOString(),
    warnings: result.warnings || [],
    errors: result.errors || []
  };
  if (mode === 'real') {
    analyses = analyses.filter(function (item) { return item.id !== analysis.id; });
    analyses.unshift(analysis);
  }
  selectAnalysis(analysis);
  resetCandidateFilters();
  refreshResults();
  saveResults();
}

function refreshResults() {
  const stats = calculateCandidateStats();
  updateResultLabels(stats);
  renderCandidates();
  updateDashboard(stats);
  updateAnalytics(stats);
  updateShortlistDisplay();
  renderAnalysisFeedback();
}

function renderAnalysisFeedback() {
  const feedback = document.getElementById('analysis-feedback');
  feedback.replaceChildren();
  const messages = currentAnalysis ? (currentAnalysis.warnings || []).concat((currentAnalysis.errors || []).map(function (item) {
    return item.filename + ' (' + item.stage + '): ' + item.message;
  })) : [];
  candidates.forEach(function (candidate) {
    (candidate.warnings || []).forEach(function (warning) { messages.push(candidate.name + ': ' + warning); });
  });
  messages.forEach(function (message) { feedback.appendChild(createElement('p', '', message)); });
  feedback.hidden = messages.length === 0;
}

// 3. Shared UI helpers and section navigation.
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

// Escape values used in small HTML templates, including future backend responses.
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(function () {
    toast.hidden = true;
  }, 4000);
}

function showSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section || !section.classList.contains('page-section')) return;

  document.querySelectorAll('.page-section').forEach(function (page) {
    page.hidden = page.id !== sectionId;
  });

  let navigationId = sectionId;
  if (sectionId === 'candidate-detail') navigationId = 'candidates';
  if (sectionId === 'analysis') navigationId = 'new-analysis';

  document.querySelectorAll('.nav-item').forEach(function (button) {
    const active = button.dataset.section === navigationId;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  const titles = {
    dashboard: 'Dashboard',
    'new-analysis': 'New Analysis',
    analysis: 'AI Analysis',
    candidates: 'Candidates',
    'candidate-detail': 'Candidate Analysis',
    analytics: 'Analytics'
  };
  document.getElementById('breadcrumb-current').textContent = titles[sectionId];
  document.title = titles[sectionId] + ' | Cognify';
  if (sectionId === 'candidates') renderCandidates();
  closeSidebar();
  document.getElementById('main-content').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar').inert = false;
  document.getElementById('sidebar-overlay').hidden = false;
  document.getElementById('menu-toggle').setAttribute('aria-expanded', 'true');
  document.getElementById('menu-toggle').setAttribute('aria-label', 'Close navigation');
  document.body.classList.add('nav-open');
  document.querySelector('.nav-item.active').focus();
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').hidden = true;
  document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');
  document.getElementById('menu-toggle').setAttribute('aria-label', 'Open navigation');
  document.body.classList.remove('nav-open');
  document.getElementById('sidebar').inert = window.innerWidth <= 960;
}

// 4. Resume uploads. Filenames are always inserted with textContent.
// BACKEND INTEGRATION POINT: Resume upload API.
// api.js sends actual uploadedResumes file objects using FormData.
// Entries marked sample: true are display-only placeholders and must not be sent.
function handleResumeUpload(fileList) {
  let added = 0;
  let skipped = 0;
  Array.from(fileList).forEach(function (file) {
    const validType = /\.(pdf|docx|txt)$/i.test(file.name) && file.size <= 10 * 1024 * 1024;
    if (validType) uploadedResumes = uploadedResumes.filter(function (resume) { return !resume.sample; });
    const duplicate = uploadedResumes.some(function (resume) {
      return resume.name === file.name && resume.size === file.size && resume.lastModified === file.lastModified;
    });
    if (!validType || duplicate || uploadedResumes.length >= 100) {
      skipped++;
      return;
    }
    uploadedResumes.push({
      file: file,
      name: file.name,
      size: file.size,
      lastModified: file.lastModified,
      sample: false
    });
    added++;
  });
  renderUploadedResumes();
  // Reset the native input so a removed file can be selected again.
  document.getElementById('resume-files').value = '';
  let message = added + ' resume' + (added === 1 ? '' : 's') + ' added.';
  if (skipped) message += ' ' + skipped + ' skipped (duplicate, unsupported type, size over 10 MB, or 100-file limit).';
  showToast(message);
}

function renderUploadedResumes() {
  const list = document.getElementById('uploaded-files');
  list.replaceChildren();
  uploadedResumes.forEach(function (resume, index) {
    const row = createElement('li', 'uploaded-file');
    const icon = createElement('span', 'icon icon-document');
    icon.setAttribute('aria-hidden', 'true');
    const details = createElement('div', 'file-details');
    details.appendChild(createElement('strong', '', resume.name));
    const size = Math.max(1, Math.round(resume.size / 1024));
    details.appendChild(createElement('small', '', resume.sample ? 'Sample resume' : size + ' KB'));
    const status = createElement('span', 'badge badge-success', 'Uploaded');
    const remove = createElement('button', 'icon-button remove-button', '\u00d7');
    remove.type = 'button';
    remove.title = 'Remove ' + resume.name;
    remove.setAttribute('aria-label', 'Remove ' + resume.name);
    remove.addEventListener('click', function () {
      uploadedResumes.splice(index, 1);
      renderUploadedResumes();
      showToast('Resume removed.');
    });
    row.append(icon, details, status, remove);
    list.appendChild(row);
  });
  document.getElementById('resume-count').textContent = uploadedResumes.length + ' / 100 resumes';
}

// 5. GitHub input rows. These collect links; they never call GitHub.
// BACKEND INTEGRATION POINT: GitHub analysis API.
// api.js sends the githubProfiles array to Python with the uploaded resumes.
function addGitHubRow() {
  githubRowCount++;
  const row = createElement('div', 'github-row');
  row.id = 'github-row-' + githubRowCount;
  const nameLabel = createElement('label', 'field', 'Candidate Name');
  const nameInput = createElement('input', 'github-candidate-name');
  nameInput.placeholder = 'e.g. Aarav Gupta';
  nameInput.maxLength = 100;
  nameLabel.appendChild(nameInput);
  const urlLabel = createElement('label', 'field', 'GitHub URL');
  const urlInput = createElement('input', 'github-profile-url');
  urlInput.type = 'url';
  urlInput.placeholder = 'https://github.com/username';
  urlInput.maxLength = 250;
  urlLabel.appendChild(urlInput);
  const remove = createElement('button', 'icon-button remove-button', '\u00d7');
  remove.type = 'button';
  remove.title = 'Remove GitHub profile';
  remove.setAttribute('aria-label', 'Remove GitHub profile row ' + githubRowCount);
  remove.addEventListener('click', function () {
    removeGitHubRow(row.id);
  });
  row.append(nameLabel, urlLabel, remove);
  document.getElementById('github-rows').appendChild(row);
  return row;
}

function removeGitHubRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) row.remove();
  document.getElementById('add-github-profile').focus();
}

function validateGitHubProfiles() {
  const rows = document.querySelectorAll('.github-row');
  for (const row of rows) {
    const nameInput = row.querySelector('.github-candidate-name');
    const urlInput = row.querySelector('.github-profile-url');
    const name = nameInput.value.trim();
    const value = urlInput.value.trim();
    nameInput.setCustomValidity('');
    urlInput.setCustomValidity('');
    if (!name && !value) continue;
    if (!name) {
      nameInput.setCustomValidity('Add a candidate name for this GitHub profile.');
      nameInput.reportValidity();
      return false;
    }
    let validURL = false;
    try {
      const url = new URL(value);
      validURL = ['http:', 'https:'].includes(url.protocol) &&
        ['github.com', 'www.github.com'].includes(url.hostname) &&
        /^\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9_.-]+)?\/?$/.test(url.pathname) &&
        !url.username && !url.password && !url.port && !url.search && !url.hash;
    } catch (error) {
      validURL = false;
    }
    if (!validURL) {
      urlInput.setCustomValidity('Enter a GitHub profile or repository URL, such as https://github.com/username/project.');
      urlInput.reportValidity();
      return false;
    }
  }
  return true;
}

// BACKEND INTEGRATION POINT: Job Description API.
// Job fields and the optional file are collected here; api.js uploads them on submit.
function collectAnalysisInput() {
  const profiles = [];
  document.querySelectorAll('.github-row').forEach(function (row) {
    const name = row.querySelector('.github-candidate-name').value.trim();
    const url = row.querySelector('.github-profile-url').value.trim();
    if (name && url) profiles.push({ candidateName: name, githubURL: url });
  });
  return {
    jobRole: document.getElementById('job-role').value.trim(),
    department: document.getElementById('department').value,
    minimumExperience: document.getElementById('minimum-experience').value,
    location: document.getElementById('job-location').value.trim(),
    employmentType: document.getElementById('employment-type').value,
    jobDescription: document.getElementById('job-description').value.trim(),
    jobDescriptionFile: jobDescriptionFile,
    resumes: uploadedResumes.slice(),
    githubProfiles: profiles
  };
}

function useSampleData() {
  document.getElementById('job-role').value = 'AI Engineer';
  document.getElementById('department').value = 'Engineering';
  document.getElementById('minimum-experience').value = '2';
  document.getElementById('job-location').value = 'Bengaluru / Hybrid';
  document.getElementById('employment-type').value = 'Full-time';
  document.getElementById('job-description').value =
    'We are looking for an AI Engineer with 2+ years of relevant experience.\n\n' +
    'Responsibilities:\nBuild machine learning applications, retrieval pipelines, and production APIs. Collaborate with product teams to evaluate and improve model quality.\n\n' +
    'Required skills:\nPython, machine learning, FastAPI, SQL, REST APIs, and Git.\n\n' +
    'Preferred skills:\nAWS deployment, MLOps, Docker, and LLM application development.\n\n' +
    'Education:\nA degree in computer science or equivalent practical experience.';
  if (uploadedResumes.length === 0) {
    sampleCandidates.forEach(function (candidate) {
      uploadedResumes.push({
        file: null,
        name: candidate.name.replace(/ /g, '_') + '_Resume.pdf',
        size: 0,
        lastModified: 0,
        sample: true
      });
    });
    renderUploadedResumes();
  }
  showToast('Sample role and resumes are ready.');
}

// 6. The sample timeline is retained. Real uploads await the Python response.
const agentStages = [
  { id: 'agent-job', start: 0, end: 16 },
  { id: 'agent-resume', start: 0, end: 40 },
  { id: 'agent-github', start: 0, end: 44 },
  { id: 'agent-matching', start: 44, end: 68 },
  { id: 'agent-gaps', start: 68, end: 84 },
  { id: 'agent-summary', start: 84, end: 100 }
];

const activityMessages = [
  { at: 0, text: 'Preparing demo candidate analysis' },
  { at: 12, text: 'Extracted 14 required skills' },
  { at: 24, text: 'Parsed candidate resume' },
  { at: 40, text: 'Verified GitHub repositories' },
  { at: 48, text: 'Identified relevant projects' },
  { at: 60, text: 'Calculating compatibility' },
  { at: 76, text: 'Identifying skill gaps' },
  { at: 88, text: 'Generating recruiter summary' },
  { at: 100, text: 'Analysis complete. Candidate rankings are ready.' }
];

function startAnalysis() {
  if (analysisRunning) {
    showSection('analysis');
    showToast('Your current analysis is still running.');
    return;
  }
  analysisInput = collectAnalysisInput();
  if (analysisInput.resumes.some(function (resume) { return resume.file && !resume.sample; })) {
    startLiveAnalysis(analysisInput);
    return;
  }
  if (!analysisInput.resumes.length) {
    showToast('Upload at least one resume, or choose Use Sample Data to preview the demo.');
    showSection('new-analysis');
    return;
  }
  document.querySelector('#analysis .page-heading > .badge').textContent = 'Simulated analysis';
  document.querySelector('#analysis .demo-note').textContent = 'Demo run: results use sample candidate data.';
  analysisRunning = true;
  progress = 0;
  lastActivityIndex = -1;
  clearInterval(analysisTimer);
  document.getElementById('activity-log').replaceChildren();
  document.getElementById('analysis-subtitle').textContent = analysisInput.jobRole + ' / Demo analysis with sample candidate results';
  document.getElementById('running-indicator').hidden = false;
  document.getElementById('run-analysis-button').disabled = true;
  showSection('analysis');
  updateProgress();
  analysisTimer = setInterval(function () {
    progress = Math.min(100, progress + 4);
    updateProgress();
  }, 440);
}

function updateProgress() {
  document.getElementById('progress-value').textContent = progress + '%';
  document.getElementById('progress-fill').style.width = progress + '%';
  document.getElementById('analysis-progress').setAttribute('aria-valuenow', progress);

  agentStages.forEach(function (stage) {
    const card = document.getElementById(stage.id);
    let status = 'Waiting';
    if (progress >= stage.end) status = 'Completed';
    else if (progress >= stage.start) status = 'Processing';
    card.classList.toggle('is-processing', status === 'Processing');
    card.classList.toggle('is-completed', status === 'Completed');
    const badge = card.querySelector('.agent-status');
    badge.textContent = status;
    badge.className = 'agent-status badge ' + (status === 'Completed' ? 'badge-success' : 'badge-neutral');
  });

  activityMessages.forEach(function (message, index) {
    if (progress >= message.at && index > lastActivityIndex) {
      const row = createElement('li', '', message.text);
      const now = new Date();
      const time = createElement('time', '', now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      time.dateTime = now.toISOString();
      row.appendChild(time);
      const log = document.getElementById('activity-log');
      log.appendChild(row);
      if (log.children.length > 5) log.firstElementChild.remove();
      document.getElementById('progress-message').textContent = message.text;
      lastActivityIndex = index;
    }
  });

  if (progress === 100) {
    clearInterval(analysisTimer);
    analysisTimer = null;
    setTimeout(function () {
      analysisRunning = false;
      document.getElementById('running-indicator').hidden = true;
      document.getElementById('run-analysis-button').disabled = false;
      completeAnalysis({ candidates: sampleCandidates.slice() }, analysisInput, 'sample');
      showSection('candidates');
      showToast('Demo analysis complete. Showing ' + candidates.length + ' sample candidate results.');
    }, 800);
  }
}

// Real requests use an indeterminate indicator. The API returns a completed
// batch, so the browser does not invent intermediate agent completion events.
async function startLiveAnalysis(input) {
  if (!input.jobRole || (!input.jobDescription && !input.jobDescriptionFile)) {
    showToast('Enter a job role and paste or upload a job description.');
    return;
  }
  analysisRunning = true;
  clearInterval(analysisTimer);
  document.getElementById('running-indicator').hidden = false;
  document.getElementById('run-analysis-button').disabled = true;
  document.getElementById('analysis-subtitle').textContent = input.jobRole + ' / ' + input.resumes.length + ' uploaded resumes';
  document.querySelector('#analysis .page-heading > .badge').textContent = 'AI analysis';
  document.querySelector('#analysis .demo-note').textContent = 'Analyzing uploaded resumes. Large batches can take several minutes.';
  document.getElementById('activity-log').replaceChildren();
  document.getElementById('activity-log').appendChild(createElement('li', '', 'Request submitted. Waiting for the candidate analyses.'));
  document.getElementById('progress-value').textContent = 'Running?';
  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('analysis-progress').removeAttribute('aria-valuenow');
  document.getElementById('progress-message').textContent = 'Analyzing candidates. Results will appear when the batch finishes.';
  agentStages.forEach(function (stage) {
    const card = document.getElementById(stage.id);
    card.classList.remove('is-completed', 'is-processing');
    card.querySelector('.agent-status').textContent = 'Pending result';
    card.querySelector('.agent-status').className = 'agent-status badge badge-neutral';
  });
  showSection('analysis');
  try {
    const result = await window.CognifyAPI.analyze(input);
    completeAnalysis(result, input, 'real');
    document.getElementById('progress-value').textContent = '100%';
    document.getElementById('progress-fill').style.width = '100%';
    document.getElementById('analysis-progress').setAttribute('aria-valuenow', '100');
    document.getElementById('progress-message').textContent = result.processedCandidates + ' of ' + result.totalCandidates + ' candidates completed.';
    agentStages.forEach(function (stage) {
      const card = document.getElementById(stage.id);
      card.classList.add('is-completed');
      card.querySelector('.agent-status').textContent = stage.id === 'agent-github' ? 'Optional evidence' : 'Batch finished';
      card.querySelector('.agent-status').className = 'agent-status badge badge-success';
    });
    showSection('candidates');
    showToast(candidates.length + ' candidates analyzed.' + ((result.errors || []).length ? ' See the candidate errors above the rankings.' : ''));
  } catch (error) {
    // Keep existing results intact, and leave a persistent, readable error.
    document.getElementById('progress-value').textContent = 'Failed';
    document.getElementById('progress-message').textContent = error.message;
    document.getElementById('activity-log').appendChild(createElement('li', '', error.message));
    document.querySelector('#analysis .page-heading > .badge').textContent = 'Analysis failed';
    showToast(error.message);
  } finally {
    analysisRunning = false;
    document.getElementById('running-indicator').hidden = true;
    document.getElementById('run-analysis-button').disabled = false;
  }
}

function updateResultLabels(stats = calculateCandidateStats()) {
  const sampleMode = currentAnalysis && currentAnalysis.mode === 'sample';
  const modeLabel = sampleMode ? 'Sample' : showingLiveResults ? 'Live' : 'Empty';
  document.querySelectorAll('[data-mode-label]').forEach(function (element) { element.textContent = modeLabel; });
  document.getElementById('workspace-data-label').textContent = sampleMode ? 'Demo workspace' : 'Recruitment workspace';
  document.getElementById('candidate-role-label').textContent = activeRole || 'No analysis yet';
  document.getElementById('candidate-data-label').textContent = sampleMode ? 'demo candidates' : 'analyzed candidates';
  document.querySelector('.results-summary .small-tag').textContent = sampleMode ? 'Demo results' : showingLiveResults ? 'Analysis results' : 'No analysis yet';
  const counts = document.querySelectorAll('.results-summary .result-summary-item strong');
  counts[0].textContent = stats.totalCandidates;
  counts[1].textContent = stats.githubEvidence;
  document.getElementById('github-count-label').textContent = 'With GitHub evidence';
  document.querySelector('.results-summary .score-text').textContent = stats.topMatch + '%';
  document.getElementById('score-source-label').textContent = sampleMode ? 'Scores are illustrative' : showingLiveResults ? 'Scores from the Matching Agent' : 'No analysis data yet';
  document.querySelector('.nav-count').textContent = stats.totalCandidates;
}

function displayPercent(value) {
  return value === null || value === undefined ? 'Not reported' : value + '%';
}

function displayExperience(value) {
  return value === null || value === undefined ? 'Not reported' : value + ' Years';
}

// 7. Candidate search and filters operate on the array, without modifying it.
function renderCandidates() {
  const search = document.getElementById('candidate-search').value.trim().toLowerCase();
  const matchFilter = document.getElementById('match-filter').value;
  const experienceFilter = document.getElementById('experience-filter').value;
  const githubFilter = document.getElementById('github-filter').value;
  const sortOrder = document.getElementById('sort-order').value;

  const results = candidates.filter(function (candidate) {
    const score = numericScore(candidate.matchScore);
    const searchableText = [candidate.name, candidate.role].concat(candidate.matchedSkills).join(' ').toLowerCase();
    if (!searchableText.includes(search)) return false;
    if (matchFilter !== 'all' && score === null) return false;
    if (matchFilter === 'below80' && score >= 80) return false;
    if (matchFilter !== 'all' && matchFilter !== 'below80' && score < Number(matchFilter)) return false;
    if (experienceFilter !== 'all' && candidate.experience === null) return false;
    if (experienceFilter === 'below2' && candidate.experience >= 2) return false;
    if (experienceFilter === '2to3' && (candidate.experience < 2 || candidate.experience > 3)) return false;
    if (experienceFilter === 'above3' && candidate.experience <= 3) return false;
    if (githubFilter !== 'all' && candidate.github !== githubFilter) return false;
    return true;
  });

  results.sort(function (first, second) {
    const firstScore = numericScore(first.matchScore);
    const secondScore = numericScore(second.matchScore);
    if (firstScore === null) return secondScore === null ? 0 : 1;
    if (secondScore === null) return -1;
    return sortOrder === 'asc' ? firstScore - secondScore : secondScore - firstScore;
  });

  const tableBody = document.getElementById('candidate-table-body');
  tableBody.replaceChildren();
  results.forEach(function (candidate) {
    const row = document.createElement('tr');
    const shortlisted = shortlistedIds.includes(candidate.id);
    row.innerHTML =
      '<td><span class="rank-number ' + (candidate.rank === 1 ? 'rank-first' : '') + '">' + candidate.rank + '</span></td>' +
      '<td><div class="candidate-cell"><span class="avatar ' + candidate.color + '">' + escapeHTML(candidate.initials) + '</span><div>' +
      '<strong>' + escapeHTML(candidate.name) + '</strong>' +
      (shortlisted ? '<span class="shortlisted-marker" title="Shortlisted" aria-label="Shortlisted">&#10003;</span>' : '') +
      '<small>' + escapeHTML(candidate.role) + '</small></div></div></td>' +
      '<td><span class="table-score">' + displayPercent(numericScore(candidate.matchScore)) + '</span><div class="mini-score-track" aria-hidden="true"><span style="width:' + (numericScore(candidate.matchScore) ?? 0) + '%"></span></div></td>' +
      '<td>' + displayPercent(candidate.skillsMatch) + '</td>' +
      '<td>' + displayExperience(candidate.experience) + '</td>' +
      '<td><span class="badge ' + (candidate.github === 'Verified' ? 'badge-success' : 'badge-warning') + '">' + escapeHTML(candidate.github) + '</span></td>' +
      '<td><span class="gap-count">' + candidate.missingSkills.length + ' Gaps</span></td>' +
      '<td><span class="badge ' + (recommendationClasses[candidate.recommendation] || 'badge-neutral') + '">' + escapeHTML(candidate.recommendation) + '</span></td>' +
      '<td><button class="table-action" data-candidate-id="' + candidate.id + '" aria-label="View analysis for ' + escapeHTML(candidate.name) + '">View Analysis <span aria-hidden="true">&#8599;</span></button></td>';
    tableBody.appendChild(row);
  });

  document.getElementById('candidate-empty-state').hidden = results.length !== 0;
  document.querySelector('#candidate-empty-state h3').textContent = candidates.length ? 'No candidates found' : 'No analysis data yet';
  document.querySelector('#candidate-empty-state p').textContent = candidates.length ? 'Try a different search or reset the filters.' : 'Run a candidate analysis to see your results.';
  document.getElementById('empty-reset-filters').hidden = candidates.length === 0;
  document.getElementById('visible-candidate-count').textContent = results.length;
  document.getElementById('candidate-total').textContent = candidates.length;
  document.getElementById('candidate-result-count').textContent = 'Showing ' + results.length + ' of ' + candidates.length + ' candidates';
}

function resetCandidateFilters() {
  document.getElementById('candidate-search').value = '';
  document.getElementById('match-filter').value = 'all';
  document.getElementById('experience-filter').value = 'all';
  document.getElementById('github-filter').value = 'all';
  document.getElementById('sort-order').value = 'desc';
  renderCandidates();
}

// 8. Candidate detail. All tabs read from the same selected candidate.
function showCandidateDetail(candidateId) {
  const candidate = candidates.find(function (item) {
    return String(item.id) === String(candidateId);
  });
  if (!candidate) return;
  selectedCandidate = candidate;

  document.getElementById('detail-name').textContent = candidate.name;
  const avatar = document.getElementById('detail-avatar');
  avatar.textContent = candidate.initials;
  avatar.className = 'avatar avatar-large ' + candidate.color;
  document.getElementById('detail-role').textContent = candidate.role;
  document.getElementById('detail-experience').textContent = displayExperience(candidate.experience) + ' experience';
  document.getElementById('detail-github').textContent = 'GitHub ' + candidate.github.toLowerCase();
  document.getElementById('detail-match').textContent = displayPercent(numericScore(candidate.matchScore)) + ' Match';
  const recommendation = document.getElementById('detail-recommendation');
  recommendation.textContent = candidate.recommendation;
  recommendation.className = 'badge ' + (recommendationClasses[candidate.recommendation] || 'badge-neutral');

  document.querySelector('#panel-github .section-heading p').textContent = candidate.source === 'analysis' ? 'Public repository evidence available for this candidate.' : 'Illustrative project evidence from the demo dataset.';
  document.querySelector('#panel-github .small-tag').textContent = candidate.source === 'analysis' ? 'Public repositories' : 'Sample repositories';
  document.querySelector('.summary-label .small-tag').textContent = candidate.source === 'analysis' ? 'AI analysis' : 'Demo';
  renderOverview(candidate);
  renderResumeAnalysis(candidate);
  renderGitHubEvidence(candidate);
  renderSkillGaps(candidate);
  document.getElementById('ai-summary-text').textContent = candidate.summary;
  renderTextList('summary-strengths', candidate.strengths);
  renderTextList('summary-concerns', candidate.concerns);
  document.getElementById('summary-next-step').textContent = candidate.nextStep;
  document.querySelector('.recommendation-banner').style.color = candidate.matchScore >= 89 ? '#047857' : '#A16207';
  updateShortlistDisplay();
  switchCandidateTab('overview');
  showSection('candidate-detail');
}

function renderOverview(candidate) {
  const scores = [
    { label: 'Overall Match', value: candidate.matchScore, color: '#4F46E5' },
    { label: 'Skills Match', value: candidate.skillsMatch, color: '#06B6D4' },
    { label: 'Experience Match', value: candidate.experienceMatch, color: '#10B981' },
    { label: 'Project Evidence', value: candidate.projectEvidence, color: '#F59E0B' }
  ];
  const container = document.getElementById('detail-scores');
  container.replaceChildren();
  scores.forEach(function (score) {
    const card = createElement('article', 'detail-score-card');
    const text = createElement('div');
    text.appendChild(createElement('p', '', score.label));
    text.appendChild(createElement('strong', '', displayPercent(score.value)));
    const ring = createElement('span', 'score-ring');
    ring.style.setProperty('--ring-color', score.color);
    ring.setAttribute('aria-hidden', 'true');
    ring.appendChild(createElement('span', 'icon icon-check'));
    card.append(text, ring);
    container.appendChild(card);
  });
  renderSkillChips('matched-skills', candidate.matchedSkills, false);
  renderSkillChips('missing-skills', candidate.missingSkills, true);
  document.getElementById('overview-experience').textContent = displayExperience(candidate.experience);
  const experienceStatus = document.getElementById('experience-status');
  const required = candidate.source === 'analysis' ? candidate.minimumExperience : 2;
  document.getElementById('required-experience').textContent = required === null ? 'Not mentioned' : required + '+ Years';
  const known = candidate.experience !== null && required !== null;
  const meetsRequirement = known && candidate.experience >= required;
  experienceStatus.textContent = !known ? 'Needs review' : meetsRequirement ? 'Meets Requirement' : 'Below Requirement';
  experienceStatus.className = 'badge ' + (meetsRequirement ? 'badge-success' : 'badge-warning');
}

function renderSkillChips(containerId, skills, missing) {
  const container = document.getElementById(containerId);
  container.replaceChildren();
  skills.forEach(function (skill) {
    container.appendChild(createElement('span', 'skill-chip' + (missing ? ' missing' : ''), skill));
  });
}

function renderTextList(containerId, items) {
  const list = document.getElementById(containerId);
  list.replaceChildren();
  items.forEach(function (item) {
    list.appendChild(createElement('li', '', item));
  });
}

function renderResumeAnalysis(candidate) {
  const sections = [
    { title: 'Education', text: candidate.education },
    { title: 'Experience', text: candidate.experienceSummary },
    { title: 'Skills', items: candidate.resumeSkills || candidate.matchedSkills },
    { title: 'Projects', items: candidate.resumeProjects || candidate.projects.map(function (project) { return project.name; }) },
    { title: 'Resume Strengths', items: candidate.strengths },
    { title: 'Resume Concerns', items: candidate.concerns }
  ];
  const container = document.getElementById('resume-analysis-content');
  container.replaceChildren();
  sections.forEach(function (section) {
    const article = createElement('article', 'resume-section');
    const title = createElement('h3');
    const icon = createElement('span', 'icon icon-document');
    icon.setAttribute('aria-hidden', 'true');
    title.append(icon, document.createTextNode(section.title));
    article.appendChild(title);
    if (section.text) article.appendChild(createElement('p', '', section.text));
    if (section.items) {
      const list = createElement('ul');
      section.items.forEach(function (item) {
        list.appendChild(createElement('li', '', item));
      });
      article.appendChild(list);
    }
    container.appendChild(article);
  });
}

function renderGitHubEvidence(candidate) {
  const container = document.getElementById('github-projects');
  container.replaceChildren();
  if (!candidate.projects.length) container.appendChild(createElement('p', '', 'No GitHub repository evidence is available. Resume analysis is still included.'));
  candidate.projects.forEach(function (project) {
    const card = createElement('article', 'project-card');
    card.innerHTML =
      '<div class="project-top"><span class="agent-icon cyan"><span class="icon icon-code" aria-hidden="true">&lt;/&gt;</span></span>' +
      '<h3>' + escapeHTML(project.name) + '</h3></div>' +
      '<div class="skill-chips"></div>' +
      '<div class="evidence-score"><span>Evidence Score</span><strong>' + displayPercent(project.score) + '</strong></div>' +
      '<div class="horizontal-track" aria-hidden="true"><span class="bar-mint" style="width:' + (project.score || 0) + '%"></span></div>';
    const technologies = card.querySelector('.skill-chips');
    project.technologies.forEach(function (technology) {
      technologies.appendChild(createElement('span', 'skill-chip', technology));
    });
    card.appendChild(createElement('p', '', project.reason));
    const link = createElement('a', 'button button-secondary button-small', 'View GitHub \u2197');
    // Only HTTPS GitHub destinations are allowed when real API data replaces this.
    try {
      const url = new URL(project.url);
      if (url.protocol === 'https:' && url.hostname === 'github.com' && !url.username && !url.password) link.href = url.href;
    } catch (error) { /* Missing links do not prevent the rest of the evidence from rendering. */ }
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = 'Open GitHub evidence for ' + project.name;
    card.appendChild(link);
    container.appendChild(card);
  });
}

function renderSkillGaps(candidate) {
  const container = document.getElementById('skill-gap-content');
  container.replaceChildren();
  const gaps = candidate.source === 'analysis' ? candidate.skillGaps : candidate.missingSkills.map(function (skill) {
    return skillGapDetails[skill] || { title: skill, importance: 'Unspecified', evidence: skill };
  });
  if (!gaps.length) container.appendChild(createElement('p', '', 'No structured gaps were reported. Review the recruiter summary for context.'));
  // Aarav has two scored gaps; Docker optimization is an additional development opportunity.
  if (candidate.source !== 'analysis' && candidate.id === 1) {
    gaps.push({
      title: 'Docker Optimization',
      importance: 'Low',
      evidence: 'Further optimization of image size and build caching would strengthen deployment readiness.',
      opportunity: true
    });
  }
  gaps.forEach(function (gap, index) {
    const article = createElement('article', 'gap-item');
    const badgeClass = gap.importance === 'High' ? 'badge-danger' : gap.importance === 'Medium' ? 'badge-warning' : 'badge-info';
    article.innerHTML =
      '<span class="gap-index">' + String(index + 1).padStart(2, '0') + '</span>' +
      '<div><div class="gap-title"><h3>' + escapeHTML(gap.title) + '</h3>' +
      '<span class="badge ' + badgeClass + '">Importance: ' + escapeHTML(gap.importance) + '</span></div>' +
      '<p>Evidence: ' + escapeHTML(gap.evidence) + '</p>' +
      (gap.opportunity ? '<span class="gap-kind">Development opportunity; not included in the two scored gaps.</span>' : '') + '</div>';
    container.appendChild(article);
  });
}

function switchCandidateTab(tabName) {
  if (!document.getElementById('panel-' + tabName)) return;
  document.querySelectorAll('.candidate-tab').forEach(function (tab) {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll('.tab-panel').forEach(function (panel) {
    panel.hidden = panel.id !== 'panel-' + tabName;
  });
}

function updateShortlistDisplay() {
  const shortlisted = Boolean(selectedCandidate && shortlistedIds.includes(selectedCandidate.id));
  const button = document.getElementById('shortlist-button');
  button.disabled = !selectedCandidate;
  document.getElementById('download-report').disabled = !selectedCandidate;
  button.classList.toggle('is-shortlisted', shortlisted);
  button.setAttribute('aria-pressed', String(shortlisted));
  button.querySelector('.icon').className = 'icon ' + (shortlisted ? 'icon-check' : 'icon-plus');
  document.getElementById('shortlist-label').textContent = shortlisted ? 'Shortlisted' : 'Shortlist';
}

function toggleShortlist() {
  if (!selectedCandidate || !candidates.includes(selectedCandidate)) return;
  const index = shortlistedIds.indexOf(selectedCandidate.id);
  if (index === -1) shortlistedIds.push(selectedCandidate.id);
  else shortlistedIds.splice(index, 1);
  refreshResults();
  saveResults();
  showToast(selectedCandidate.name + (index === -1 ? ' added to shortlist.' : ' removed from shortlist.'));
}

// BACKEND INTEGRATION POINT: Candidate report API.
// Replace this local text download with a PDF response from the Python backend.
// The demo report contains no uploaded file contents and is not an AI-generated report.
function downloadCandidateReport() {
  const candidate = selectedCandidate;
  if (!candidate) return;
  const lines = [
    candidate.source === 'analysis' ? 'COGNIFY - CANDIDATE REPORT' : 'COGNIFY - DEMO CANDIDATE REPORT',
    candidate.source === 'analysis' ? 'Generated from uploaded documents by the existing Cognify agents.' : 'Illustrative sample data. No real AI analysis was performed.',
    '',
    'Candidate: ' + candidate.name,
    'Candidate role: ' + candidate.role,
    candidate.source === 'analysis' ? 'Role benchmark: ' + candidate.role : 'Sample benchmark: AI Engineer, 2+ years experience',
    'Overall match: ' + displayPercent(numericScore(candidate.matchScore)),
    'Skills match: ' + displayPercent(candidate.skillsMatch),
    'Experience: ' + displayExperience(candidate.experience),
    'GitHub evidence: ' + candidate.github + (candidate.source === 'analysis' ? '' : ' (demo)'),
    'Recommendation: ' + candidate.recommendation,
    '',
    'Matched skills: ' + candidate.matchedSkills.join(', '),
    'Skill gaps: ' + candidate.missingSkills.join(', '),
    '',
    'RECRUITER SUMMARY',
    candidate.summary,
    '',
    'STRENGTHS',
    candidate.strengths.join('\n'),
    '',
    'CONCERNS',
    candidate.concerns.join('\n'),
    '',
    'NEXT STEP: ' + candidate.nextStep
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Cognify_' + candidate.name.replace(/ /g, '_') + (candidate.source === 'analysis' ? '_Report.txt' : '_Demo_Report.txt');
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  showToast('Candidate report downloaded as a text file.');
}

// 9. Shared calculations power the existing Dashboard and Analytics charts.
function numericScore(value) {
  if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return null;
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
}

function calculateMatchDistribution(pool = candidates) {
  const distribution = { '90-100': 0, '80-89': 0, '70-79': 0, below70: 0 };
  pool.forEach(function (candidate) {
    const score = numericScore(candidate.matchScore);
    if (score === null) return;
    if (score >= 90) distribution['90-100']++;
    else if (score >= 80) distribution['80-89']++;
    else if (score >= 70) distribution['70-79']++;
    else distribution.below70++;
  });
  return distribution;
}

function getSkillFrequency(fieldName, pool = candidates) {
  const frequencies = new Map();
  pool.forEach(function (candidate) {
    const seen = new Set();
    (Array.isArray(candidate[fieldName]) ? candidate[fieldName] : []).forEach(function (skill) {
      if (typeof skill !== 'string' || !skill.trim()) return;
      const label = skill.trim();
      const key = label.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      const entry = frequencies.get(key) || { label: label, value: 0 };
      entry.value++;
      frequencies.set(key, entry);
    });
  });
  return Array.from(frequencies.values()).sort(function (first, second) {
    return second.value - first.value || first.label.localeCompare(second.label);
  });
}

function calculateCandidateStats(pool = candidates, ids = shortlistedIds) {
  const scores = pool.map(function (candidate) { return numericScore(candidate.matchScore); }).filter(function (score) { return score !== null; });
  const currentIds = new Set(pool.map(function (candidate) { return candidate.id; }));
  return {
    totalCandidates: pool.length,
    scoredCandidates: scores.length,
    averageMatchScore: scores.length ? Math.round(scores.reduce(function (sum, score) { return sum + score; }, 0) / scores.length) : 0,
    topMatch: scores.length ? Math.max(...scores) : 0,
    shortlisted: Array.from(new Set(ids)).filter(function (id) { return currentIds.has(id); }).length,
    githubVerified: pool.filter(function (candidate) { return candidate.github === 'Verified'; }).length,
    githubEvidence: pool.filter(function (candidate) { return ['Available', 'Verified', 'Partial'].includes(candidate.github); }).length,
    distribution: calculateMatchDistribution(pool),
    skills: getSkillFrequency('matchedSkills', pool).slice(0, 5),
    gaps: getSkillFrequency('missingSkills', pool).slice(0, 5)
  };
}

function visibleAnalyses() {
  return currentAnalysis && currentAnalysis.mode === 'sample' ? [currentAnalysis] : analyses;
}

function candidatesPerRole() {
  const roles = new Map();
  visibleAnalyses().forEach(function (analysis) {
    roles.set(analysis.role, (roles.get(analysis.role) || 0) + analysis.candidates.length);
  });
  return Array.from(roles, function (entry) { return { label: entry[0], value: entry[1] }; });
}

const chartColors = ['bar-indigo', 'bar-cyan', 'bar-mint', 'bar-amber', 'bar-rose'];

function distributionRows(distribution) {
  return [
    { label: '90-100%', value: distribution['90-100'] },
    { label: '80-89%', value: distribution['80-89'] },
    { label: '70-79%', value: distribution['70-79'] },
    { label: 'Below 70%', value: distribution.below70 }
  ];
}

function percentOf(value, total) {
  return total ? Math.round(value / total * 100) : 0;
}

function updateDashboard(stats = calculateCandidateStats()) {
  document.getElementById('dashboard-total-candidates').textContent = stats.totalCandidates;
  document.getElementById('dashboard-active-roles').textContent = candidatesPerRole().length;
  document.getElementById('dashboard-shortlisted').textContent = stats.shortlisted;
  document.getElementById('dashboard-average-match').textContent = stats.averageMatchScore;
  // Keep the existing four KPI cards; verified count uses the first card's footer.
  document.getElementById('dashboard-github-verified').textContent = stats.githubVerified;
  document.getElementById('dashboard-analysis-count').textContent = visibleAnalyses().length;
  document.getElementById('dashboard-shortlisted-percent').textContent = percentOf(stats.shortlisted, stats.totalCandidates) + '%';
  document.getElementById('dashboard-scored-count').textContent = stats.scoredCandidates;
  document.getElementById('dashboard-distribution-total').textContent = stats.totalCandidates + ' candidates';

  const rows = distributionRows(stats.distribution);
  const maximum = Math.max(4, Math.ceil(Math.max(...rows.map(function (row) { return row.value; })) / 4) * 4);
  document.querySelectorAll('#dashboard .chart-bar').forEach(function (bar, index) {
    bar.style.setProperty('--bar-height', rows[index].value / maximum * 100 + '%');
    bar.style.minHeight = rows[index].value ? '2px' : '0';
    bar.querySelector('span').textContent = rows[index].value;
  });
  document.querySelectorAll('#dashboard .chart-y-axis span').forEach(function (label, index) {
    label.textContent = maximum * (4 - index) / 4;
  });
  document.querySelector('#dashboard .distribution-chart').setAttribute('aria-label',
    'Candidate match distribution: ' + rows.map(function (row) { return row.label + ', ' + row.value + ' candidates'; }).join('; '));

  const highMatches = stats.distribution['90-100'] + stats.distribution['80-89'];
  const insight = document.getElementById('dashboard-distribution-insight');
  if (!stats.totalCandidates) insight.textContent = 'No analysis data yet';
  else if (!stats.scoredCandidates) insight.textContent = 'No match scores reported';
  else {
    insight.replaceChildren(createElement('strong', '', percentOf(highMatches, stats.scoredCandidates) + '% of scored candidates'));
    insight.append(' scored at least 80% match');
  }
  document.getElementById('dashboard-distribution-note').textContent =
    stats.totalCandidates > stats.scoredCandidates ? (stats.totalCandidates - stats.scoredCandidates) + ' unscored' : stats.totalCandidates ? 'Current analysis' : 'Awaiting analysis';

  const skills = document.getElementById('dashboard-skills');
  skills.replaceChildren();
  if (!stats.skills.length) skills.appendChild(createElement('p', 'muted', stats.totalCandidates ? 'No matched skills reported' : 'No analysis data yet'));
  stats.skills.forEach(function (skill, index) {
    const row = createElement('div', 'skill-bar-row');
    const label = createElement('div');
    const name = createElement('span');
    name.append(createElement('span', 'skill-dot ' + ['indigo-dot', 'cyan-dot', 'mint-dot', 'amber-dot', 'rose-dot'][index]), skill.label);
    label.append(name, createElement('strong', '', skill.value));
    const track = createElement('div', 'horizontal-track');
    const bar = createElement('span', chartColors[index]);
    bar.style.width = percentOf(skill.value, stats.totalCandidates) + '%';
    track.appendChild(bar);
    row.append(label, track);
    skills.appendChild(row);
  });

  renderRecentAnalyses();
  const history = visibleAnalyses().slice().reverse();
  const historyStats = history.map(function (analysis) { return calculateCandidateStats(analysis.candidates, analysis.shortlistedIds); });
  const series = [
    historyStats.map(function (item) { return item.totalCandidates; }),
    history.map(function (_, index) { return new Set(history.slice(0, index + 1).map(function (item) { return item.role; })).size; }),
    historyStats.map(function (item) { return item.shortlisted; }),
    historyStats.map(function (item) { return item.averageMatchScore; })
  ];
  document.querySelectorAll('#dashboard .kpi-sparkline').forEach(function (sparkline, index) {
    const values = series[index].slice(-9);
    const maximum = Math.max(1, ...values);
    const bars = sparkline.querySelectorAll('i');
    bars.forEach(function (bar, barIndex) {
      const value = values[barIndex - (bars.length - values.length)] || 0;
      bar.style.height = value / maximum * 100 + '%';
    });
  });
}

function renderRecentAnalyses() {
  const history = visibleAnalyses();
  const table = document.getElementById('recent-analyses-body');
  table.replaceChildren();
  if (!history.length) {
    const row = createElement('tr');
    const cell = createElement('td', 'muted', 'No analysis data yet');
    cell.colSpan = 6;
    row.appendChild(cell);
    table.appendChild(row);
  }
  history.forEach(function (analysis) {
    const stats = calculateCandidateStats(analysis.candidates, analysis.shortlistedIds);
    const row = createElement('tr');
    const partial = analysis.status === 'partial';
    const status = analysis.mode === 'sample' ? 'Sample' : partial ? 'Completed with errors' : 'Completed';
    row.innerHTML =
      '<td><div class="role-cell"><span class="role-icon purple"><span class="icon icon-briefcase" aria-hidden="true"></span></span><div><strong>' + escapeHTML(analysis.role) +
      '</strong><small>' + escapeHTML([analysis.department, new Date(analysis.createdAt).toLocaleString()].filter(Boolean).join(' \u00b7 ')) + '</small></div></div></td>' +
      '<td>' + stats.totalCandidates + '</td><td><span class="score-text">' + stats.topMatch + '%</span></td><td>' + stats.averageMatchScore + '%</td>' +
      '<td><span class="badge ' + (partial ? 'badge-warning' : 'badge-success') + '"><span class="badge-dot"></span>' + status + '</span></td>' +
      '<td><button class="table-action" data-analysis-id="' + escapeHTML(analysis.id) + '">View Results <span aria-hidden="true">&#8599;</span></button></td>';
    table.appendChild(row);
  });
  document.getElementById('recent-analyses-count').textContent = 'Showing ' + history.length + (history.length === 1 ? ' recent analysis' : ' recent analyses');
}

function renderAnalyticsChart(containerId, data, maximum, emptyMessage) {
  const container = document.getElementById(containerId);
  container.replaceChildren();
  if (!data.length) {
    container.appendChild(createElement('p', 'muted', emptyMessage || 'No analysis data yet'));
    return;
  }
  data.forEach(function (item, index) {
    const row = createElement('div', 'analytics-bar-row');
    const label = createElement('div', 'analytics-bar-label');
    label.appendChild(createElement('span', '', item.label));
    label.appendChild(createElement('strong', '', item.value + (item.value === 1 ? ' candidate' : ' candidates')));
    const track = createElement('div', 'horizontal-track');
    track.setAttribute('aria-hidden', 'true');
    const bar = createElement('span', item.color || chartColors[index % chartColors.length]);
    bar.style.width = (maximum > 0 ? item.value / maximum * 100 : 0) + '%';
    track.appendChild(bar);
    row.append(label, track);
    container.appendChild(row);
  });
}

function updateAnalytics(stats = calculateCandidateStats()) {
  document.getElementById('analytics-total-candidates').textContent = stats.totalCandidates;
  document.getElementById('analytics-average-match').textContent = stats.averageMatchScore;
  document.getElementById('analytics-shortlisted').textContent = stats.shortlisted;
  document.getElementById('analytics-github-verified').textContent = stats.githubVerified;
  document.getElementById('analytics-scored-count').textContent = stats.scoredCandidates;
  document.getElementById('analytics-verified-percent').textContent = percentOf(stats.githubVerified, stats.totalCandidates) + '%';
  document.getElementById('analytics-distribution-subtitle').textContent = 'Compatibility across ' + stats.totalCandidates + ' candidates' +
    (stats.totalCandidates > stats.scoredCandidates ? ' (' + (stats.totalCandidates - stats.scoredCandidates) + ' unscored)' : '');
  document.getElementById('analytics-period').textContent = currentAnalysis ? new Date(currentAnalysis.createdAt).toLocaleDateString() : 'No analysis yet';
  document.getElementById('analytics-data-note').textContent = currentAnalysis ? (showingLiveResults ? 'Analysis results' : 'Sample data') + ' \u00b7 ' + activeRole : 'No analysis data yet';
  const distribution = stats.scoredCandidates ? distributionRows(stats.distribution) : [];
  renderAnalyticsChart('analytics-distribution', distribution, Math.max(1, ...distribution.map(function (row) { return row.value; })),
    stats.totalCandidates ? 'No match scores reported' : 'No analysis data yet');
  renderAnalyticsChart('analytics-skills', stats.skills, stats.totalCandidates, stats.totalCandidates ? 'No matched skills reported' : 'No analysis data yet');
  renderAnalyticsChart('analytics-gaps', stats.gaps, stats.totalCandidates, stats.totalCandidates ? 'No missing skills reported' : 'No analysis data yet');
  const roles = candidatesPerRole();
  renderAnalyticsChart('analytics-roles', roles, Math.max(1, ...roles.map(function (role) { return role.value; })));
  document.getElementById('analytics-roles-subtitle').textContent = showingLiveResults ? 'Candidate volume across saved analyses' : 'Candidate volume by opportunity';
}

// 10. Event listeners: connect native HTML controls to the functions above.
document.querySelectorAll('[data-section]').forEach(function (button) {
  button.addEventListener('click', function (event) {
    event.preventDefault();
    showSection(button.dataset.section);
  });
});

document.getElementById('recent-analyses-body').addEventListener('click', function (event) {
  const button = event.target.closest('[data-analysis-id]');
  if (!button) return;
  if (analysisRunning) { showSection('analysis'); return; }
  const analysis = visibleAnalyses().find(function (item) { return item.id === button.dataset.analysisId; });
  if (!analysis) return;
  selectAnalysis(analysis);
  resetCandidateFilters();
  refreshResults();
  saveResults();
  showSection('candidates');
});
document.getElementById('running-indicator').addEventListener('click', function () {
  showSection('analysis');
});
document.getElementById('use-sample-data').addEventListener('click', useSampleData);
document.getElementById('resume-files').addEventListener('change', function (event) {
  handleResumeUpload(event.target.files);
});

const dropZone = document.getElementById('resume-drop-zone');
dropZone.addEventListener('dragover', function (event) {
  event.preventDefault();
  dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', function (event) {
  if (!dropZone.contains(event.relatedTarget)) dropZone.classList.remove('drag-over');
});
dropZone.addEventListener('drop', function (event) {
  event.preventDefault();
  dropZone.classList.remove('drag-over');
  handleResumeUpload(event.dataTransfer.files);
});

document.getElementById('job-description-file').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!/\.(pdf|docx|txt)$/i.test(file.name)) {
    event.target.value = '';
    showToast('Select a PDF, DOCX, or TXT job description.');
    return;
  }
  jobDescriptionFile = file;
  document.getElementById('jd-file-name').textContent = file.name;
  document.getElementById('remove-jd-file').hidden = false;
  showToast('Job description selected. It will be parsed when you run the analysis.');
});
document.getElementById('remove-jd-file').addEventListener('click', function () {
  jobDescriptionFile = null;
  document.getElementById('job-description-file').value = '';
  document.getElementById('jd-file-name').textContent = 'PDF, DOCX, or TXT';
  document.getElementById('remove-jd-file').hidden = true;
});
document.getElementById('add-github-profile').addEventListener('click', function () {
  const row = addGitHubRow();
  row.querySelector('input').focus();
});
document.getElementById('github-rows').addEventListener('input', function (event) {
  if (event.target.tagName === 'INPUT') event.target.setCustomValidity('');
});
document.getElementById('analysis-form').addEventListener('submit', function (event) {
  event.preventDefault();
  if (validateGitHubProfiles()) startAnalysis();
});

// Indicate the form stage as the recruiter moves between job and candidate fields.
document.getElementById('analysis-form').addEventListener('focusin', function (event) {
  const formSection = event.target.closest('.form-section');
  if (!formSection) return;
  const stage = Array.from(document.querySelectorAll('.form-section')).indexOf(formSection);
  document.querySelectorAll('#new-analysis .step-indicator li').forEach(function (step, index) {
    step.classList.toggle('active', index === stage);
    if (index === stage) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
});

document.getElementById('candidate-search').addEventListener('input', renderCandidates);
['match-filter', 'experience-filter', 'github-filter', 'sort-order'].forEach(function (id) {
  document.getElementById(id).addEventListener('change', renderCandidates);
});
document.getElementById('clear-filters').addEventListener('click', resetCandidateFilters);
document.getElementById('empty-reset-filters').addEventListener('click', resetCandidateFilters);
document.getElementById('candidate-table-body').addEventListener('click', function (event) {
  const button = event.target.closest('[data-candidate-id]');
  if (button) showCandidateDetail(button.dataset.candidateId);
});
document.querySelectorAll('.candidate-tab').forEach(function (tab) {
  tab.addEventListener('click', function () {
    switchCandidateTab(tab.dataset.tab);
  });
  tab.addEventListener('keydown', function (event) {
    const tabs = Array.from(document.querySelectorAll('.candidate-tab'));
    let index = tabs.indexOf(tab);
    if (event.key === 'ArrowRight') index = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') index = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else return;
    event.preventDefault();
    switchCandidateTab(tabs[index].dataset.tab);
    tabs[index].focus();
  });
});
document.getElementById('shortlist-button').addEventListener('click', toggleShortlist);
document.getElementById('download-report').addEventListener('click', downloadCandidateReport);
document.getElementById('menu-toggle').addEventListener('click', function () {
  if (document.body.classList.contains('nav-open')) closeSidebar();
  else openSidebar();
});
document.getElementById('sidebar-overlay').addEventListener('click', function () {
  closeSidebar();
  document.getElementById('menu-toggle').focus();
});
document.addEventListener('keydown', function (event) {
  if (!document.body.classList.contains('nav-open')) return;
  if (event.key === 'Escape') {
    closeSidebar();
    document.getElementById('menu-toggle').focus();
  }
  // Keep keyboard focus within the mobile navigation while the drawer is open.
  if (event.key === 'Tab') {
    const controls = document.querySelectorAll('#sidebar a, #sidebar button');
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
window.matchMedia('(max-width: 960px)').addEventListener('change', closeSidebar);

// 11. Initial render. Nothing is fetched, uploaded, or analyzed on page load.
restoreResults();
addGitHubRow();
refreshResults();
closeSidebar();

