# Express Authentication API

A comprehensive Node.js authentication API built with Express.js, Sequelize ORM, and JWT tokens. This project provides a complete authentication system with user management, location management, and store management capabilities.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Code Examples](#code-examples)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Contributing](#contributing)

## Features

- 🔐 JWT-based authentication with refresh tokens
- 👤 User registration and login
- 🏢 Location and store management
- 🛡️ Password hashing with bcrypt
- 🗄️ Database support for SQLite and PostgreSQL
- ✅ Input validation with express-validator
- 🔒 Security headers with Helmet
- 📝 Request logging with Morgan
- 🚀 Development tools with Nodemon

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SQLite (for development) or PostgreSQL (for production)

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration (see [Configuration](#configuration) section).

4. **Run database migrations**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Seed the database (optional)**
   ```bash
   npx sequelize-cli db:seed:all
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5173` (or your configured PORT).

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application Environment
PORT=5173
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database Configuration
# For SQLite (development)
DATABASE_URL=sqlite:./express_auth_db.sqlite

# For PostgreSQL (production)
# DATABASE_URL=postgres://user:password@localhost:5432/express_auth_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_change_in_production
JWT_EXPIRES_IN=3600s
REFRESH_TOKEN_EXPIRES_IN=7d
```

### Package Dependencies

#### Production Dependencies

**Core Framework & Server**
- **[express](https://expressjs.com/)** (^5.1.0): Fast, unopinionated, minimalist web framework for Node.js. Provides robust routing, middleware support, and HTTP utility methods for building REST APIs and web applications.

**Database & ORM**
- **[sequelize](https://sequelize.org/)** (^6.37.7): Promise-based Node.js ORM for PostgreSQL, MySQL, MariaDB, SQLite, and Microsoft SQL Server. Features solid transaction support, relations, eager and lazy loading, read replication and more.
- **[sqlite3](https://github.com/TryGhost/node-sqlite3)** (^5.1.7): Asynchronous, non-blocking SQLite3 bindings for Node.js. Used for development database with zero-configuration setup.
- **[pg](https://node-postgres.com/)** (^8.16.3): Non-blocking PostgreSQL client for Node.js. Pure JavaScript client and native libpq bindings for production database.
- **[pg-hstore](https://github.com/scarney81/pg-hstore)** (^2.3.4): A node package for serializing and deserializing JSON data to hstore format for PostgreSQL.

**Authentication & Security**
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)** (^9.0.2): An implementation of JSON Web Tokens for stateless authentication. Supports signing, verification, and expiration of tokens.
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** (^6.0.0): A library to help hash passwords using the bcrypt hashing function. Provides salt generation and secure password comparison.
- **[helmet](https://helmetjs.github.io/)** (^8.1.0): Express.js security middleware that sets various HTTP headers to help protect apps from well-known web vulnerabilities.

**Validation & Middleware**
- **[express-validator](https://express-validator.github.io/docs/)** (^7.2.1): An express.js middleware for validator.js. Provides comprehensive input validation, sanitization, and error handling for request data.
- **[cors](https://github.com/expressjs/cors)** (^2.8.5): Express middleware to enable Cross-Origin Resource Sharing (CORS) with various options for configuring allowed origins, methods, and headers.
- **[morgan](https://github.com/expressjs/morgan)** (^1.10.1): HTTP request logger middleware for Node.js. Provides configurable logging formats for debugging and monitoring API requests.

**Configuration**
- **[dotenv](https://github.com/motdotla/dotenv)** (^17.2.2): Loads environment variables from a .env file into process.env. Helps keep configuration separate from code and manage different environments.

#### Development Dependencies

**Development Tools**
- **[nodemon](https://nodemon.io/)** (^3.1.7): A utility that monitors for changes in source code and automatically restarts the server. Essential for development workflow.
- **[sequelize-cli](https://github.com/sequelize/cli)** (^6.6.2): The Sequelize command line interface. Provides commands for migrations, seeders, and model generation.

## Usage

### Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Start server with debugging
npm run debug

# Start server with debugging and break on first line
npm run debug-brk
```

### Quick Start Example

1. **Register a new user**
   ```bash
   curl -X POST http://localhost:5173/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   ```

2. **Login**
   ```bash
   curl -X POST http://localhost:5173/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

3. **Access protected routes**
   ```bash
   curl -X GET http://localhost:5173/api/auth/profile \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## API Reference

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "Registration successful. Please login to continue.",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/auth/logout
Logout user and invalidate refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "message": "Logged out"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### User Management Endpoints

#### GET /api/users
List all users (requires authentication).

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  ]
}
```

### Location Management Endpoints

#### POST /api/location
Create a new location (requires authentication).

**Request Body:**
```json
{
  "name": "Main Office",
  "description": "Primary business location"
}
```

#### GET /api/location
List all locations (requires authentication).

#### GET /api/location/:id
Get specific location by ID (requires authentication).

#### PUT /api/location/:id
Update location by ID (requires authentication).

#### DELETE /api/location/:id
Delete location by ID (requires authentication).

### Store Management Endpoints

#### POST /api/store
Create a new store (requires authentication).

**Request Body:**
```json
{
  "name": "Store Name",
  "description": "Store description",
  "location_id": 1
}
```

#### GET /api/store
List all stores with location data (requires authentication).

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Store Name",
    "description": "Store description",
    "location_id": 1,
    "location": {
      "id": 1,
      "name": "Main Office",
      "description": "Primary business location"
    }
  }
]
```

#### GET /api/store/:id
Get specific store by ID with location data (requires authentication).

#### PUT /api/store/:id
Update store by ID (requires authentication).

#### DELETE /api/store/:id
Delete store by ID (requires authentication).

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    Users    │       │  Locations   │       │   Stores    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)      │◄──────┤ id (PK)     │
│ name        │       │ name         │       │ name        │
│ email       │       │ description  │       │ description │
│ password    │       │ createdAt    │       │ location_id │
│ role        │       │ updatedAt    │       │ createdAt   │
│ createdAt   │       └──────────────┘       │ updatedAt   │
│ updatedAt   │                              └─────────────┘
└─────────────┘
```

### Table Definitions

#### Users Table
| Column    | Type    | Constraints                    | Description           |
|-----------|---------|--------------------------------|-----------------------|
| id        | INTEGER | PRIMARY KEY, AUTO_INCREMENT    | Unique user identifier|
| name      | STRING  | NOT NULL                       | User's full name      |
| email     | STRING  | NOT NULL, UNIQUE               | User's email address  |
| password  | STRING  | NOT NULL                       | Hashed password       |
| role      | STRING  | NOT NULL, DEFAULT 'user'       | User role (user/admin)|
| createdAt | DATE    | NOT NULL                       | Record creation time  |
| updatedAt | DATE    | NOT NULL                       | Record update time    |

#### Locations Table
| Column      | Type    | Constraints                  | Description              |
|-------------|---------|------------------------------|-------------------------|
| id          | INTEGER | PRIMARY KEY, AUTO_INCREMENT  | Unique location identifier|
| name        | STRING  | NOT NULL                     | Location name           |
| description | TEXT    | NULLABLE                     | Location description    |
| createdAt   | DATE    | NOT NULL                     | Record creation time    |
| updatedAt   | DATE    | NOT NULL                     | Record update time      |

#### Stores Table
| Column      | Type    | Constraints                  | Description              |
|-------------|---------|------------------------------|-------------------------|
| id          | INTEGER | PRIMARY KEY, AUTO_INCREMENT  | Unique store identifier  |
| name        | STRING  | NOT NULL                     | Store name              |
| description | TEXT    | NULLABLE                     | Store description       |
| location_id | INTEGER | FOREIGN KEY → locations.id   | Associated location     |
| createdAt   | DATE    | NOT NULL                     | Record creation time    |
| updatedAt   | DATE    | NOT NULL                     | Record update time      |

### Relationships

- **Location → Store**: One-to-Many (One location can have multiple stores)
- **Store → Location**: Many-to-One (Each store belongs to one location)

## Code Examples

### Authentication Middleware Usage

```javascript
const authMiddleware = require('./src/middlewares/authMiddleware');

// Protect routes that require authentication
router.get('/protected-route', authMiddleware, (req, res) => {
  // Access user data from req.user
  res.json({ user: req.user });
});
```

### Creating a New Controller

```javascript
const { Model } = require('../models');

exports.createItem = async (req, res) => {
  try {
    const item = await Model.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

exports.listItems = async (req, res) => {
  try {
    const items = await Model.findAll();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};
```

### Database Model with Associations

```javascript
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Model', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  Model.associate = function(models) {
    Model.belongsTo(models.OtherModel, {
      foreignKey: 'other_model_id',
      as: 'otherModel'
    });
  };

  return Model;
};
```

### JWT Token Validation

```javascript
const jwt = require('jsonwebtoken');

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Problem**: `ENOENT: no such file or directory` for SQLite

**Solution**:
- Ensure the database file path in `.env` is correct
- Run migrations: `npx sequelize-cli db:migrate`
- Check file permissions

#### 2. JWT Token Errors

**Problem**: `JsonWebTokenError: invalid token`

**Solution**:
- Verify JWT_SECRET is set in `.env`
- Check token format in Authorization header: `Bearer <token>`
- Ensure token hasn't expired

#### 3. Validation Errors

**Problem**: `422 Unprocessable Entity` responses

**Solution**:
- Check request body format matches API documentation
- Ensure required fields are provided
- Validate email format and password length

#### 4. CORS Issues

**Problem**: Cross-origin requests blocked

**Solution**:
- Update `CLIENT_URL` in `.env`
- Configure CORS middleware in `app.js`
- Check browser developer tools for specific CORS errors

#### 5. Port Already in Use

**Problem**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Find process using the port
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or change PORT in .env file
```

### Debug Mode

Run the application in debug mode:

```bash
# Start with debugging enabled
npm run debug

# Or with breakpoint on first line
npm run debug-brk
```

Connect your debugger to `localhost:9229`.

### Logging

The application uses Morgan for HTTP request logging. In development mode, all requests are logged to the console.

For custom logging:

```javascript
console.log('Debug info:', data);
console.error('Error occurred:', error);
```

## FAQ

### Q: How do I change the database from SQLite to PostgreSQL?

**A**: Update your `.env` file:
```env
DATABASE_URL=postgres://username:password@localhost:5432/database_name
```

Then run migrations:
```bash
npx sequelize-cli db:migrate
```

### Q: How do I add new fields to existing models?

**A**: Create a new migration:
```bash
npx sequelize-cli migration:generate --name add-field-to-model
```

Edit the migration file and run:
```bash
npx sequelize-cli db:migrate
```

### Q: How do I implement role-based access control?

**A**: Extend the auth middleware:
```javascript
const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Usage
router.get('/admin-only', authMiddleware, requireRole('admin'), handler);
```

### Q: How do I handle file uploads?

**A**: Install and configure multer:
```bash
npm install multer
```

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});
```

### Q: How do I implement email verification?

**A**: 
1. Add `email_verified` field to User model
2. Generate verification token on registration
3. Send email with verification link
4. Create verification endpoint to validate token

### Q: How do I deploy to production?

**A**:
1. Set `NODE_ENV=production` in environment
2. Use PostgreSQL database
3. Set strong `JWT_SECRET`
4. Configure reverse proxy (nginx)
5. Use process manager (PM2)
6. Enable SSL/HTTPS

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

### Development Guidelines

- Follow existing code style
- Add JSDoc comments for new functions
- Include error handling in all async functions
- Write descriptive commit messages
- Update documentation for API changes

---

**License**: ISC

**Author**: Sem Sopheak

**Version**: 1.0.0