# Postman Testing Guide for Delibro Post Trip Backend

## 🧪 **Complete API Testing with Postman**

### **Prerequisites**
1. ✅ Server running on `http://localhost:9002`
2. ✅ Supabase database tables created
3. ✅ User account created and authenticated
4. ✅ Postman installed

---

## 🔐 **Step 1: Authentication Setup**

The easiest way to test is to use browser session cookies:

1. **Login through web app:** Go to `http://localhost:9002/login` and log in
2. **Get session cookies:** 
   - Open Browser DevTools (F12)
   - Go to Application → Cookies → `http://localhost:9002`
   - Copy all cookie values

---

## 🚀 **Step 2: Test Post Trip Flow**

### **Test 1: Create a Trip (Web Form)**
1. Go to `http://localhost:9002/post-trip`
2. Fill the form:
   ```
   From: Dhaka
   To: Chittagong  
   Date: 2025-09-15
   Time: 10:00
   Transport: Bus
   Capacity: 5kg, 1 small bag
   Notes: Can carry documents only
   ```
3. Click "Post Trip"
4. Should see success message

### **Test 2: Verify Trip Created (API)**

**Method:** `GET`  
**URL:** `http://localhost:9002/api/trips?userOnly=true`  
**Headers:**
```
Content-Type: application/json
Cookie: sb-[project-ref]-auth-token=[token-value]
```

**Expected Response:**
```json
{
  "trips": [
    {
      "id": "trip-uuid",
      "user_id": "user-uuid", 
      "origin": "Dhaka",
      "destination": "Chittagong",
      "travel_date": "2025-09-15",
      "departure_time": "10:00:00",
      "transport_mode": "bus",
      "available_capacity": "5kg, 1 small bag",
      "status": "active",
      "profiles": {
        "name": "Your Name"
      }
    }
  ]
}
```

---

## 📦 **Step 3: Test Complete Workflow**

### **Test 3: Browse All Trips**

**Method:** `GET`  
**URL:** `http://localhost:9002/api/trips`  
**Headers:**
```
Content-Type: application/json
Cookie: [copy from browser]
```

### **Test 4: Search Trips with Filters**

**Method:** `GET`  
**URL:** `http://localhost:9002/api/trips?origin=Dhaka&destination=Chittagong&date=2025-09-15`

### **Test 5: Create Trip Request**

**Method:** `POST`  
**URL:** `http://localhost:9002/api/trip-requests`  
**Headers:**
```
Content-Type: application/json
Cookie: [copy from browser]
```

**Body (raw JSON):**
```json
{
  "tripId": "your-trip-uuid",
  "parcelId": "your-parcel-uuid", 
  "message": "Can you carry my documents?",
  "priceOffered": 500
}
```

### **Test 6: Get Trip Requests**

**Method:** `GET`  
**URL:** `http://localhost:9002/api/trip-requests?type=received`

### **Test 7: Accept Trip Request**

**Method:** `PATCH`  
**URL:** `http://localhost:9002/api/trip-requests/[request-id]`

**Body:**
```json
{
  "status": "accepted"
}
```

---

## 🎯 **Quick Testing Steps**

### **Minimal Test Flow:**

1. **Create User Account:**
   - Go to `/signup` and create account
   - Verify email if required

2. **Post a Trip:**
   - Go to `/post-trip` 
   - Fill form and submit
   - Check for success message

3. **Test API Response:**
   ```bash
   # In Postman:
   GET http://localhost:9002/api/trips?userOnly=true
   Headers: Cookie: [paste browser cookies]
   ```

4. **Verify Database:**
   - Check Supabase Dashboard
   - Look for new row in `trips` table

---

## 🔍 **Common Issues & Solutions**

### **❌ "Unauthorized" Error**
- **Solution:** Copy fresh cookies from browser after login
- **Check:** Ensure you're logged in at `http://localhost:9002`

### **❌ "Table doesn't exist" Error**  
- **Solution:** Run the complete `database-schema.sql` in Supabase
- **Check:** Verify all tables exist in Supabase Dashboard

### **❌ CORS Error**
- **Solution:** Test from same domain (`localhost:9002`)
- **Check:** Don't test from different ports

---

## 📊 **Expected Results**

After successful testing, you should see:

1. ✅ **Trip created** in database
2. ✅ **API returns trip data** 
3. ✅ **Dashboard shows the trip**
4. ✅ **Trip appears in browse page**
5. ✅ **Can create requests** for the trip

---

## 🚀 **Ready-to-Use Postman Collection**

Create a new collection with these requests:

**Collection Variables:**
- `baseUrl`: `http://localhost:9002`
- `cookies`: `[paste your browser cookies here]`

**Requests:**
1. **GET User Trips** → `{{baseUrl}}/api/trips?userOnly=true`
2. **GET All Trips** → `{{baseUrl}}/api/trips` 
3. **POST Trip Request** → `{{baseUrl}}/api/trip-requests`
4. **GET Notifications** → `{{baseUrl}}/api/notifications`

This will verify your post-trip backend is working perfectly! 🎉
