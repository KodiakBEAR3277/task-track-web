# Project Overview

This project is a web application that consists of a frontend built with React and a backend powered by Python. The application includes user authentication, project management, and administrative functionalities.

## Frontend

The frontend is located in the `frontend` directory and is built using React. It includes the following components and screens:

- **Components:**
  - `Auth/Login.js`: Handles user authentication.
  - `Auth/SignUp.js`: Allows users to create a new account.
  - `Auth/styles.js`: Contains styles for the authentication components.

- **Screens:**
  - `Home.js`: The landing page of the application.
  - `Projects.js`: Displays a list of projects and their details.
  - `Admin.js`: Provides administrative functionalities.
  - `Student.js`: Displays information relevant to students.

### Setup Instructions

1. Navigate to the `frontend` directory.
2. Install dependencies using npm:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

## Backend

The backend is located in the `backend` directory and is built using Python. It includes the following components:

- **App:**
  - `__init__.py`: Initializes the backend application.
  - `routes.py`: Defines the API routes.
  - `models.py`: Contains data models.

### Setup Instructions

1. Navigate to the `backend` directory.
2. Install dependencies using pip:
   ```
   pip install -r requirements.txt
   ```
3. Run the backend application.

## Project Structure

```
project-root
├── frontend
│   ├── src
│   ├── package.json
│   └── README.md
├── backend
│   ├── app
│   ├── config.py
│   ├── requirements.txt
│   └── README.md
└── README.md
```

## License

This project is licensed under the MIT License.