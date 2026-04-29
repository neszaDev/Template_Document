# Student Loan Management System for MFU

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![Vue.js 3.5](https://img.shields.io/badge/Vue.js-3.5-4FC08D)](https://vuejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-2496ED)](https://www.docker.com/)

A full-stack web application for managing student loan applications at Mae Fah Luang University (MFU), Thailand. The system provides role-based access control for students and administrative staff, supporting application submission, document management, verification workflows, and reporting.

## Features

### Student Portal
- User authentication via email/password or Google OAuth
- Submit first and second semester loan applications
- Upload supporting documents with file validation
- Track application status through approval workflow
- View and manage personal information

### Staff Portal
- Review and verify student loan applications
- Edit application data and loan information
- Export application data to Excel format
- Manage staff settings and permissions
- Handle application rejections and appeals
- Email-based role authorization

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue.js 3.5.13, Vue Router 4, Vuex 4, Bootstrap 5 |
| Backend | Node.js, Express.js 4.21.2, JWT Authentication |
| Database | MySQL 8.0, mysql2 3.14.0 |
| Infrastructure | Docker, Docker Compose, Nginx, PM2 |
| File Processing | ExcelJS 4.4.0, PDFKit 0.17.1, Multer 1.4.5 |

## Project Structure

```
studentLoan-Linux-MFU/
├── backend/
│   ├── api/
│   │   ├── session_api.js
│   │   ├── user_api.js
│   │   └── staff/
│   ├── config/
│   │   ├── db.js
│   │   ├── corsConfig.js
│   │   ├── sessionConfig.js
│   │   └── staff.js
│   ├── middleware/
│   ├── utils/
│   ├── docker-entrypoint-initdb.d/Student_loan.sql
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── mixins/
│   │   └── main.js
│   └── package.json
├── nginx/
├── docker-compose.yml
└── example.env
```

## Prerequisites

### Docker Setup (Recommended)
- Docker 20.10 or later
- Docker Compose 1.29 or later
- 2GB available disk space

### Manual Setup
- Node.js 18.0 or later
- npm 9.0 or later
- MySQL 8.0 or later
- Git

### Additional Requirements
- Google OAuth credentials (for authentication)
- Internet connection for dependency installation

## Installation

### Docker Compose

```bash
# Clone repository
git clone https://github.com/yourusername/studentLoan-Linux-MFU.git
cd studentLoan-Linux-MFU

# Setup environment configuration
cp backend/example.env backend/.env

# Edit .env with your configuration
nano backend/.env

# Start services
docker-compose up -d

# Verify services are running
docker-compose ps
```

**Service URLs:**
- Frontend: http://localhost:8010
- Backend API: http://localhost:8020
- PhpMyAdmin: http://localhost:8040
- MySQL: localhost:8030

### Manual Setup

**Backend:**
```bash
cd backend
npm install
cp example.env .env
# Configure .env with database credentials
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run serve
```

## Environment Configuration

Create `backend/.env` with the following variables:

```env
# Server
BACKEND_PORT=3000
BACKEND_HOSTNAME=localhost

# Security (generate unique values for production)
SESSION_SECRET=your-session-secret
JWT_SECRET=your-jwt-secret

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id

# CORS
ALLOWED_ORIGINS=http://localhost:8010

# Database
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=Student_loan
```

## API Endpoints

### Session Management
```
POST   /session/login
POST   /session/login-google
POST   /session/logout
POST   /session/reset
GET    /session/verify
```

### User Operations
```
POST   /user/register
POST   /user/loan
POST   /user/loan-second-semester
GET    /user/loan
GET    /user/status
POST   /user/upload-document
GET    /user/documents
```

### Staff Operations (Authenticated)
```
GET    /staff/users
GET    /staff/users/:id
PUT    /staff/users/:id
POST   /staff/export-excel
POST   /staff/export-pdf
GET    /staff/settings
PUT    /staff/settings
GET    /staff/rejected
```

## Database

The MySQL database is automatically initialized on first run with the schema defined in `backend/docker-entrypoint-initdb.d/Student_loan.sql`.

**Main tables:**
- Faculty and field of study information
- Loan applications and second semester loans
- User document uploads and verification
- Staff settings and permissions
- Application rejection records

### Backup and Restore

```bash
# Backup
docker exec studentloan-mysql mysqldump -u root -p Student_loan > backup.sql

# Restore
docker exec -i studentloan-mysql mysql -u root -p Student_loan < backup.sql
```

## Deployment

### Production Deployment

```bash
docker-compose -f docker-compose.yml up -d
```

**Configuration:**
- Backend service on port 8020
- MySQL service on port 8030 with persistent volume
- Nginx reverse proxy on port 8010
- Automated database backups at 03:00 daily
- Timezone: Asia/Bangkok

### Scaling Considerations
- Backend: PM2 process manager with multi-process support
- Database: MySQL 8.0 with connection pooling
- Recommended: 5-10 concurrent connections per backend instance

## Troubleshooting

### Database Connection Error
- Verify MySQL container is running: `docker-compose ps`
- Check DB_HOST in .env (use 'mysql' for Docker, 'localhost' for manual setup)
- Review logs: `docker-compose logs mysql`

### Session Issues
- Ensure SESSION_SECRET is configured in .env
- Clear browser cookies and login again
- Verify system clock accuracy

### File Upload Failures
- Check upload directory: `docker exec studentloan-backend ls -la /app/uploads/loan_files/`
- Verify disk space: `docker exec studentloan-backend df -h`
- Allowed file types: PDF, JPG, PNG only
- Maximum file size: 5MB (configurable)

### Google OAuth Login Failures
- Verify GOOGLE_CLIENT_ID is active in Google Cloud Console
- Configure redirect URIs in Google OAuth settings
- Check browser console for CORS errors

### Staff Access Denied
- Verify staff email is in `backend/config/staff.js`
- Add email to STAFF_EMAILS array if needed
- Restart backend: `docker-compose restart backend`

## Development

### Running Tests
```bash
cd backend
npm test
```

### Build for Production
```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

### Logs
```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f mysql

# Last 100 lines
docker-compose logs -f --tail=100 backend
```

## Security Considerations

- Generate unique SESSION_SECRET and JWT_SECRET for production
- Use HTTPS in production with SSL certificates
- Configure CORS to only allow known frontend domains
- Use strong database passwords
- Implement proper firewall rules for MySQL
- Keep Docker images updated regularly

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature description'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the ISC License - see [LICENSE](LICENSE) for details.

## Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/yourusername/studentLoan-Linux-MFU/issues)
- Submit a [Discussion](https://github.com/yourusername/studentLoan-Linux-MFU/discussions)
- Contact: MFU Development Team

## Project Information

- **Organization**: Mae Fah Luang University (MFU), Thailand
- **Version**: 1.0.0
- **Status**: Active Development
- **Last Updated**: April 2026



Document และ วิดีโอการใช้งานของ Report.mfu.ac.th

https://drive.google.com/drive/folders/1ZNkuL-YF9UyTCK4pBIk_tBgrKKLbcj6n?usp=sharing
