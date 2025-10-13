# Workasana Backend

Workasana is a comprehensive task management and team collaboration platform that enables users to create projects, assign tasks to team members, set deadlines, and organize work with tags. The platform features secure user authentication, dynamic filtering, URL-based queries, and robust reporting tools to monitor task progress and optimize team productivity.

---

## DEMO Link

🔗 [Live Demo](https://workasana-frontend-nu.vercel.app/)

---

## ⚙️ Quick Start

```bash

# Clone the repository
git clone https://github.com/Jaytun-Kankotiya/Workasana-Backend.git

# Navigate to the project directory
cd Workasana-Backend

# Install dependencies
npm install
# or
yarn install

# Start the server
npm start
# or
yarn start

# Start the server in development mode with auto-reload
npm run dev
# or
yarn dev

```

**Technologies Used:**

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **API Client:** Axios
- **Authentication:** JWT-based secure authentication
- **Environment Variables:** dotenv
- **Development Tool::** Nodemon (hot-reloading)

---

## ✨ Features

**🏠 Dashboard**

- View active tasks, projects, and teams.
- Filter tasks and projects by status, priority, or tags.
- Monitor task progress and team productivity.

**🔐 Authentication**

- Secure user registration and login.
- JWT-based protected routes for task, project, and team operations.
- Passwords hashed using bcrypt.

**⚡ Additional Highlights**

- RESTful API design following best practices.
- Centralized error handling and response structure.
- CORS-enabled for frontend integration.
- Modular route and controller architecture for scalability.

---

## 📚 API Reference

### **POST /register**</br>

Register a new user</br>
Sample Response:</br>

```
{
  "userId": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

### **Post /login**</br>

Authenticate an existing user</br>
Sample Response:</br>

```
{
  "userId": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

### **Post /v1/tasks**</br>

Create a new task</br>
Sample Response:</br>

```
{
  "_id": "task123",
  "name": "Design Landing Page",
  "project": "project123",
  "team": "team123",
  "owners": ["owner1", "owner2"],
  "tags": ["UI", "Frontend"],
  "status": "In Progress",
  "timeToComplete": "10"
}
```

### **GET /v1/tasks**</br>

Retrieve all tasks</br>
Sample Response:</br>

```
[
  {
    "_id": "task123",
    "name": "Design Landing Page",
    "project": "project123",
    "team": "team123",
    "owners": ["owner1", "owner2"],
    "tags": ["UI", "Frontend"],
    "status": "In Progress",
    "timeToComplete": "10"
  }
]
```

### **Post /v1/projects**</br>

Create a new project</br>
Sample Response:</br>

```
{
  "_id": "agent123",
  "name": "Website Design",
  "description": "Launch the website design in Q5"
}
```

### **GET /v1/projects**</br>

Retrieve all projects</br>
Sample Response:</br>

```
[
  {
    "_id": "agent123",
    "name": "Website Design",
    "description": "Launch the website design in Q5"
  },
  ...
]
```

### **Post /v1/teams**</br>

Create a new team</br>
Sample Response:</br>

```
{
  "_id": "team123",
  "name": "UI/UX Team",
  "members": ["Jason Thomson", "Gretchen Johnson", "Jack Patel"]
}
```

### **GET /v1/teams**</br>

Retrieve all teams</br>
Sample Response:</br>

```
[
  {
    "_id": "team123",
    "name": "UI/UX Team",
    "members": ["Jason Thomson", "Gretchen Johnson", "Jack Patel"]
  }
]
```

---

## 🧠 Future Enhancements

- 📈 Role-based access control (Admin, Manager, Agent)
- 🗓️ Task activity timelines and reminders
- 📬 Email notifications for new assignments and status updates
- 🧾 Export data to CSV or Excel
- 📊 Advanced analytics dashboard with progress visualization

## 📬 Contact

For any questions, suggestions, or feature requests, feel free to reach out:</br>
📧 jaytunkankotiya81@gmail.com</br>
💼 [GitHub Profile](https://github.com/Jaytun-Kankotiya)
