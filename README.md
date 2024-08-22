TradeFriendly
Welcome to TradeFriendly! This application allows you to discover the best NHL teams and players, manage your roster, analyze player stats, and make informed trade decisions.

Features
Team and Player Information: Fetch and display detailed information about NHL teams and players.
Roster Management: Manage your team’s roster, including adding and removing players.
Player Stats Analysis: Analyze player statistics to make informed trade decisions.
Trade Simulator: Simulate trades between teams to evaluate potential trade outcomes.
Draft Tracking: Track and manage draft picks and player performance.
Tech Stack
Frontend: ReactJS
Backend: ExpressJS
Database: MongoDB
API: NHL API for real-time player and team data
Installation
Prerequisites
Node.js (v16 or later)
MongoDB (running locally or using a cloud instance)
Clone the Repository
bash
Copy code
git clone https://github.com/your-username/TradeFriendly.git
cd TradeFriendly
Install Dependencies
Navigate to both the client and server directories to install the required dependencies.

For the server:

bash
Copy code
cd server
npm install
For the client:

bash
Copy code
cd ../client
npm install
Environment Variables
Create a .env file in the server directory and add the following variables:

env
Copy code
MONGODB_URI=your-mongodb-uri
PORT=5000
Running the Application
Start the Backend Server:

bash
Copy code
cd server
npm start
Start the React Frontend:

bash
Copy code
cd ../client
npm start
The application will be available at http://localhost:3000 and the API server at http://localhost:5000.

API Endpoints
GET /api/teams: Retrieve a list of NHL teams.
GET /api/players: Retrieve a list of players.
GET /nhl/stats: Retrieve current player stats from the NHL API.
POST /api/players: Add or update player information in the database.
Contributing
Fork the repository.
Create a new branch (git checkout -b feature/YourFeature).
Make your changes.
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature/YourFeature).
Create a new Pull Request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
For any questions or feedback, please contact:

Your Name: justin.do@hotmail.com
GitHub: https://github.com/jeedey93
