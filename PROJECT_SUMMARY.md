# AgroPulse Ghana Hackathon — Project Summary

## What this project is
AgroPulse is a full-stack web application (Laravel backend + React frontend) designed to connect farmers and buyers in Ghana around **agricultural supply visibility, dynamic pricing, equipment rental/marketplace, and secure order placement**.

It focuses on:
- Recording farmers’ harvest volumes (by district, crop, and timeline)
- Computing market signals (supply level → pricing guidance)
- Helping buyers browse district/crop market trends
- Enabling equipment listings for rent
- Creating buyer orders through a “secure” endpoint (demo escrow-like behavior)

## Tech stack
- **Backend:** Laravel (PHP) using REST API routes
- **Database:** SQLite (via migrations)
- **Frontend:** React (Vite)
- **Frontend ↔ Backend communication:** REST calls from a shared React context

## Backend architecture (Laravel)
### Core domain models
The backend uses Eloquent models for the main entities:
- **User**: farmers and buyers; stores identity and verification status (`is_verified`), MOFA ID, and district.
- **HarvestLog**: harvest submissions (crop type, volume in bags, timeline bucket, and district), tied to a user.
- **District**: districts with an associated region.
- **EquipmentListing**: tools offered for rental by users (daily rate and availability).
- **Order**: buyer order entity; links buyer and harvest information.

### Dynamic pricing logic
A dedicated service, **`DynamicPricingEngine`**, drives the market-trend behavior.
- It holds **baseline prices per crop** (hardcoded for hackathon simplicity).
- It adjusts pricing guidance based on **district-level total supply**.
- It returns a pricing band and a market “badge/label” describing demand vs glut.

Supply level logic (as implemented in the service):
- **LOW supply (< 100)** → demand signals, higher guidance price, badge: “High Demand”
- **HIGH supply (> 300)** → glut signals, lower guidance price, badge: “Gluts forming — Buy Now”
- Otherwise → medium/steady market

### REST API endpoints
Routing is defined in `backend/routes/api.php` and includes:
- Farmer actions
  - `POST /api/register-farmer`
  - `GET /api/harvests`
  - `POST /api/harvests`
- Market & district browsing
  - `GET /api/districts`
  - `GET /api/market-trends?region=&crop=`
  - `GET /api/districts/{district}/farmers?crop=`
- Orders
  - `POST /api/orders/secure`
- Equipment marketplace
  - `GET /api/equipment`
  - `POST /api/equipment`

### Seed/demo data
`AgroPulseDemoSeeder` seeds:
- A small set of **districts** (e.g., Techiman, Ejura, Gomoa)
- Approximately **~20 demo farmers**, each with harvest logs at small volumes to start the market in a “high demand” style regime.
- A **demo buyer user** used by the secure-order flow.
- Sample **equipment listings** owned by some seeded farmers.

Notably, the seeding volumes are chosen so that adding a large harvest later (e.g., ~500 bags) should flip the computed supply level and therefore the market pricing guidance on refresh.

## Frontend architecture (React)
### State management via context
The React app centralizes data access in **`AgroPulseContext.jsx`**.

Key responsibilities:
- Load equipment listings from the backend on start
- Fetch market trends for a `(region, crop)` selection
- Fetch farmers for a `(district, crop)` selection
- Submit harvests via the two-step backend process:
  1) register/find farmer by phone
  2) create harvest log
- Add equipment by posting new listings

### Fallback behavior
If backend calls fail, the context falls back to local static “seed” data to keep the UI functional.

### Data shaping for UI components
The context transforms backend payloads into the UI’s expected structure:
- Market trends are grouped per district and converted into cards containing crop supply level, price band, and a badge styling.
- Farmers endpoints return structured arrays suitable for the farmers list modal.

## How the product works end-to-end (user flows)
### 1) Buyer browsing market trends
1. Buyer selects a **region** and **crop**
2. Frontend calls `GET /api/market-trends?region=&crop=`
3. Backend aggregates harvest supply by district and returns pricing guidance + “badge”
4. Frontend renders district cards with:
   - supply total
   - level (LOW/MEDIUM/HIGH)
   - price guidance band
   - badge text (e.g., “High Demand” vs “Gluts forming”)

### 2) Farmer submitting harvest
1. Harvest wizard collects farmer identity + crop + volume + timeline
2. Frontend calls `POST /api/register-farmer`
3. Frontend calls `POST /api/harvests` to store the harvest log
4. After submission, market trends should reflect the increased district supply.

### 3) Equipment marketplace
- Equipment listings are fetched with `GET /api/equipment`
- New listings are created with `POST /api/equipment`

### 4) Secure order placement (demo)
- Buyer uses `POST /api/orders/secure`
- The backend creates an Order record and likely ties it to relevant harvest/order context (implementation in `BuyerController` and the order/harvest relationships).

## Current development status
From the repository TODO:
- Backend wiring, models, migrations, seeders, and pricing engine are implemented.
- Frontend is partially integrated:
  - Equipment and market-trend fetching are wired with fallback
  - Remaining work includes ensuring all UI strings and lists fully come from backend endpoints and verifying harvest + secure order flows end-to-end.

## Repository entry points
- Backend API routes: `backend/routes/api.php`
- Pricing service: `backend/app/Services/DynamicPricingEngine.php`
- Demo seeding: `backend/database/seeders/AgroPulseDemoSeeder.php`
- Frontend context: `frontend/src/context/AgroPulseContext.jsx`

## Summary in one sentence
AgroPulse is a district-and-crop supply transparency app that uses recorded harvest volumes to compute dynamic pricing guidance, lets buyers explore market trends and farmers by district, supports an equipment rental marketplace, and enables secure order placement through a Laravel REST API backed by seeded demo data.

