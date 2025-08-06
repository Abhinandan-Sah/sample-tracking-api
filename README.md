# Sample Logistics & Tracking API

## 📋 Project Overview

This project provides a robust backend API designed to streamline the logistics of collecting biological samples. It serves as the core infrastructure for a system where agents collect samples from various locations like hospitals and clinics, often under challenging conditions such as low connectivity and tight schedules.

The API manages the entire sample lifecycle, from scheduling and assignment to tracking and final collection, ensuring data integrity and operational efficiency.

## ✨ Core Features

- **Add New Sample**: Schedule a new sample collection and assign it to an agent
- **Mark Sample Collected**: Update a sample's status to COLLECTED in real-time
- **Fetch Agent's Samples**: Retrieve a complete list of samples assigned to a specific agent
- **Delay Reporting**: Proactively flag sample collections as delayed with reason tracking
- **Relational Data Integrity**: Enforces clear relationships between Samples, Hospitals, and Agents using PostgreSQL
- **Scalable Architecture**: Built with a modular structure in TypeScript for maintainability and future expansion

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Optimized for managed services like NeonDB)
- **ORM**: Prisma for type-safe database interactions and schema management
- **Authentication**: Clerk (Fully integrated but disabled at route level for simplified review)

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A PostgreSQL database (e.g., a free instance from Neon)

### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd sample-tracking-api
npm install
```

### Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Open the `.env` file and add your PostgreSQL connection string:

```env
DATABASE_URL="YOUR_NEONDB_POSTGRES_CONNECTION_STRING"
CLERK_SECRET_KEY="your_secret_key"
PORT=50001
CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
```

### Step 3: Database Migration & Seeding

```bash
# Create the database tables based on the Prisma schema
npx prisma migrate dev --name init

# Run the seed script to create a test hospital and agent
npm run db:seed
```

**Important**: After running the seed command, copy the Hospital and Agent IDs from the console output. You'll need these for testing the API endpoints.

### Step 4: Start the Server

```bash
npm run dev
```

The API will be running at `http://localhost:5001`

## 📡 API Endpoints & Testing Guide

> **Note**: Replace `YOUR_HOSPITAL_ID`, `YOUR_AGENT_ID`, and `YOUR_SAMPLE_ID` with actual IDs from the seeding step or API responses.

### 1. Add a New Sample

Schedule a new sample for collection.

**Method**: `POST`  
**Endpoint**: `/api/samples`

**Request Body**:
```json
{
  "patientName": "Jane Smith",
  "sampleType": "Urine",
  "hospitalId": "YOUR_HOSPITAL_ID",
  "agentId": "YOUR_AGENT_ID"
}
```

**Success Response** (201 Created):
```json
{
    "id": "clwz...",
    "patientName": "Jane Smith",
    "sampleType": "Urine",
    "status": "PENDING",
    "createdAt": "2025-08-06T12:30:00.000Z",
    "collectedAt": null,
    "delayReason": null,
    "hospitalId": "YOUR_HOSPITAL_ID",
    "agentId": "YOUR_AGENT_ID"
}
```

**curl Example**:
```bash
curl -X POST http://localhost:5001/api/samples \
-H "Content-Type: application/json" \
-d '{"patientName": "Jane Smith", "sampleType": "Urine", "hospitalId": "YOUR_HOSPITAL_ID", "agentId": "YOUR_AGENT_ID"}'
```

### 2. Fetch All Samples for an Agent

Retrieve all samples assigned to a specific agent.

**Method**: `GET`  
**Endpoint**: `/api/samples?agentId=YOUR_AGENT_ID`

**Success Response** (200 OK):
```json
[
    {
        "id": "clwz...",
        "patientName": "Jane Smith",
        "sampleType": "Urine",
        "status": "PENDING",
        "createdAt": "2025-08-06T12:30:00.000Z",
        "collectedAt": null,
        "delayReason": null,
        "hospitalId": "YOUR_HOSPITAL_ID",
        "agentId": "YOUR_AGENT_ID",
        "hospital": {
            "id": "YOUR_HOSPITAL_ID",
            "name": "City General Hospital",
            "address": "123 Health St, Medville"
        }
    }
]
```

**curl Example**:
```bash
curl "http://localhost:5001/api/samples?agentId=YOUR_AGENT_ID"
```

### 3. Mark Sample as Collected

Update a sample's status to COLLECTED.

**Method**: `PATCH`  
**Endpoint**: `/api/samples/:id/collect`

**Request Body**:
```json
{
  "agentId": "YOUR_AGENT_ID"
}
```

**Success Response** (200 OK):
```json
{
    "id": "YOUR_SAMPLE_ID",
    "patientName": "Jane Smith",
    "sampleType": "Urine",
    "status": "COLLECTED",
    "createdAt": "2025-08-06T12:30:00.000Z",
    "collectedAt": "2025-08-06T12:35:00.000Z",
    "delayReason": null,
    "hospitalId": "YOUR_HOSPITAL_ID",
    "agentId": "YOUR_AGENT_ID"
}
```

**curl Example**:
```bash
curl -X PATCH http://localhost:5001/api/samples/YOUR_SAMPLE_ID/collect \
-H "Content-Type: application/json" \
-d '{"agentId": "YOUR_AGENT_ID"}'
```

### 4. Report Sample Delay

Flag a sample collection as delayed with a reason.

**Method**: `PATCH`  
**Endpoint**: `/api/samples/:id/delay`

**Request Body**:
```json
{
  "agentId": "YOUR_AGENT_ID",
  "reason": "Heavy traffic on main route"
}
```

**Success Response** (200 OK):
```json
{
    "id": "YOUR_SAMPLE_ID",
    "patientName": "Jane Smith",
    "sampleType": "Urine",
    "status": "DELAYED",
    "createdAt": "2025-08-06T12:30:00.000Z",
    "collectedAt": null,
    "delayReason": "Heavy traffic on main route",
    "hospitalId": "YOUR_HOSPITAL_ID",
    "agentId": "YOUR_AGENT_ID"
}
```

**curl Example**:
```bash
curl -X PATCH http://localhost:5001/api/samples/YOUR_SAMPLE_ID/delay \
-H "Content-Type: application/json" \
-d '{"agentId": "YOUR_AGENT_ID", "reason": "Heavy traffic on main route"}'
```

## 🔐 Authentication Strategy

This application is fully integrated with Clerk for robust user authentication. The necessary middleware and type definitions are in place.

For the purpose of this review, the `authMiddleware` has been intentionally decoupled from the routes to allow for direct testing of the API's core logic without needing a valid JWT. In a production environment, the `agentId` would be securely extracted from the `req.auth` object populated by the middleware, rather than being passed in the request body or query parameters.

## 📁 Project Structure

```
sample-tracking-api/
├── src/
│   ├── middleware/
│   ├── routes/
│   ├── types/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── package.json
└── README.md
```

## 🧪 Testing

Use tools like Postman, Insomnia, or curl to test the API endpoints. Make sure to:

1. Run the database seeding to get test IDs
2. Use the correct IDs in your requests
3. Follow the endpoint examples provided above

## 🚀 Deployment

This API is optimized for deployment on platforms like:

- **Vercel** (recommended for Next.js integration)
- **Railway**
- **Render**
- **Heroku**

Make sure to set your `DATABASE_URL` environment variable in your deployment platform.

## 📝 License

This project is licensed under the MIT License.