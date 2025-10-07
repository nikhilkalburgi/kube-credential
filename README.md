# Kube Credential System

A microservices-based credential issuance and verification system built with Node.js, TypeScript, React, and Kubernetes.

- Name: Nikhil S Kalburgi
- Email: <nikhilkalburgi19@gmail.com>
- Contact: +91 9110651716

Screenshot: Screenshot_kube.png, Screenshot_kube2.png, Screenshot_kube3.png

## Project Structure

```text
kube-credential/
├── services/
│   ├── credential-service/         # Credential Issuance Service and Verification Service
├── frontend/            # React Frontend Application
└── k8s/                # Kubernetes Manifests
```

## Prerequisites

- Node.js 18+
- Docker
- concurrently

## Getting Started

1. Install dependencies:

   ```bash
   npm run install-all
   ```

2. Start the backend services:

   ```bash
   npm run start-services
   ```

3. Start the frontend:

   ```bash
   npm run start-frontend
   ```

## Building Docker Images

   ```bash
   docker compose up
   ```

## API Endpoints

### Issuance Service (Port 3001)

- POST `/api/issue`
  - Request body: JSON credential data
  - Response: Credential ID, issuing worker, and timestamp

### Verification Service (Port 3002)

- POST `/api/verify`
  - Request body: JSON credential data
  - Response: Verification status, issuing worker, and timestamp

## Testing

Run all tests:

```bash
npm test
```
