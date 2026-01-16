# Bulk User Creation Script

This script creates multiple viewer users at once.

## Usage

### Prerequisites
- Backend server running
- Admin JWT token (from login)

### Steps

#### 1. Get Admin Token
Login as admin and copy the JWT token from the response or browser storage.

#### 2. Create Users

**Using PowerShell:**

```powershell
# Set variables
$API_URL = "http://localhost:5000/api"
$ADMIN_TOKEN = "YOUR_JWT_TOKEN_HERE"

# Create a viewer user
$body = @{
    name = "Scanner User 1"
    email = "scanner1@example.com"
    password = "SecurePass123"
    role = "viewer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_URL/admin/users" `
    -Method POST `
    -Headers @{
        "Authorization" = "Bearer $ADMIN_TOKEN"
        "Content-Type" = "application/json"
    } `
    -Body $body
```

**Using cURL:**

```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Scanner User 1",
    "email": "scanner1@example.com",
    "password": "SecurePass123",
    "role": "viewer"
  }'
```

### Bulk Creation Script (PowerShell)

```powershell
# Bulk create multiple viewers
$API_URL = "http://localhost:5000/api"
$ADMIN_TOKEN = "YOUR_JWT_TOKEN_HERE"

$users = @(
    @{ name = "Counter 1 Staff"; email = "counter1@example.com"; password = "Counter123"; role = "viewer" },
    @{ name = "Counter 2 Staff"; email = "counter2@example.com"; password = "Counter123"; role = "viewer" },
    @{ name = "Counter 3 Staff"; email = "counter3@example.com"; password = "Counter123"; role = "viewer" }
)

foreach ($user in $users) {
    $body = $user | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$API_URL/admin/users" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $ADMIN_TOKEN"
                "Content-Type" = "application/json"
            } `
            -Body $body
        
        Write-Host "✓ Created: $($user.name)" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed: $($user.name) - $($_.Exception.Message)" -ForegroundColor Red
    }
}
```

---

## User Credentials Template

Keep track of created users:

| Name | Email | Password | Role | Created |
|------|-------|----------|------|---------|
| Counter 1 Staff | counter1@example.com | Counter123 | viewer | 2026-01-13 |
| Counter 2 Staff | counter2@example.com | Counter123 | viewer | 2026-01-13 |
| Counter 3 Staff | counter3@example.com | Counter123 | viewer | 2026-01-13 |

---

## Security Tips

1. **Use strong passwords** (minimum 8 characters)
2. **Give different passwords** to each user
3. **Tell users to change their password** after first login (you can add this feature later)
4. **Don't share admin credentials** with viewers

---

## Changing User Roles

If you need to promote a viewer to admin or demote an admin:

1. Go to **Users** page (admin only)
2. Click **"Edit Role"** next to the user
3. Select new role (Admin or Viewer)
4. Click **"Update Role"**

---

## Password Reset (Future Enhancement)

Currently, only admins can create users with passwords. To implement self-service password reset:

1. Add "Forgot Password" link on login page
2. Send email with reset token
3. User clicks link and sets new password

This can be added later if needed!
