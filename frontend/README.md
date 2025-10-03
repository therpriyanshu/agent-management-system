# Agent Management System

A full-stack MERN application for managing agents and distributing lists among them.

## Features

- ✅ Admin User Authentication (JWT)
- ✅ Agent Management (Create, Read, Update, Delete)
- ✅ CSV/Excel File Upload
- ✅ Automatic List Distribution among Agents
- ✅ Distribution Summary & Analytics
- ✅ Responsive UI

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (File Upload)
- ExcelJS (Excel Processing)

### Frontend

- React.js (with Vite)
- React Router
- Axios
- Context API

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file and add configuration
PORT=5000
MONGO_URI=mongodb://localhost:27017/agent-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
NODE_ENV=development

# Create default admin user (optional)
node createAdmin.js

# Start backend server
npm run dev
```
