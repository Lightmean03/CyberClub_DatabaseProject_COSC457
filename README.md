# Database Explorer Web Application

A modern web interface for exploring and querying MySQL databases. Built with React, Node.js, Express, and MySQL.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- MySQL Server (v5.7 or higher)
- Git

## Project Structure

```
club-management-app/
├── server/             # Backend server
│   ├── server.js      # Express server configuration
│   └── package.json   # Server dependencies
│
└── client/            # Frontend React application
    ├── src/
    │   ├── App.jsx    # Main application component
    │   └── index.css  # Global styles
    ├── public/
    └── package.json   # Client dependencies
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Lightmean03/CyberClub_DatabaseProject_COSC457.git
cd club-management-app
```

2. Set up the backend server:
```bash
cd server
npm install
```

3. Set up the frontend client:
```bash
cd ../client
npm install
```

4. Configure the database connection:
   - Open `server/server.js`
   - Update the database configuration with your MySQL credentials:
```javascript
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'clubadmin',
  password: 'database457',
  port: 3306,
  database: 'club_management'
});
```

## Database Setup

1. Create the database and tables:
   - Make sure your MySQL server is running
   - Use the provided SQL scripts in `database.sql` to create the necessary database and tables

2. Verify the database connection:
   - Start the server and check the console for successful connection message

## Running the Application

1. Start the backend server:
```bash
cd server
node server.js
```
The server will run on `http://localhost:5000`

2. Start the frontend development server (in a new terminal):
```bash
cd client
npm run dev
```
The application will be available at `http://localhost:5173`

## Features

- View and explore database tables
- Execute custom SQL queries
- View query results in a formatted table
- Quick actions for common queries
- Responsive design for all screen sizes

## Available API Endpoints

- `GET /api/tables` - Get list of all tables
- `POST /api/query` - Execute SQL query

## Troubleshooting

Common issues and solutions:

1. Database Connection Error:
   - Verify MySQL is running
   - Check credentials in server.js
   - Ensure database exists

2. Port Already in Use:
   - Change the port in server.js
   - Kill the process using the port

3. CORS Issues:
   - Ensure the server CORS configuration matches your client URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- React for the frontend framework
- Express for the backend server
- MySQL for the database
- Tailwind CSS for styling
