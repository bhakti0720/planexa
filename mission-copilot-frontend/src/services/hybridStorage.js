/**
 * Hybrid Storage Service
 * 
 * Provides unified storage interface with MongoDB as primary and localStorage as fallback
 * - Tries MongoDB first for cloud sync and cross-device access
 * - Falls back to localStorage for offline support
 * - Saves to both for redundancy
 */

import { getAllChats, saveChat, deleteChat as deleteChatAPI } from './api';
import { missionStorage } from '../hooks/useLocalStorage';

const STORAGE_MODE = {
  MONGODB: 'mongodb',
  LOCALSTORAGE: 'localStorage',
  HYBRID: 'hybrid'
};

class HybridStorage {
  constructor() {
    this.currentMode = STORAGE_MODE.HYBRID;
    this.mongoDBAvailable = null; // null = unknown, true/false = tested
  }

  /**
   * Check if MongoDB is available
   */
  async checkMongoDBAvailability() {
    try {
      await getAllChats('temp-user');
      this.mongoDBAvailable = true;
      return true;
    } catch (error) {
      // 503 means MongoDB not configured (expected)
      // Other errors mean network/server issues
      this.mongoDBAvailable = false;
      return false;
    }
  }

  /**
   * Load all chats - MongoDB first, localStorage fallback
   */
  async loadChats(userId = 'temp-user') {
    console.log('🔄 Loading chats with hybrid storage...');

    // Try MongoDB first
    try {
      const mongoChats = await getAllChats(userId);
      console.log('✅ Loaded from MongoDB:', mongoChats.length, 'chats');
      
      // Sync to localStorage for offline backup
      this.syncToLocalStorage(mongoChats);
      
      this.mongoDBAvailable = true;
      return {
        chats: mongoChats,
        source: STORAGE_MODE.MONGODB
      };
    } catch (error) {
      console.warn('⚠️ MongoDB unavailable, using localStorage fallback');
      this.mongoDBAvailable = false;
      
      // Fallback to localStorage
      const localChats = this.loadFromLocalStorage();
      return {
        chats: localChats,
        source: STORAGE_MODE.LOCALSTORAGE
      };
    }
  }

  /**
   * Save chat - to both MongoDB and localStorage
   */
  async saveChat(chatId, chatName, messages, userId = 'temp-user') {
    console.log('💾 Saving chat with hybrid storage...');

    const chatData = {
      chatId,
      userId,
      name: chatName,
      messages,
      updatedAt: new Date().toISOString()
    };

    let mongoSuccess = false;
    let localSuccess = false;

    // Try MongoDB first
    if (this.mongoDBAvailable !== false) {
      try {
        await saveChat(chatId, chatName, messages, userId);
        console.log('✅ Saved to MongoDB');
        mongoSuccess = true;
        this.mongoDBAvailable = true;
      } catch (error) {
        console.warn('⚠️ MongoDB save failed:', error.message);
        this.mongoDBAvailable = false;
      }
    }

    // Always save to localStorage (backup)
    try {
      this.saveToLocalStorage(chatData);
      console.log('✅ Saved to localStorage');
      localSuccess = true;
    } catch (error) {
      console.error('❌ localStorage save failed:', error);
    }

    return {
      success: mongoSuccess || localSuccess,
      mongoSuccess,
      localSuccess,
      source: mongoSuccess ? STORAGE_MODE.MONGODB : STORAGE_MODE.LOCALSTORAGE
    };
  }

  /**
   * Delete chat - from both MongoDB and localStorage
   */
  async deleteChat(chatId, userId = 'temp-user') {
    console.log('🗑️ Deleting chat with hybrid storage...');

    let mongoSuccess = false;
    let localSuccess = false;

    // Try MongoDB first
    if (this.mongoDBAvailable !== false) {
      try {
        await deleteChatAPI(chatId, userId);
        console.log('✅ Deleted from MongoDB');
        mongoSuccess = true;
      } catch (error) {
        console.warn('⚠️ MongoDB delete failed:', error.message);
        this.mongoDBAvailable = false;
      }
    }

    // Always delete from localStorage
    try {
      this.deleteFromLocalStorage(chatId);
      console.log('✅ Deleted from localStorage');
      localSuccess = true;
    } catch (error) {
      console.error('❌ localStorage delete failed:', error);
    }

    return {
      success: mongoSuccess || localSuccess,
      mongoSuccess,
      localSuccess
    };
  }

  /**
   * Save mission data to localStorage
   */
  saveToLocalStorage(chatData) {
    // Convert chat format to mission format for compatibility
    const missionData = {
      id: chatData.chatId,
      timestamp: new Date(chatData.updatedAt).getTime(),
      query: chatData.messages.find(m => m.role === 'user')?.content || '',
      data: chatData.messages.find(m => m.role === 'assistant')?.missionData || null
    };

    missionStorage.save(missionData);
  }

  /**
   * Load chats from localStorage
   */
  loadFromLocalStorage() {
    const missions = missionStorage.getAll();
    
    // Convert mission format to chat format
    return missions.map(mission => ({
      id: mission.id,
      name: mission.query?.substring(0, 40) + '...' || 'Mission Chat',
      messages: [
        {
          id: `${mission.id}-user`,
          role: 'user',
          content: mission.query,
          timestamp: new Date(mission.timestamp).toISOString()
        },
        {
          id: `${mission.id}-assistant`,
          role: 'assistant',
          content: 'Mission generated successfully!',
          missionData: mission.data,
          timestamp: new Date(mission.timestamp + 1000).toISOString()
        }
      ],
      createdAt: new Date(mission.timestamp).toISOString(),
      updatedAt: new Date(mission.timestamp).toISOString()
    }));
  }

  /**
   * Delete chat from localStorage
   */
  deleteFromLocalStorage(chatId) {
    missionStorage.delete(chatId);
  }

  /**
   * Sync MongoDB data to localStorage for offline backup
   */
  syncToLocalStorage(mongoChats) {
    try {
      mongoChats.forEach(chat => {
        const missionData = {
          id: chat.chatId || chat.id,
          timestamp: new Date(chat.updatedAt || chat.createdAt).getTime(),
          query: chat.messages.find(m => m.role === 'user')?.content || '',
          data: chat.messages.find(m => m.role === 'assistant')?.missionData || null
        };
        
        missionStorage.save(missionData);
      });
      console.log('✅ Synced MongoDB data to localStorage');
    } catch (error) {
      console.warn('⚠️ Failed to sync to localStorage:', error);
    }
  }

  /**
   * Get current storage status
   */
  getStatus() {
    return {
      mode: this.currentMode,
      mongoDBAvailable: this.mongoDBAvailable,
      isOnline: this.mongoDBAvailable === true,
      isOffline: this.mongoDBAvailable === false,
      isUnknown: this.mongoDBAvailable === null
    };
  }
}

// Export singleton instance
export const hybridStorage = new HybridStorage();
export default hybridStorage;
