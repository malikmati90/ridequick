[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/malikmati90/ridequick)

# 🚖 Taxi & VTC Reservation Platform  

## 📌 Overview  
This project is a **web platform** for booking taxis and private cars (VTC) in **Barcelona**, integrating a **predictive demand model** for dynamic pricing. The system consists of a FastAPI backend and a Next.js (TypeScript) frontend, ensuring scalability, efficiency, and maintainability.

## 🎯 Key Features  
- **User Booking System** – Users can book rides and manage reservations.  
- **Admin Panel** – Admins manually assign drivers and manage bookings.  
- **Predictive Demand Model** – Uses machine learning to adjust pricing dynamically.  
- **Secure Authentication** – User login and access control.  
- **RESTful API** – Backend built with FastAPI for efficient data handling.  

---

## 🛠️ Tech Stack  

### **🌐 Frontend (Next.js + TypeScript)**  
- **[Next.js](https://nextjs.org/)** – React-based framework for server-side rendering  
- **[TypeScript](https://www.typescriptlang.org/)** – Type-safe development  
- **[TailwindCSS](https://tailwindcss.com/)** – Utility-first styling  
- **[ShadCN/UI](https://ui.shadcn.com/)** – Pre-built UI components for a modern design  

### **🖥 Backend (FastAPI + PostgreSQL)**  
- **[FastAPI](https://fastapi.tiangolo.com/)** – High-performance Python web framework  
- **[PostgreSQL](https://www.postgresql.org/)** – Relational database for structured data  
- **[Alembic](https://alembic.sqlalchemy.org/)** – Database migrations  
- **[Pydantic](https://pydantic-docs.helpmanual.io/)** – Data validation & serialization  

### **⚙️ Other Tools & Integrations**  
- **[GitHub Actions](https://github.com/features/actions)** (CI/CD automation)  
- **[Scikit-learn](https://scikit-learn.org/)** (for predictive pricing model)  

---

## 📂 Project Structure  

```bash
├── backend/   # FastAPI backend
│   ├── api/   # Endpoints
│   ├── models/   # Database models
│   ├── core/   # Configuration files
│   ├── alembic/   # Database migrations
│   ├── tests/   # Unit tests
│   ├── main.py   # Entry point
│   └── requirements.txt   # Dependencies
│
├── frontend/   # Next.js frontend
│   ├── src/
│   │   ├── app/   # Next.js pages
│   │   ├── components/   # UI components
│   │   ├── styles/   # Tailwind styles
│   ├── package.json   # Dependencies
│   ├── tailwind.config.ts   # Tailwind setup
│   └── tsconfig.json   # TypeScript config
│
├── README.md   # Project documentation
└── .github/   # CI/CD workflows
