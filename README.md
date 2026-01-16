# Digital Food Coupon Management System

A comprehensive MERN stack application for managing digital food coupons at college conferences. Features QR code-based validation, real-time tracking, and prevents fraud through atomic database operations.

## 🎯 Features

- **Team Registration**: Automated coupon generation with unique QR codes
- **QR Scanner**: Mobile-friendly scanner interface for canteen staff
- **Real-time Validation**: Atomic database operations prevent duplicate usage
- **Admin Dashboard**: Live statistics, team management, and reporting
- **Email Delivery**: Automated email distribution with embedded QR codes
- **Export Functionality**: Google Sheets and CSV export capabilities
- **Role-Based Access**: Admin and Viewer roles with different permissions
- **Security**: JWT authentication, rate limiting, bcrypt password hashing

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: Atlas account or local MongoDB instance
- **Email Service**: Gmail SMTP or other SMTP provider
- **Google Sheets** (Optional): Service account for exports

## 🚀 Quick Start

### 1. Clone/Navigate to Project

```bash
cd "C:\Users\yuvra\OneDrive\Desktop\ramsita coupon"
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env with your configuration
notepad .env

# Create initial admin user
npm run init-admin

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file from example
copy .env.example .env

# Edit .env with your configuration (usually just the API URL)
notepad .env

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## ⚙️ Environment Configuration

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-coupon

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=2h

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=CSIT Department <your-email@gmail.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Google Sheets (Optional)
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# Conference Details
CONFERENCE_NAME=CSIT Department Conference 2025
CONFERENCE_DATE=2025-01-15
CONFERENCE_VENUE=College Canteen
```

**Gmail Setup**: To use Gmail, you need an App Password:
1. Enable 2-factor authentication on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Use this password in `EMAIL_PASS`

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Setup

### Using MongoDB Atlas (Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create database user and password
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs during development)
5. Get connection string and add to backend `.env`

### Local MongoDB

```bash
# Install MongoDB locally, then:
MONGODB_URI=mongodb://localhost:27017/food-coupon
```

## 🔐 Creating Admin Account

After setting up the backend:

```bash
cd backend
npm run init-admin
```

Follow the prompts to enter:
- Admin name
- Email
- Password (min 8 characters)

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create user (admin only)
- `GET /api/auth/me` - Get current user

### Teams
- `POST /api/teams/register` - Register team (Google Form webhook)
- `GET /api/teams` - List teams (with pagination, filters)
- `GET /api/teams/:couponId` - Get team by coupon
- `POST /api/teams/scan` - Scan and validate coupon

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/recent-scans` - Recent scans feed
- `POST /api/admin/export-sheets` - Export to Google Sheets
- `GET /api/admin/export-csv` - Download CSV
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PATCH /api/admin/users/:id/role` - Update user role

## 🎯 Usage Guide

### For Canteen Staff (Scanner)

1. Login with your credentials
2. Navigate to "Scanner" page
3. Point camera at QR code
4. System will automatically validate and show result
5. Green ✓ = Valid coupon (first time use)
6. Red ✗ = Invalid or already used

### For Admins (Dashboard)

1. Login with admin credentials
2. **Dashboard**: View statistics and recent scans
3. **Scanner**: Scan QR codes
4. **Users**: Manage admin and viewer accounts
5. **Export**: Download data as CSV or sync to Google Sheets

### For Viewers

Same as admins but without user management access.

## 🔗 Google Forms Integration

To connect Google Forms for team registration:

1. Create Google Form with required fields
2. Set up Google Apps Script to POST form submissions to `/api/teams/register`
3. See `GOOGLE_FORMS_SETUP.md` for detailed instructions

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Auto-restart on file changes
```

### Frontend Development

```bash
cd frontend
npm run dev  # Hot reload enabled
```

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Serve production build
npm run preview
```

## 📦 Deployment

See `DEPLOYMENT.md` for detailed deployment instructions for:
- MongoDB Atlas
- Backend on Render/Railway
- Frontend on Vercel/Netlify

## 🔒 Security Features

- **JWT Authentication**: 2-hour token expiration
- **Password Hashing**: bcrypt with 10 salt rounds
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS Protection**: Configured allowed origins
- **HTTPS Required**: In production
- **No Sensitive Data in QR**: Only coupon ID stored

## 🧪 Testing

### Test Team Registration

```bash
# Using curl or Postman
POST http://localhost:5000/api/teams/register
Content-Type: application/json

{
  "teamName": "Test Team",
  "teamSize": 2,
  "participants": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "enrollmentNumber": "2024001",
      "class": "CSIT-A",
      "department": "Computer Science"
    },
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "enrollmentNumber": "2024002",
      "class": "CSIT-A",
      "department": "Computer Science"
    }
  ]
}
```

### Test QR Scanning

1. Register a team (above)
2. Check email for QR code
3. Open Scanner page
4. Scan QR code with phone/webcam
5. Verify validation response

## 📝 Project Structure

```
ramsita coupon/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, environment, Google Sheets
│   │   ├── modules/
│   │   │   ├── auth/        # Authentication logic
│   │   │   ├── teams/       # Team management
│   │   │   ├── scans/       # Scan logs
│   │   │   └── admin/       # Admin operations
│   │   ├── utils/           # QR, email, coupon generators
│   │   ├── middlewares/     # Error handling, rate limiting
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── README.md
├── DEPLOYMENT.md
└── GOOGLE_FORMS_SETUP.md
```

## 🐛 Troubleshooting

### Email Not Sending
- Verify Gmail App Password is correct
- Check EMAIL_USER and EMAIL_PASS in .env
- Ensure 2FA is enabled on Gmail account

### MongoDB Connection Failed
- Check MONGODB_URI format
- Verify IP whitelist includes your IP
- Confirm database user credentials

### QR Scanner Not Working
- Allow camera permissions in browser
- Use HTTPS in production (required for camera access)
- Try different camera if multiple available

### CORS Errors
- Verify FRONTEND_URL in backend .env matches frontend URL
- Check both servers are running

## 📞 Support

For issues or questions:
- Check `DEPLOYMENT.md` for deployment issues
- Review `GOOGLE_FORMS_SETUP.md` for form integration
- Contact: admin@example.com

## 📄 License

© 2025 CSIT Department. All rights reserved.

## 🙏 Credits

Built with:
- **MongoDB** - Database
- **Express.js** - Backend framework
- **React** - Frontend library
- **Node.js** - Runtime
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **html5-qrcode** - QR scanning
