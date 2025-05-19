# Machine Test for MERN Stack Developer at CS Tech
Made by Raunak Agarwal
A real estate management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js) for managing real estate agents and distributing leads among them.

## Project Overview

This project demonstrates the following skills:

- Full-stack MERN development
- RESTful API design
- Authentication and authorization
- File handling and data processing
- Modern UI/UX with Material-UI
- State management
- Error handling and validation

## Features

1. **Admin Dashboard**

   - Secure JWT-based authentication
   - View system statistics
   - Manage agents and leads

2. **Agent Management**

   - Create, view, and manage agents
   - Store agent details (name, email, mobile, password)
   - View agent performance

3. **Lead Distribution**
   - Upload leads via CSV/Excel files
   - Automatic distribution among agents
   - View distributed leads by agent

## Technology Stack

- **Frontend**:
  - React.js
  - Material-UI
  - React Router
  - Axios for API calls
- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Multer for file uploads
  - CSV/XLSX parsing

## Prerequisites

- Node.js (v14 or above)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd real-estate-management
```

2. **Set up environment variables**

Create `.env` file in the `backend` directory:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/real_estate_management
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=24h
```

3. **Install dependencies**

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

4. **Create admin user**

Run the seed script to create the admin user:

```bash
cd backend
node seed.js
```

## Admin Credentials

Default admin account is created with the following credentials:

- **Email**: admin@example.com
- **Password**: admin123

## Running the Application

1. **Start the backend server**

```bash
cd backend
npm run dev
```

2. **Start the frontend development server**

```bash
cd frontend
npm start
```

3. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage Guide

### 1. Login

- Access the login page at http://localhost:3000/login
- Use the admin credentials provided above

### 2. Agent Management

- Navigate to "Agents" in the navigation bar
- Add new agents with their details
- View and manage existing agents

### 3. Lead Distribution

- Navigate to "Upload" in the navigation bar
- Prepare your leads file in CSV/Excel format with columns:
  - FirstName
  - Phone
  - Notes
- Upload the file to distribute leads among agents
- View distributed leads in the "Lists" section

### Sample Data

A sample CSV file (`sample_leads.csv`) is provided for testing:

```
FirstName,Phone,Notes
John Smith,9876543210,Interested in 3BHK apartment
Sarah Johnson,8765432109,Looking for villa in city center
...
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin profile

### Agents

- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Lists

- `POST /api/lists/upload` - Upload and distribute lists
- `GET /api/lists` - Get all distributed lists
- `GET /api/lists/agent/:agentId` - Get lists for specific agent

## File Upload Requirements

- **Supported formats**: CSV, XLSX, XLS
- **Required columns**:
  - FirstName (text)
  - Phone (number)
  - Notes (text, optional)
- **Maximum file size**: 5MB

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Admin-only access

## Implementation Details

### Frontend

- Responsive design using Material-UI
- Form validation and error handling
- Protected routes
- File upload with progress indication
- Real-time data updates

### Backend

- RESTful API architecture
- Middleware for authentication
- File processing and validation
- Data distribution algorithm
- Error handling and logging




