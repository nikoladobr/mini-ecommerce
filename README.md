# Mini E-commerce Full-Stack Application

This project is a mini e-commerce platform. It consists of a React frontend and a .NET 8 backend using RESTful architecture and modern development practices.

---

## 🚀 Tech Stack

### Frontend
- **React 18+** with functional components and hooks
- **React Router** for navigation
- **React Query** for server-side state
- **Context API** for client-side state (cart)
- **CSS Modules** for styling

### Backend
- **ASP.NET Core 8 Web API**
- **Entity Framework Core** with SQLite
- **AutoMapper** for DTO mapping
- **CORS** for frontend integration
- **RESTful API** with standard HTTP status codes

---

## 🧩 Features

### ✅ Product Listing Page (PLP)
- Grid and list views with toggle
- Product cards with image, name, price, short description, quantity selector, and Add to Cart
- Responsive mobile-first design
- Loading and empty states

### ✅ Product Detail Page (PDP)
- Image gallery
- Full description and technical specifications table
- Breadcrumb navigation
- Handles invalid product IDs with 404 fallback

### ✅ Search & Filtering
- Debounced (300ms) live search by product name
- Clear search functionality
- Displays result count

### ✅ Sorting & Pagination
- Sort by Price (Low→High, High→Low) and Name (A→Z, Z→A)
- Pagination with: Previous/Next, first/last, and configurable items per page
- Maintains sorting/search state during pagination

### ✅ Shopping Cart
- Add products to cart with selected quantity
- Update/remove items in cart
- Cart icon with item count in header
- Cart state persists between navigations (via Context API)

---

## 🛠️ Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js & npm

---

### Backend Setup

```bash
cd MiniECommerceSolution/MiniECommerce.Api
dotnet restore
dotnet run
```

The API will be available at `https://localhost:7047`.

---

### Frontend Setup

```bash
cd mini-ecommerce-frontend
npm install
npm start
```

The React app will run at `http://localhost:3000`.

---

## 📁 Project Structure

```
MiniECommerceSolution/
  └── MiniECommerce.Api/       # ASP.NET Web API
mini-ecommerce-frontend/
  └── src/                     # React frontend
```

---

## 🧠 Architecture Decisions

- Used React Query for efficient API caching and loading state management
- Used Context API instead of Redux for simplicity (single client-side state: cart)
- SQLite chosen for simplicity and ease of setup
- File-based image storage via `wwwroot/images/product_{id}` for simplicity
- Used AutoMapper to cleanly separate DTOs from EF models

---

## 💬 Self-Assessment

### ✅ Challenges

- Getting everything from backend to show correctly on the frontend  
- Setting up the database, writing the API with filtering, sorting, pagination, and then consuming it properly in React using React Query took a lot of debugging and trial and error.
- Dynamically loading images for each product from folders on the backend and making sure the right image shows on the frontend.
- Making the frontend design look clean and user-friendly
- Ensuring that the cart behaves correctly (add, remove, change quantity)
- Managing all the UI states — loading, empty results, error cases

### 🔧 What I’d Improve with More Time

- I'd polish the UI even further and invest time in animations and accessibility (keyboard navigation, screen readers).
- I’d write automated tests (unit and integration) for both backend endpoints and frontend components.

---

## 📬 Submission

This project is part of the Bosch FullStack Internship e-Commerce Task.  
For any questions, feel free to contact me.
