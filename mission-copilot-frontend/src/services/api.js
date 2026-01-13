import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const generateMission = async (userInput) => {
  try {
    console.log('🚀 Sending to backend:', userInput);
    
    const response = await axios.post(`${API_BASE_URL}/api/generate-mission`, {
      userInput: userInput
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Backend response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to generate mission');
  }
};
