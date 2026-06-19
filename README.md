# Aster Cafe — QR-Based Ordering System

A real-world digital ordering system built for a local cafe, allowing 
customers to scan a table-specific QR code, browse the menu, and place 
orders directly — with a live admin dashboard to manage incoming orders.

## Overview

Built as a freelance/demo project for a local cafe to digitize their 
ordering process. Each table has a unique QR code; scanning it opens 
a customer-facing ordering page tied to that specific table, removing 
the need for physical menus or waitstaff taking orders manually.

## Features

### Customer Side
- Scan table-specific QR code to open the ordering page
- Browse menu by category
- Add items to cart and place orders
- Orders are linked to the originating table number

### Admin/Cafe Management Side
- Real-time view of incoming orders
- Update order status (e.g. received → preparing → served)
- [Add: any order history or analytics view?]

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **State Management:** [Zustand/Context — confirm which you used in `src/store`]
- **Backend:** Firebase
  - Firestore (real-time order & menu database)
  - Firebase Auth (admin login)

## Project Structure

```text
astercafe/
│
├── src/
│   │
│   ├── assets/
│   │   └── logo.png
│   │
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── Loader.jsx
│   │   ├── MenuCard.jsx
│   │   ├── StaffCallModal.jsx
│   │   │
│   │   └── admin/
│   │       └── AdminLayout.jsx
│   │
│   ├── data/
│   │   └── menuData.js
│   │
│   ├── pages/
│   │   │
│   │   ├── admin/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Billing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── Tables.jsx
│   │   │
│   │   └── customer/
│   │       ├── Bill.jsx
│   │       ├── Cart.jsx
│   │       ├── Home.jsx
│   │       ├── Menu.jsx
│   │       └── Success.jsx
│   │
│   ├── store/
│   │   └── CafeStore.jsx
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
│
├── public/
│
├── package.json
├── vite.config.js
└── README.md
```
## How It Works

1. Each table has a unique QR code linking to `/order?table={tableId}`
2. Customer scans → lands on that table's ordering page
3. Customer browses the menu and adds items to their cart
4. Order is submitted to Firestore, tagged with the table number
5. Cafe staff view incoming orders in real time on the admin dashboard
6. Staff update order status as it's prepared and served

## Run Locally

```bash
git clone https://github.com/hansikamasna/aster-cafe-demo.git
cd astercafe
npm install
npm run dev
```

## Why I Built This

I wanted to build something with real business value, not just another portfolio project. After noticing how much manual work goes into order-taking at small cafes, I built this end-to-end system — from table QR codes to a live admin dashboard — and used it as a demo to pitch to local cafe owners.

## Future Enhancements

- Online payment integration
- Order history for customers
- Menu item availability toggling
- Analytics dashboard for popular items / peak hours
  

# Aster Cafe — QR-Based Ordering System

 **Live Demo:** [https://aster-cafe-demo.vercel.app/]
 **admin page:**[https://aster-cafe-demo.vercel.app/admin/orders]

 ## Deployment
- Frontend: Vercel
- Backend: Firebase (Firestore + Auth)

A real-world digital ordering system...

## Author

**Hansika Masna**
B.Tech Information Technology
Chaitanya Bharathi Institute of Technology (CBIT)
