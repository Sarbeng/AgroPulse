# TODO - AgroPulse Ghana Hackathon Backend + Frontend Wiring

## Backend (Laravel 11 + SQLite)
- [x] Create migrations for `harvest_logs`, `equipment_listings`, `orders`
- [x] Create migrations for `districts`


- [x] Update/replace `users` migration + `User` model to match required schema (phone_number, role, mofa_id, district, etc.)



- [x] Create models + relationships: User↔HarvestLog, User↔EquipmentListing, Buyer↔Order, Order↔HarvestLog

- [x] Implement `DynamicPricingEngine` service (baseline prices, supply aggregation, pricing modifiers)

- [x] Create controllers for REST endpoints:


  - [x] POST `/api/register-farmer`

  - [x] POST `/api/harvests`

  - [x] GET `/api/market-trends?region=&crop=`

  - [x] GET `/api/districts/{district}/farmers?crop=`

  - [x] POST `/api/orders/secure`

  - [x] GET `/api/equipment`

  - [x] POST `/api/equipment`

- [x] Add `backend/routes/api.php` and register endpoints

- [x] Implement `DatabaseSeeder`:


  - [x] Seed districts: Techiman, Ejura, Gomoa

  - [x] Seed ~20 farmers + initial harvest logs with LOW supply

  - [x] Ensure a new large harvest (e.g. 500 bags) flips index status on refresh


## Frontend (React)
- [x] Update `AgroPulseContext.jsx` to fetch from backend instead of local mock districtCards/farmers/equipment


- [ ] Ensure pricing/status strings come from backend `market-trends`
- [ ] Ensure farmers list comes from backend `districts/{district}/farmers`
- [ ] Ensure harvest submission and secure order call backend endpoints
- [ ] Ensure equipment listing uses backend endpoints

## Verification
- [ ] Run `php artisan migrate --force`
- [ ] Run `php artisan db:seed --force`
- [ ] Start backend + frontend and verify:
  - [ ] Market trends flip after adding high-volume harvest
  - [ ] Farmers list loads per district+crop
  - [ ] Equipment marketplace works
  - [ ] Secure order endpoint returns successful mock escrow response

