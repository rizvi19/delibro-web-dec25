# 🚀 Postman Setup Guide for Delibro API Testing

## **Step 1: Import the Collection**

1. **Open Postman**
2. **Click Import** (top left)
3. **Choose "Upload Files"**
4. **Select:** `Delibro_API_Tests.postman_collection.json`
5. **Click Import**

✅ **You should now see:** "Delibro Trip API - Complete Test Suite" in your collections

---

## **Step 2: Get Authentication Cookies**

### **Method 1: Browser Cookies (Easiest)**

1. **Login to your app:**
   - Go to `http://localhost:9002/login`
   - Enter your credentials and login

2. **Copy browser cookies:**
   - Press `F12` (or `Cmd+Option+I` on Mac)
   - Go to **Application** tab → **Cookies** → `http://localhost:9002`
   - Copy ALL cookie values (they look like this):
   ```
   sb-[project-ref]-auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; sb-[project-ref]-auth-token-code-verifier=xyz123; 
   ```

3. **Update Postman requests:**
   - In each request, find the **Cookie** header
   - Replace `PASTE_YOUR_BROWSER_COOKIES_HERE` with your copied cookies

---

## **Step 3: Test the Complete Flow**

### **🎯 Testing Order (Follow this sequence):**

#### **Test 1: Authentication**
- Run: **"Unauthorized Request (No Cookies)"** 
- ✅ **Should get:** 401 Unauthorized

#### **Test 2: Create Test Data**
- **Go to web app:** `http://localhost:9002/post-trip`
- **Fill form and create a trip**
- **Go to:** `http://localhost:9002/send-parcel` 
- **Create a parcel request**

#### **Test 3: API Testing**
1. **"Get All Trips"** - Should show your created trip
2. **"Get User's Trips Only"** - Should show only your trips
3. **"Get All Parcels"** - Should show your parcel
4. **"Create Trip Request"** - Should create a match request
5. **"Get Received Trip Requests"** - Should show the request
6. **"Accept Trip Request"** - Should accept the request
7. **"Get All Notifications"** - Should show notifications

---

## **Step 4: Variables Explained**

The collection uses these variables (automatically set):

- **`{{baseUrl}}`** → `http://localhost:9002`
- **`{{tripId}}`** → Auto-filled from "Get All Trips" response
- **`{{parcelId}}`** → Auto-filled from "Get All Parcels" response  
- **`{{requestId}}`** → Auto-filled from "Create Trip Request" response

---

## **Step 5: Expected Results**

### **✅ Successful Responses:**

**Get All Trips:**
```json
{
  "trips": [
    {
      "id": "uuid",
      "origin": "Dhaka",
      "destination": "Chittagong", 
      "travel_date": "2025-09-15",
      "transport_mode": "bus",
      "status": "active",
      "profiles": {
        "name": "Your Name"
      }
    }
  ]
}
```

**Create Trip Request:**
```json
{
  "tripRequest": {
    "id": "uuid",
    "status": "pending",
    "message": "Hi! Can you please carry my parcel?"
  }
}
```

**Accept Trip Request:**
```json
{
  "success": true,
  "status": "accepted"
}
```

---

## **Step 6: Troubleshooting**

### **❌ "Unauthorized" Error**
- **Fix:** Update Cookie header with fresh browser cookies
- **Check:** Make sure you're logged in at `http://localhost:9002`

### **❌ "Trip not found" Error**  
- **Fix:** Run "Get All Trips" first to populate `{{tripId}}`
- **Check:** Variables tab in collection should have values

### **❌ No trips returned**
- **Fix:** Create a trip via web form at `/post-trip`
- **Check:** Database has data in `trips` table

### **❌ CORS Error**
- **Fix:** Make sure server is running on port 9002
- **Check:** `npm run dev` is running successfully

---

## **Step 7: Advanced Testing**

### **Search & Filter Tests:**
- **Search by location:** Change origin/destination in "Search Trips by Location"
- **Search by date:** Modify date in "Search Trips by Date"
- **User-specific data:** Use `userOnly=true` parameter

### **Complete Workflow Test:**
1. **Create trip** (web form)
2. **Create parcel** (web form)  
3. **Browse trips** (API)
4. **Request delivery** (API)
5. **Accept request** (API)
6. **Check notifications** (API)

---

## **🎉 Quick Start Commands**

```bash
# 1. Make sure server is running
npm run dev

# 2. Login at browser
open http://localhost:9002/login

# 3. Create test data
open http://localhost:9002/post-trip

# 4. Import collection and test!
```

---

## **Collection Features**

✅ **25+ API endpoints** covered  
✅ **Automatic variable extraction** (IDs, tokens)  
✅ **Built-in tests** (status codes, response validation)  
✅ **Error case testing** (unauthorized, invalid data)  
✅ **Complete workflow** (create → browse → request → accept)

Your Postman collection is ready! Just import it and start testing! 🚀
