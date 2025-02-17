# To-Do List App

A simple and interactive To-Do List application built using **React**, **TypeScript**, **React Query**, and **Tailwind CSS**. The app allows users to manage tasks efficiently with features like adding, editing, marking completion, and deleting tasks.

## 📖 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Project Structure](#project-structure)
- [Contributors](#contributors)
- [License](#license)

## ✨ Features

- 📝 **Create, Edit, and Delete Tasks**  
- ✅ **Mark Tasks as Completed**  
- 🔄 **Persistent Storage with React Query**  
- 🎨 **Dark Mode Support**  
- 📢 **Toast Notifications for Errors and Actions**  

## 🛠 Installation

### Prerequisites

Ensure you have **Node.js** and **npm/yarn** installed.

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app

Install dependencies:
sh
Copiar
Editar
npm install
# or
yarn install
Start the development server:
sh
Copiar
Editar
npm run dev
# or
yarn dev
🚀 Usage
Log in to your account (authentication logic assumed).
Add new tasks using the Create Task button.
Edit or delete tasks as needed.
Toggle task completion by clicking the checkmark (✔️).
View tasks dynamically updated via React Query.
⚙️ Configuration
The application fetches tasks from the following API endpoint:

bash
Copiar
Editar
https://to-do-list-u0q3.onrender.com/tasks
Ensure you set up authentication, as requests require a valid Bearer Token.

📂 Project Structure
css
Copiar
Editar
/src
│── components/
│   ├── Header.tsx
│   ├── CreateTask.tsx
│   ├── EditTask.tsx
│   ├── ExcludTaskAlert.tsx
│   ├── Loading.tsx
│── ui/
│   ├── Table.tsx
│   ├── Toggle.tsx
│── App.tsx
│── main.tsx
│── index.css
│── ...
📦 Dependencies
React (UI framework)
TypeScript (Typed JavaScript)
React Query (Data fetching and caching)
Axios (HTTP requests)
Lucide-React (Icons)
Tailwind CSS (Styling)
React-Toastify (Notifications)
🤝 Contributors
Your Name (@yourusername)
📜 License
This project is licensed under the MIT License.