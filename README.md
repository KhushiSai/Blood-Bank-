# Blood Bank Management System

A comprehensive web-based blood bank management system built with React.js, Node.js, Express.js, and MongoDB. This system helps blood banks efficiently manage donors, inventory, and blood requests while providing a modern, user-friendly interface.

## Features

### Frontend (React.js)
- **Modern UI/UX**: Clean, medical-themed design with responsive layouts
- **Donor Management**: Complete donor profiles with donation history
- **Inventory Tracking**: Real-time blood inventory with visual indicators
- **Request Management**: Blood request processing with priority levels
- **Dashboard Analytics**: Interactive charts and statistics
- **Authentication**: Secure login/registration system
- **Role-based Access**: Different interfaces for admin, staff, and donors

### Backend (Node.js/Express.js)
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based authentication and authorization
- **Role Management**: Admin, staff, and donor role permissions
- **Data Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Proper error handling and logging
- **Security**: Rate limiting, CORS, and security headers

### Database (MongoDB)
- **User Management**: User accounts with different roles
- **Donor Profiles**: Detailed donor information and medical history
- **Inventory Tracking**: Blood type quantities and expiry management
- **Request Processing**: Blood request workflow management
- **Audit Trail**: Track all changes and activities

## Technology Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose ODM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blood-bank-management-system
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory based on `.env.example`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/bloodbank

# JWT Secret (use a strong, random secret)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Server Configuration
NODE_ENV=development
PORT=5000

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will automatically create the required collections when you start using it.

### 5. Start the Application
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at `http://localhost:5173`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/profile` - Update user profile

### Donor Endpoints
- `GET /api/donors` - Get all donors (admin/staff)
- `GET /api/donors/:id` - Get donor by ID
- `PUT /api/donors/:id` - Update donor profile
- `POST /api/donors/:id/donation` - Record donation
- `GET /api/donors/blood-type/:type` - Get donors by blood type

### Inventory Endpoints
- `GET /api/inventory` - Get all inventory
- `PUT /api/inventory/:bloodType` - Update inventory quantity
- `POST /api/inventory/reserve` - Reserve blood for request
- `POST /api/inventory/release` - Release reserved blood
- `GET /api/inventory/alerts` - Get low stock alerts

### Request Endpoints
- `GET /api/requests` - Get all blood requests
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get request by ID
- `PUT /api/requests/:id/status` - Update request status
- `GET /api/requests/urgent/list` - Get urgent requests
- `GET /api/requests/overdue/list` - Get overdue requests

## Usage Guide

### For Administrators
1. **Login** with admin credentials
2. **Manage Donors**: View, add, and update donor profiles
3. **Monitor Inventory**: Track blood levels and receive alerts for low stock
4. **Process Requests**: Approve, reject, or fulfill blood requests
5. **View Analytics**: Access dashboard with charts and statistics

### For Staff Members
1. **Login** with staff credentials
2. **Update Inventory**: Add or remove blood units from inventory
3. **Record Donations**: Log new blood donations from donors
4. **Process Requests**: Handle blood requests from hospitals

### For Donors
1. **Register** as a new donor
2. **View Profile**: Check donation history and eligibility status
3. **Schedule Appointments**: Request donation appointments

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for admin, staff, and donors
- **Rate Limiting**: Prevent API abuse with request rate limiting
- **Input Validation**: Comprehensive validation of all user inputs
- **Password Hashing**: Secure password storage with bcrypt
- **CORS Protection**: Controlled cross-origin resource sharing
- **Security Headers**: Enhanced security with Helmet.js

## Development

### Project Structure
```
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React Context providers
│   ├── pages/             # Page components
│   └── ...
├── server/                # Backend Node.js application
│   ├── models/            # MongoDB/Mongoose models
│   ├── routes/            # API route handlers
│   ├── middleware/        # Custom middleware
│   └── index.js           # Server entry point
├── package.json
└── README.md
```

### Adding New Features
1. **Frontend**: Add new components in `src/components/` or new pages in `src/pages/`
2. **Backend**: Add new routes in `server/routes/` and models in `server/models/`
3. **Database**: Update models in `server/models/` for schema changes

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**Note**: This is a demo application. For production use, ensure proper security auditing, testing, and compliance with healthcare regulations (HIPAA, etc.).