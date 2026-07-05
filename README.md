# 🚀 Nexa ERP

A modern Enterprise Resource Planning (ERP) system built using **React**, **FastAPI**, **SQLite**, and **SQLAlchemy**. Nexa ERP helps businesses efficiently manage customers, suppliers, inventory, purchases, sales, and reports through a clean and user-friendly interface.

---

## 📖 Project Overview

Nexa ERP is a full-stack business management application designed to simplify day-to-day business operations. The system provides secure user authentication and enables users to manage customers, suppliers, inventory, purchase transactions, sales transactions, and business reports from a single platform.

The project follows a modern client-server architecture with a React frontend and a FastAPI backend communicating through REST APIs.

---

# ✨ Features

## 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

## 👥 Customer Management
- Add Customer
- View Customers
- Update Customer
- Delete Customer

## 🚚 Supplier Management
- Add Supplier
- View Suppliers
- Update Supplier
- Delete Supplier

## 📦 Inventory Management
- Add Products
- Product Code Management
- Purchase Price
- Selling Price
- GST Percentage
- Opening Stock
- Current Stock
- Stock Status

## 🧾 Purchase Management
- Create Purchase Voucher
- Supplier Selection
- Product Selection
- Purchase History

## 💰 Sales Management
- Create Sales Invoice
- Customer Selection
- Product Selection
- Invoice Generation

## 📊 Reports
- Customer Reports
- Supplier Reports
- Inventory Reports
- Sales Reports
- Purchase Reports

## 📄 PDF Support
- Invoice PDF Generation

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- React Router
- Axios
- CSS

## Backend
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

## Database
- SQLite

## Development Tools
- Git
- GitHub
- VS Code
- Swagger UI

---

# 📂 Project Structure

```
Nexa-ERP
│
├── backend
│   ├── app
│   │   ├── api
│   │   ├── auth
│   │   ├── database
│   │   ├── models
│   │   ├── schemas
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── nexa_erp.db
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/Nexa-ERP.git
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn app.main:app --reload
```

Backend will start at

```
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will start at

```
http://localhost:5173
```

---

# 📚 API Documentation

Swagger Documentation is available at:

```
http://127.0.0.1:8000/docs
```

---

# 🗄 Database

The application currently uses **SQLite** for data storage.

Database file:

```
backend/nexa_erp.db
```

The database stores:

- Users
- Companies
- Customers
- Suppliers
- Inventory
- Purchase Records
- Sales Records

---


# 🔒 Authentication

The application uses **JWT (JSON Web Tokens)** for secure authentication.

Features include:

- Secure Login
- Protected APIs
- User-based Data Access

---

# 📈 Future Enhancements

- PostgreSQL Database
- Cloud Deployment
- Barcode Scanner
- GST Reports
- Dashboard Analytics
- Email Invoice Support
- Backup & Restore
- Multi-company Support

---

# 👩‍💻 Author

**Drishi**

GitHub:

https://github.com/drishi-cloud


---

# 📜 License

This project was developed for educational and learning purposes.

---

# ⭐ If you like this project

Please consider giving it a ⭐ on GitHub.