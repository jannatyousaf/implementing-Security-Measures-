# 🔐 Implementing Security Measures

## 📌 Overview

This project is a simple and secure web application built using **Node.js**. It demonstrates the implementation of authentication and security best practices, providing a robust foundation for understanding modern web security principles.

---

## 🚀 Features

- ✅ User Registration & Login
- ✅ Password Hashing (bcrypt)
- ✅ JWT Authentication
- ✅ Protected Dashboard Route
- ✅ Input Validation (validator)
- ✅ Secure Headers (Helmet)
- ✅ Logout System
- ✅ Frontend UI with Navigation and Alerts
- ✅ Advanced Logging with Winston
- ✅ API Key Authentication
- ✅ Login Attempt Monitoring & Brute Force Protection
- ✅ Rate Limiting (Requests per minute)
- ✅ CSRF Protection with csurf
- ✅ Cookie Parser for secure cookie handling
- ✅ Web Application Firewall (WAF) - Detects & blocks SQL injection, XSS, path traversal attacks
- ✅ Docker Deployment - Containerized application for consistent environments

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **bcrypt** | Password Hashing |
| **jsonwebtoken** | JWT Authentication |
| **validator** | Input Validation |
| **Helmet.js** | Security Headers |
| **Winston** | Logging & Monitoring |
| **express-rate-limit** | Request Rate Limiting |
| **csurf** | CSRF Token Protection |
| **cookie-parser** | Secure Cookie Parsing |
| **CORS** | Cross-Origin Resource Sharing |
| **Docker** | Container Deployment |
| **HTML/CSS/JavaScript** | Frontend UI |

---

## 🔒 Security Implementations

### Access Control
- Protected routes prevent unauthorized access
- Role-based access control for dashboard
- API Key authentication for sensitive endpoints
- Token verification middleware on protected routes
- Token expiration set to 1 hour

### Headers & CSP
- Content Security Policy enforced via Helmet
- Security headers prevent common attacks
- Inline JavaScript removed to prevent XSS attacks
- HSTS enabled with preload flag for secure transport

### Input Validation
- Request validation on all endpoints
- Email format validation using validator library
- Password strength requirements (minimum 6 characters)
- Sanitization of user inputs
- Protection against injection attacks

### Brute Force & Rate Limiting Protection
- Login attempt monitoring to detect suspicious activity
- Blocks IP addresses after 3 failed login attempts
- Global rate limiter: Max 10 requests per minute
- Prevents abuse of endpoints

### CSRF Protection
- csurf middleware implements CSRF token validation
- Cookie-based CSRF token management
- All state-changing requests protected

### Logging & Monitoring
- Winston logger records all security-related events
- Logs written to both console and `security.log` file
- Failed login attempts tracked and logged
- Suspicious activity alerts on 3+ failed attempts
- IP-based attempt tracking for anomaly detection

### Web Application Firewall (WAF)
- Custom WAF middleware detects and blocks common attacks:
  - **SQL Injection patterns:** `' OR 1=1`, `UNION SELECT`, `DROP TABLE`
  - **Cross-Site Scripting (XSS):** `<script>` tags and similar XSS payloads
  - **Path Traversal attacks:** `../` sequences
- Returns 403 Forbidden status for suspicious requests
- Scans both request body and URL parameters
- Real-time logging of blocked threats

---

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Required Headers |
|---|---|---|---|
| POST | `/api/register` | Register a new user | Content-Type: application/json |
| POST | `/api/login` | Login user and get JWT token | Content-Type: application/json |
| GET | `/api/dashboard` | Access protected dashboard | Authorization: JWT_TOKEN |
| GET | `/api/users/count` | Get total user count | x-api-key: mysecretkey123 |

### Request Examples

**Register:**
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**Login:**
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

### Response Examples

**Login Success:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Protected Endpoint Access:**
- Include `Authorization: <token>` header in the request
- Token expires after 1 hour

**API Key Access:**
- Include `x-api-key: mysecretkey123` header
- Example: `GET /api/users/count` with API key header

---

## ⚙️ Installation & Setup

1. **Clone or navigate to the project directory:**
   ```bash
   cd security-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open browser at `http://localhost:5000`
   - Register a new account
   - Login and access the dashboard

---

## 🐳 Docker Deployment

### Prerequisites
- Docker installed on your system

### Running with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t security-project .
   ```

2. **Run the container:**
   ```bash
   docker run -p 5000:5000 security-project
   ```

3. **Access the application:**
   - Open browser at `http://localhost:5000`

### Docker Configuration
- **Base Image:** Node.js 20-slim (optimized for security and size)
- **Working Directory:** `/app`
- **Port Exposed:** 5000
- **Startup Command:** `npm start`

### Dockerfile Contents
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Benefits
- ✅ Consistent environment across development, testing, and production
- ✅ Easy deployment and scaling
- ✅ Isolated application environment
- ✅ Lightweight container with security-focused base image

---

## 📋 Configuration

### Rate Limiting
- **Window:** 1 minute
- **Max Requests:** 10 per minute
- Configured in `server.js`

### Brute Force Protection
- **Threshold:** 3 failed login attempts
- **Action:** IP address is temporarily blocked
- **Reset:** Manual (can be configured with time-based reset)

### JWT Configuration
- **Secret:** 'secretkey'
- **Expiration:** 1 hour
- **Algorithm:** HS256

### API Key
- **Current Key:** `mysecretkey123`
- **Usage:** Pass via `x-api-key` header
- **Protected Endpoints:** `/api/users/count`

### WAF Configuration
- Pattern-based threat detection
- Automatically blocks requests containing suspicious patterns
- Customizable patterns in `middleware/wafMiddleware.js`

---

## 📊 Logging

All security events are logged using Winston:
- **Console Output:** Real-time event logging
- **File Output:** Persistent logs in `security.log`

### Logged Events
- ✓ Registration attempts (success/failure)
- ✓ Login attempts (success/failure)
- ✓ Dashboard access
- ✓ Failed login attempts per IP
- ✓ Suspicious activity alerts
- ✓ WAF-blocked requests

---

## 📂 Project Structure

```
security-project/
├── server.js                    # Main application server with Express, Helmet, CORS, rate limiting
├── logger.js                    # Winston logger configuration
├── Dockerfile                   # Docker container configuration
├── package.json                 # Dependencies and scripts
├── middleware/
│   ├── authMiddleware.js        # JWT authentication middleware
│   ├── apiKey.js                # API Key validation middleware
│   ├── loginMonitor.js          # Login attempt monitoring & brute force protection
│   ├── roleMiddleware.js        # Role-based access control
│   └── wafMiddleware.js         # Web Application Firewall middleware
├── routes/
│   └── auth.js                  # Authentication endpoints (register, login, dashboard, users/count)
└── public/
    ├── dashboard.html
    ├── login.html
    ├── register.html
    └── js/
        ├── dashboard.js
        ├── login.js
        └── register.js
```

---

## 📚 Learning Outcomes

- ✨ Understanding of complete authentication flow in web applications
- ✨ Practical implementation of industry-standard security practices
- ✨ Real-world debugging techniques and error resolution
- ✨ Writing secure, production-ready frontend and backend code
- ✨ Importance of defense-in-depth security strategies
- ✨ Web Application Firewall concepts and threat detection
- ✨ Container-based deployment with Docker

---

## 🔧 Troubleshooting

### Port 5000 Already in Use
```bash
# On Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# On Linux/Mac
sudo lsof -ti:5000 | xargs kill -9
```

### Docker Container Won't Start
```bash
# Check Docker daemon is running and rebuild
docker build --no-cache -t security-project .
```

---

## 📝 License

This project is part of the Internship Learning Program.
