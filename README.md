FundMeNow 🚀 : Crowdfunding Platform for Real Causes
==

FundMeNow is a full-stack MERN crowdfunding platform where campaign creators raise funds for medical, education, and community causes, and donors browse, support, and track their impact.

---
✨ Features
==

🎯 Campaign Creators

Create campaigns with title, goal, deadline, category, and images

Track raised amounts and campaign status in real-time

Professional creator dashboard with form validation

View donations received on each campaign page


💝 Donors

Browse all active campaigns with progress bars and funding %

Donate with optional personal messages

Personal donor dashboard showing donation history

See recent donors on every campaign page


🛡️ Secure & Modern

JWT authentication with role-based access (creator/donor)

MongoDB with Mongoose for campaigns, users, donations

Tailwind CSS + responsive design

Clean API with Express + CORS


🏗️ Tech Stack
==

Frontend: React 18 + Vite + Tailwind CSS + React Router

Backend: Node.js + Express + MongoDB + Mongoose + JWT

Deployment: Netlify (Frontend) + Render (Backend) + MongoDB Atlas


📱 Live Demo
--
Frontend: https://your-netlify-site.netlify.app

Backend API: https://your-render-api.onrender.com/api/campaigns


🚀 Quick Start (Local)
==

Prerequisites:
-
Node.js 18+

MongoDB Atlas account (free tier)

Backend
-

cd server

npm install

Add .env with MONGO_URI, JWT_SECRET

npm run dev


Frontend
-

cd client

npm install

npm run dev


📂 Project Structure
===

 FundMeNow/

├── client/           # React + Vite + Tailwind

│   ├── src/

│   │   ├── pages/    # Home, CampaignDetails, Dashboards

│   │   ├── context/  # AuthContext

│   │   └── api.js    # API client

├── server/           # Node + Express + MongoDB

│   ├── routes/       # auth, campaigns, donations

│   ├── models/       # User, Campaign, Donation

│   └── middleware/   # auth middleware

└── README.md


🔧 Key Features Implemented
==
| Feature         | Status | Details                          |
| --------------- | ------ | -------------------------------- |
| User Auth       | ✅      | JWT + Role-based (Creator/Donor) |
| Campaign CRUD   | ✅      | Full create/edit/track           |
| Donation System | ✅      | Real-time updates                |
| Responsive UI   | ✅      | Mobile-first Tailwind            |
| Donor Dashboard | ✅      | History + Stats                  |
| Recent Donors   | ✅      | Per-campaign donor list          |


🛠️ Future Enhancements
==

 Razorpay/Stripe payment integration

 Campaign images upload

 Email notifications

 Admin dashboard

 Social sharing


 🙏 Acknowledgments
 ==
Built with ❤️ using:
-

React

Tailwind CSS

MongoDB Atlas

Render

Netlify


⭐ Star this repo if it helped you!
===
