# Planexa Data Storage System

## Overview

Planexa uses a **dual-storage architecture** combining **localStorage** (browser-based) and **MongoDB** (cloud-based) to provide the best of both worlds: offline functionality and cloud synchronization.

---

## Storage Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                          │
│              (Create/View/Delete Chats)                      │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  Frontend (React)                            │
│                 PlannerPage.jsx                              │
└─────────┬───────────────────────────────┬───────────────────┘
          │                               │
          │                               │
    ┌─────▼─────┐                   ┌────▼─────┐
    │localStorage│                   │ MongoDB  │
    │  (Browser) │                   │  (Cloud) │
    └────────────┘                   └──────────┘
    • Immediate                      • Persistent
    • Offline                        • Cross-device
    • Local only                     • Requires internet
```

---

## Current Implementation

### Active Storage: localStorage

**Location**: `mission-copilot-frontend/src/pages/PlannerPage.jsx` (Line 660+)

**How It Works:**

1. **On App Load** (Lines 680-720):
   ```javascript
   useEffect(() => {
     const savedMissions = missionStorage.getAll();
     // Loads all chats from browser's localStorage
     // Converts to chat format and displays in sidebar
   }, []);
   ```

2. **When User Creates Chat** (Lines 730-750):
   ```javascript
   const handleNewChat = () => {
     const newChat = { id: Date.now(), name: 'New Chat', messages: [] };
     setChats([newChat, ...chats]);
     // Saved to localStorage automatically
   };
   ```

3. **When User Sends Message** (Lines 780-850):
   ```javascript
   const handleSendMessage = async (messageContent) => {
     // 1. Add user message to chat
     // 2. Call backend API to generate mission
     // 3. Add AI response to chat
     // 4. Save to localStorage
     missionStorage.save({
       id: activeChat,
       query: messageContent,
       data: missionData,
       timestamp: new Date()
     });
   };
   ```

4. **When User Deletes Chat** (Lines 740-770):
   ```javascript
   const handleDeleteChat = (chatId) => {
     // Remove from state
     setChats(chats.filter(c => c.id !== chatId));
     // Remove from localStorage
     missionStorage.delete(chatId);
   };
   ```

---

## MongoDB Integration (Available)

**Location**: `mission-copilot-frontend/src/pages/PlannerPage.jsx` (Lines 1-659, commented out)

### Backend API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/chats` | GET | Fetch all chats for user |
| `/api/chats` | POST | Create or update chat |
| `/api/chats/{id}` | GET | Get specific chat |
| `/api/chats/{id}` | DELETE | Delete chat |
| `/api/chats/{id}/messages` | POST | Add message to chat |
| `/api/missions` | GET | Fetch all missions |
| `/api/missions` | POST | Save mission |
| `/api/missions/{id}` | DELETE | Delete mission |

### How MongoDB Version Works:

1. **On App Load**:
   ```javascript
   useEffect(() => {
     const loadChats = async () => {
       const savedChats = await getAllChats(); // API call to MongoDB
       setChats(savedChats);
     };
     loadChats();
   }, []);
   ```

2. **When User Sends Message**:
   ```javascript
   const handleSendMessage = async (messageContent) => {
     // 1. Generate mission via API
     // 2. Add to chat state
     // 3. Save to MongoDB
     await saveChat(chatId, chatName, messages);
   };
   ```

3. **When User Deletes Chat**:
   ```javascript
   const handleDeleteChat = async (chatId) => {
     await deleteChatAPI(chatId); // API call to MongoDB
     setChats(chats.filter(c => c.id !== chatId));
   };
   ```

---

## Comparison: localStorage vs MongoDB

| Feature | localStorage | MongoDB |
|---------|-------------|---------|
| **Storage Location** | Browser (client-side) | Cloud (server-side) |
| **Data Persistence** | Per browser/device | Across all devices |
| **Offline Access** | ✅ Yes | ❌ No (requires internet) |
| **Cross-Device Sync** | ❌ No | ✅ Yes |
| **Storage Limit** | ~5-10 MB | Unlimited (512 MB free tier) |
| **Speed** | ⚡ Instant | 🌐 Network dependent |
| **Data Loss Risk** | High (browser clear) | Low (cloud backup) |
| **Setup Required** | None | MongoDB Atlas account |
| **Privacy** | High (local only) | Medium (cloud storage) |

---

## User Interaction Flow

### Scenario 1: Using localStorage (Current)

```
User Opens App
    ↓
Frontend loads data from browser's localStorage
    ↓
User sees previous chats instantly (offline capable)
    ↓
User creates new chat
    ↓
User sends message: "Design a CubeSat for agriculture"
    ↓
Frontend calls Backend API → Gemini AI generates mission
    ↓
Mission data returned to Frontend
    ↓
Frontend saves chat + mission to localStorage
    ↓
User refreshes page → Data still there (same browser)
    ↓
User opens on different device → Data NOT available ❌
```

### Scenario 2: Using MongoDB (Available but commented)

```
User Opens App
    ↓
Frontend calls GET /api/chats → MongoDB
    ↓
User sees previous chats from cloud (any device)
    ↓
User creates new chat
    ↓
User sends message: "Design a CubeSat for agriculture"
    ↓
Frontend calls Backend API → Gemini AI generates mission
    ↓
Mission data returned to Frontend
    ↓
Frontend calls POST /api/chats → Saves to MongoDB
    ↓
User opens on different device → Data IS available ✅
    ↓
User goes offline → Cannot access chats ❌
```

### Scenario 3: Hybrid Approach (Recommended)

```
User Opens App
    ↓
Frontend tries MongoDB first
    ↓
If MongoDB available:
    ├─ Load from MongoDB
    └─ Sync to localStorage (cache)
    ↓
If MongoDB unavailable:
    └─ Load from localStorage (fallback)
    ↓
User sends message
    ↓
Save to BOTH:
    ├─ localStorage (immediate, offline backup)
    └─ MongoDB (cloud sync, try-catch for errors)
    ↓
Result: Best of both worlds! ✅
```

---

## Implementation Details

### localStorage Storage Structure

**File**: `mission-copilot-frontend/src/hooks/useLocalStorage.js`

```javascript
// Storage key: 'planexa_missions'
{
  "planexa_missions": [
    {
      "id": 1736912345678,
      "timestamp": 1736912345678,
      "query": "Design a 3U CubeSat for agriculture",
      "data": {
        "mission_name": "AgriWatch-58",
        "orbit": { "altitude_km": 550, ... },
        "constellation": { "satellites": 1, ... },
        ...
      }
    },
    ...
  ]
}
```

**Functions**:
- `missionStorage.save(mission)` - Save new mission
- `missionStorage.getAll()` - Get all missions
- `missionStorage.delete(id)` - Delete mission by ID
- `missionStorage.clear()` - Clear all missions

### MongoDB Storage Structure

**Database**: `planexa`

**Collections**:

#### `chats` Collection
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "chatId": "1736912345678",
  "userId": "temp-user",
  "name": "Agriculture Mission Chat",
  "messages": [
    {
      "id": "msg-1",
      "role": "user",
      "content": "Design a 3U CubeSat",
      "timestamp": "2026-01-15T10:00:00Z"
    },
    {
      "id": "msg-2",
      "role": "assistant",
      "content": "Mission generated successfully!",
      "missionData": { ... },
      "timestamp": "2026-01-15T10:00:05Z"
    }
  ],
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:05Z"
}
```

#### `missions` Collection
```javascript
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "userId": "temp-user",
  "query": "Design a 3U CubeSat for agriculture",
  "data": {
    "mission_name": "AgriWatch-58",
    "orbit": { "altitude_km": 550, ... },
    ...
  },
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z"
}
```

---

## Switching Between Storage Methods

### Currently Active: localStorage

**To verify**: Check `mission-copilot-frontend/src/pages/PlannerPage.jsx`
- Lines 660+ should be active (uncommented)
- Lines 1-659 should be commented out

### To Switch to MongoDB:

1. **Uncomment MongoDB version** (Lines 1-659)
2. **Comment out localStorage version** (Lines 660+)
3. **Configure MongoDB credentials** in `mission-copilot-backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/...
   MONGODB_DB_NAME=planexa
   ```
4. **Restart backend server**

### To Implement Hybrid (Best Approach):

Create a new version that:
1. Tries MongoDB first
2. Falls back to localStorage if MongoDB fails
3. Saves to both simultaneously
4. Syncs localStorage to MongoDB when connection restored

---

## Troubleshooting

### localStorage Issues

**Problem**: Chats disappear after clearing browser data
- **Cause**: localStorage is cleared with browser cache
- **Solution**: Use MongoDB for persistent storage

**Problem**: Can't access chats on different device
- **Cause**: localStorage is device-specific
- **Solution**: Use MongoDB for cross-device sync

### MongoDB Issues

**Problem**: 503 errors in console
- **Cause**: MongoDB not configured or connection failed
- **Solution**: Add credentials to `.env` file

**Problem**: CORS errors
- **Cause**: Backend server crashed or not running
- **Solution**: Check backend logs, restart server

**Problem**: Can't access chats offline
- **Cause**: MongoDB requires internet connection
- **Solution**: Implement hybrid approach with localStorage fallback

---

## Recommendations

### For Development:
✅ Use **localStorage** (current setup)
- Fast, simple, no configuration needed
- Perfect for testing and development

### For Production (Single User):
✅ Use **localStorage**
- No server costs
- Instant performance
- Privacy-focused

### For Production (Multi-User/Team):
✅ Use **MongoDB** or **Hybrid**
- Cross-device synchronization
- Team collaboration
- Data backup and recovery
- Scalable for growth

### For Best User Experience:
✅ Use **Hybrid Approach**
- Offline functionality (localStorage)
- Cloud sync when online (MongoDB)
- Automatic fallback
- Best of both worlds

---

## Configuration Files

### Backend Configuration
**File**: `mission-copilot-backend/.env`
```env
# Gemini AI
GEMINI_API_KEY=your_key_here

# MongoDB (Optional - leave empty to disable)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/...
MONGODB_DB_NAME=planexa
```

### Frontend Configuration
**File**: `mission-copilot-frontend/.env`
```env
# Backend API URL
VITE_API_URL=http://localhost:8000
```

---

## Summary

| Aspect | Current (localStorage) | Available (MongoDB) | Recommended (Hybrid) |
|--------|----------------------|-------------------|-------------------|
| **Setup Complexity** | ⭐ Easy | ⭐⭐⭐ Medium | ⭐⭐⭐⭐ Complex |
| **Offline Support** | ✅ Yes | ❌ No | ✅ Yes |
| **Cross-Device Sync** | ❌ No | ✅ Yes | ✅ Yes |
| **Data Persistence** | ⚠️ Browser-dependent | ✅ Reliable | ✅ Reliable |
| **Performance** | ⚡ Instant | 🌐 Network-dependent | ⚡ Instant (cached) |
| **Best For** | Single device, dev | Multi-device, prod | All scenarios |

---

## Next Steps

1. **Keep current localStorage setup** for immediate use
2. **Configure MongoDB** when ready for cloud sync
3. **Consider hybrid approach** for production deployment
4. **Backup important data** regardless of storage method

For MongoDB setup instructions, see: `walkthrough.md`
