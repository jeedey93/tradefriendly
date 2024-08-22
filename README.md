# TradeFriendly

Welcome to **TradeFriendly**! This application allows you to discover the best NHL teams and players, manage your roster, analyze player stats, and make informed trade decisions.

## Features

- **Team and Player Information:** Fetch and display detailed information about NHL teams and players.
- **Roster Management:** Manage your team’s roster, including adding and removing players.
- **Player Stats Analysis:** Analyze player statistics to make informed trade decisions.
- **Trade Simulator:** Simulate trades between teams to evaluate potential trade outcomes.
- **Draft Tracking:** Track and manage draft picks and player performance.

## Tech Stack

- **Frontend:** ReactJS
- **Backend:** ExpressJS
- **Database:** MongoDB
- **API:** NHL API for real-time player and team data

## Installation

### Prerequisites

- **Node.js** (v16 or later)
- **MongoDB** (running locally or using a cloud instance)

### Clone the Repository

Clone the repository and navigate to the project directory:

git clone https://github.com/your-username/TradeFriendly.git
cd TradeFriendly

### Install Dependencies

Navigate to both the `client` and `server` directories to install the required dependencies.

For the server:

cd server
npm install

For the client:

cd ../client
npm install

### Environment Variables

Create a `.env` file in the `server` directory and add the following variables:

MONGODB_URI=your-mongodb-uri
PORT=5000

## Running the Application

Start the Backend Server:

cd server
npm run dev

Start the React Frontend:

cd client
npm start

The application will be available at [http://localhost:3000](http://localhost:3000) and the API server at [http://localhost:5000](http://localhost:5000).

## API Endpoints

- **GET /api/teams:** Retrieve a list of NHL teams.
- **GET /api/players:** Retrieve a list of players.
- **GET /nhl/stats:** Retrieve current player stats from the NHL API.
- **POST /api/players:** Add or update player information in the database.

## Contributing

1. Fork the repository.
2. Create a new branch:
   git checkout -b feature/YourFeature
3. Make your changes.
4. Commit your changes:
   git commit -am 'Add new feature'
5. Push to the branch:

6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact:

- **Your Name:** justin.do@hotmail.com
- **GitHub:** [https://github.com/jeedey93](https://github.com/jeedey93)
