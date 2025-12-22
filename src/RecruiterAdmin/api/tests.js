const BASE_URL = "http://127.0.0.1:5000/api/v1";

export const testApi = {
  startTest: async (questionSetId) => {
    try {
      const response = await fetch(`${BASE_URL}/test/start/${questionSetId}`);
      if (!response.ok) throw new Error('Failed to fetch test');
      return await response.json();
    } catch (error) {
      console.error('Error starting test:', error);
      throw error;
    }
  },

  submitSection: async (questionSetId, submissionData) => {
    try {
      const url = questionSetId
        ? `${BASE_URL}/test/submit_section/${encodeURIComponent(questionSetId)}`
        : `${BASE_URL}/test/submit_section`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      if (!response.ok) throw new Error('Failed to submit test');
      return await response.json();
    } catch (error) {
      console.error('Error submitting section:', error);
      throw error;
    }
  },
  saveViolations: async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/test/save_violations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to save violations');
      return await response.json();
    } catch (error) {
      console.error('Error saving violations:', error);
      throw error;
    }
  },
};
