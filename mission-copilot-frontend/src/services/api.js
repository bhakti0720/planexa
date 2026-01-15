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

// ===== MongoDB API Functions =====

/**
 * Save a mission to MongoDB
 */
export const saveMission = async (query, data, userId = 'temp-user') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/missions`, null, {
      params: { query, userId },
      data: data,
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Mission saved to MongoDB:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to save mission:', error);
    throw error;
  }
};

/**
 * Get all missions from MongoDB
 */
export const getAllMissions = async (userId = 'temp-user') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/missions`, {
      params: { userId }
    });
    console.log('✅ Missions fetched from MongoDB:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch missions:', error);
    return [];
  }
};

/**
 * Delete a mission from MongoDB
 */
export const deleteMission = async (missionId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/missions/${missionId}`);
    console.log('✅ Mission deleted from MongoDB');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to delete mission:', error);
    throw error;
  }
};

/**
 * Save a chat to MongoDB
 */
export const saveChat = async (chatId, name, messages, userId = 'temp-user') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chats`, null, {
      params: { chatId, name, userId },
      data: { messages },
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Chat saved to MongoDB:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to save chat:', error);
    throw error;
  }
};

/**
 * Get all chats from MongoDB
 */
export const getAllChats = async (userId = 'temp-user') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chats`, {
      params: { userId }
    });
    console.log('✅ Chats fetched from MongoDB:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to fetch chats:', error);
    return [];
  }
};

/**
 * Delete a chat from MongoDB
 */
export const deleteChat = async (chatId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/chats/${chatId}`);
    console.log('✅ Chat deleted from MongoDB');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to delete chat:', error);
    throw error;
  }
};

/**
 * Add a message to an existing chat
 */
export const addMessageToChat = async (chatId, message) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/chats/${chatId}/messages`, message);
    console.log('✅ Message added to chat');
    return response.data;
  } catch (error) {
    console.error('❌ Failed to add message:', error);
    throw error;
  }
};
