# 💼 Job Portal

A full-stack web application that connects **job seekers** and **employers**.
Users can **register**, **create company profiles**, **post jobs**, **search and apply** for opportunities — all in one place.

---

## 🚀 Features

### 👤 Authentication & Users

* Register and login using **JWT** (JSON Web Tokens)
* Role-based users: **Job Seeker** & **Recruiter**
* Profile setup for both individuals and companies

### 💼 Jobs Management

* Recruiters can **post**, **update**, and **delete** job listings
* Job seekers can **search**, **filter**, and **apply** for jobs
* Dynamic search filters by:

  * Job title / keyword
  * Category
  * Company
  * Location
  * Salary range
  * Job type (Full-time, Part-time, Remote, etc.)
  * Seniority & Experience

### 🧭 Job Browsing

* Smart filter bar with advanced search
* Real-time UI update when filtering jobs
* Sticky search bar when scrolling
* Clean, responsive layout (Tailwind CSS + ShadCN UI)

### 🛠️ Technologies

| Layer         | Stack                                                        |
| ------------- | ------------------------------------------------------------ |
| **Frontend**  | React.js, Vite, Redux Toolkit, TailwindCSS, ShadCN UI, Axios |
| **Backend**   | Node.js, Express.js, Mongoose                                |
| **Database**  | MongoDB Atlas                                                |
| **Auth**      | JSON Web Token (JWT)                                         |
| **Cloud**     | Cloudinary (for resumes, logos, etc.)                        |
| **Dev Tools** | Vite, ESLint, Prettier, Nodemon                              |

---

## 🧩 Project Structure

```
JobPortal/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🧱 Prerequisites

* Node.js **v16+**
* MongoDB (local or MongoDB Atlas)
* Git

### 🔧 Steps

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/alexnguyenhao/JobPortal.git
cd JobPortal
```

#### 2️⃣ Install dependencies for backend

```bash
cd backend
npm install
```

#### 3️⃣ Create `.env` file in backend folder

Use `.env.example` as reference:

```bash
DB_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 4️⃣ Start backend server

```bash
npm start
```

Server runs at ➜ **[http://localhost:3000](http://localhost:3000)**

---

#### 5️⃣ Setup frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at ➜ **[http://localhost:5173](http://localhost:5173)**

---

## 💡 Usage

* Open [http://localhost:5173](http://localhost:5173)
* Register a new account or log in
* Browse available jobs or post new listings
* Apply for jobs as a job seeker
* Manage your posted jobs as a recruiter

---

## 📸 Screenshots (suggestion)

| Login Page                            | Job Listing                          |
| ------------------------------------- | ------------------------------------ |
| ![Login](https://i.imgur.com/xyz.png) | ![Jobs](https://i.imgur.com/abc.png) |

---

## 🧠 API Endpoints

### Auth

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/v1/user/register` | Register a new user |
| POST   | `/api/v1/user/login`    | Login existing user |

### Jobs

| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| GET    | `/api/v1/job/get`    | Get all jobs               |
| GET    | `/api/v1/job/search` | Search jobs (with filters) |
| POST   | `/api/v1/job/post`   | Create new job             |
| GET    | `/api/v1/job/:id`    | Get job by ID              |
| PATCH  | `/api/v1/job/:id`    | Update job                 |
| DELETE | `/api/v1/job/:id`    | Delete job                 |

---

## 🧑‍💻 Contributing

1. Fork the repository
2. Create a new branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```
4. Push to your branch:

   ```bash
   git push origin feature/your-feature
   ```
5. Open a **Pull Request** 🎉

---

## 📜 License

This project is licensed under the **MIT License**.

---

**Author:** [Nguyễn Alex](https://github.com/alexnguyenhao)
**Project:** Job Portal – Smart recruitment platform for modern careers.
