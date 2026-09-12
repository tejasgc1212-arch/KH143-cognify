// The Python server serves this frontend at /frontend/. For a separate local
// frontend server, requests go to Uvicorn on port 8000.
// API credentials belong only in Python's environment, never in this file.
window.CognifyAPI = {
  async analyze(input) {
    if (window.location.protocol === 'file:') {
      throw new Error('Open http://127.0.0.1:8000/frontend/ after starting the Python backend.');
    }
    const apiBase = window.COGNIFY_API_BASE_URL ||
      (['5500', '5501', '8080'].includes(window.location.port) ? 'http://127.0.0.1:8000' : '');
    const form = new FormData();
    ['jobRole', 'department', 'minimumExperience', 'location', 'employmentType', 'jobDescription'].forEach(function (key) {
      form.append(key, input[key] || '');
    });
    if (input.jobDescriptionFile) form.append('jobDescriptionFile', input.jobDescriptionFile);
    input.resumes.forEach(function (resume) {
      if (resume.file && !resume.sample) form.append('resumes', resume.file, resume.name);
    });
    form.append('githubProfiles', JSON.stringify(input.githubProfiles));
    // The browser supplies multipart/form-data and its boundary automatically.
    let response;
    try {
      response = await fetch(apiBase + '/api/analyze', { method: 'POST', body: form });
    } catch (error) {
      throw new Error('Cannot reach the Python backend. Check that Uvicorn is running on port 8000.');
    }
    let result;
    try {
      result = await response.json();
    } catch (error) {
      throw new Error('The server returned an unreadable response. Please retry.');
    }
    if (!response.ok) {
      const details = (result.errors || []).map(function (item) {
        return [item.filename || item.field, item.message].filter(Boolean).join(': ');
      });
      throw new Error([typeof result.detail === 'string' ? result.detail : 'Analysis failed.'].concat(details).join('\n'));
    }
    if (!Array.isArray(result.candidates) || !result.candidates.length) {
      throw new Error('The server returned no completed candidates.');
    }
    return result;
  }
};
