# One Question - Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/onequestion
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_TO=notify-me@gmail.com
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Deploy to Render
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set environment variables in Render dashboard
5. Deploy!

## API Endpoints

**POST** `/api/propose`
- Save user response
- Send email notification

**GET** `/api/propose`
- Get all responses (admin only)

---

Made with ❤️ for Propose Day