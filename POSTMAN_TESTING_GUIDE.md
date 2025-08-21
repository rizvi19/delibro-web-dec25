# Delibro API Testing with Postman

## Setup Instructions

### 1. Import the Collection
1. Open Postman
2. Click "Import" button
3. Select the `postman-collection.json` file
4. The collection will be imported with all endpoints

### 2. Set Environment Variables
1. Create a new environment in Postman
2. Add these variables:
   - `base_url`: `http://localhost:3000` (or your deployed URL)
   - `access_token`: (leave empty, will be set automatically)

### 3. Start Your Next.js Application
```bash
npm run dev
```

## Testing Workflow

### Step 1: Test User Registration
**Endpoint**: `POST /api/auth/signup`

**Sample Request Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com", 
  "phone": "1234567890",
  "password": "password123"
}
```

**Expected Response** (Success):
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "name": "John Doe", 
    "phone": "1234567890",
    "email_confirmed": false
  }
}
```

**Expected Response** (Error):
```json
{
  "success": false,
  "message": "User already registered",
  "errors": {}
}
```

### Step 2: Test User Login
**Endpoint**: `POST /api/auth/login`

**Sample Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Response** (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "1234567890",
    "email_confirmed": false
  },
  "session": {
    "access_token": "jwt-token-here",
    "refresh_token": "refresh-token-here", 
    "expires_at": 1234567890
  }
}
```

**Important**: Copy the `access_token` from the response and set it in your Postman environment variable.

### Step 3: Test Protected Routes

#### Get Current User
**Endpoint**: `GET /api/auth/user`

**Headers**:
```
Authorization: Bearer {{access_token}}
```

**Expected Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "1234567890",
    "email_confirmed": false,
    "created_at": "2025-08-21T10:00:00.000Z"
  }
}
```

#### Get User Profile
**Endpoint**: `GET /api/auth/profile`

**Headers**:
```
Authorization: Bearer {{access_token}}
```

**Expected Response**:
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "name": "John Doe",
    "phone": "1234567890",
    "email_confirmed": false,
    "created_at": "2025-08-21T10:00:00.000Z"
  },
  "profile": {
    "id": "uuid-here",
    "name": "John Doe",
    "phone": "1234567890",
    "avatar_url": null,
    "created_at": "2025-08-21T10:00:00.000Z",
    "updated_at": "2025-08-21T10:00:00.000Z"
  }
}
```

### Step 4: Test Logout
**Endpoint**: `POST /api/auth/user` (logout)

**Headers**:
```
Authorization: Bearer {{access_token}}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Error Testing Scenarios

### 1. Invalid Email Format
```json
{
  "name": "John Doe",
  "email": "invalid-email",
  "phone": "1234567890", 
  "password": "password123"
}
```

### 2. Password Too Short
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "123"
}
```

### 3. Missing Required Fields
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 4. Wrong Login Credentials
```json
{
  "email": "john@example.com",
  "password": "wrongpassword"
}
```

### 5. Access Protected Route Without Token
Don't include Authorization header when calling `/api/auth/user` or `/api/auth/profile`

## Automated Test Scripts

You can add these scripts to your Postman requests for automated testing:

### For Login Request (Tests tab):
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has access token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.session.access_token).to.not.be.empty;
    pm.environment.set("access_token", jsonData.session.access_token);
});

pm.test("User data is correct", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.user.email).to.not.be.empty;
});
```

### For Protected Routes (Tests tab):
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("User is authenticated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.user.id).to.not.be.empty;
});
```

## Troubleshooting

### Common Issues:

1. **CORS Error**: Make sure your Next.js app is running on the correct port
2. **404 Error**: Verify the API routes are created in the correct directory structure
3. **401 Unauthorized**: Check that the access token is correctly set in headers
4. **Database Error**: Ensure Supabase environment variables are correctly set
5. **Validation Error**: Check that all required fields are included in request body

### Environment Variables Check:
```bash
# Check if these are set in your .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
