# 🏡 Real Estate Frontend Application

A simple and user-friendly real estate web application built using React/Next.js. This project focuses on clean UI, easy navigation, and essential functionality without unnecessary complexity.

---

## 🚀 Features

### 👤 User Side (Public Access)

* Browse properties by **Area → Category → Products**
* View property details:

  * Name
  * Description
  * Images (carousel support)
* **Floating WhatsApp button** for quick inquiries
* **Footer contact form** with WhatsApp integration
* About page with company details

---

### 🔐 Admin Side (Frontend Only - No Backend)

* Simple login (hardcoded authentication)
* Manage properties:

  * Add new property
  * Edit existing property
  * Delete property
* Edit **About Us** content dynamically

---

## 📂 Project Structure

```
src/
│── components/        # Reusable UI components
│── pages/             # Main pages (Products, About, Admin)
│── data/              # Static dummy data
│── App.tsx / main.tsx # Entry point
```

---

## 🧠 Core Flow

### Property Browsing Flow:

```
Area → Category → Products
```

### Example:

* Select: Hyderabad
* Then: Apartments
* Then: View available properties

---

## 💬 WhatsApp Integration

Users can submit inquiries via:

* Floating WhatsApp button
* Footer contact form

Message format:

```
Hi, I'm [Name]. My phone is [Phone]. I'm interested in [Message]
```

Redirects to:

```
https://wa.me/<number>?text=<encoded_message>
```

---

## 🗂️ Data Handling

* Uses **static dummy data**
* Admin updates stored in **localStorage**
* No backend or APIs used

---

## 🔑 Admin Credentials

```
Email: admin@gmail.com
Password: admin123
```

---

## 🛠️ Tech Stack

* React / Next.js
* Tailwind CSS
* JavaScript / TypeScript
* LocalStorage (for persistence)

---

## 📱 Responsive Design

* Fully responsive across:

  * Mobile
  * Tablet
  * Desktop

---

## ⚙️ Setup Instructions

1. Clone the repository:

```
git clone <your-repo-url>
```

2. Install dependencies:

```
npm install
```

3. Run the project:

```
npm run dev
```

4. Open in browser:

```
http://localhost:5173
```

(or Next.js default port)

---

## 📌 Notes

* This is a **frontend-only project**
* No backend or database is used
* Designed for quick deployment and demonstration purposes

---

## 📄 Pages Included

* Products Page (Main)
* About Page
* Admin Login
* Admin Product Management
* Admin Create/Edit Product
* Footer with Contact + Navigation
* Privacy Policy (Static)
* Terms & Conditions (Static)

---

## 🎯 Goal

To build a **simple, clean, and functional real estate UI** that is easy to use and quick to maintain.

---

## 📞 Contact

For inquiries, users can directly reach via WhatsApp integration in the application.
