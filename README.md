# Careworker Clock-In System

A web application for managing careworker clock-in/out operations with location-based restrictions and managerial oversight.


## Deployed Link - https://leif-chi.vercel.app/

## Remember - Manager can not be created mannualy

Manager login credentials -  

Username - Test@t.com
Password - Test@3636

## Features

### 1. Manager Role
- **Location Perimeter Management**
  - Set a geofenced perimeter (e.g., 2km radius) around a specified location
  - Defines the valid area for careworkers to clock in
- **Staff Monitoring**
  - View table of currently clocked-in staff
  - Detailed staff tables showing:
    - Clock-in time and location
    - Clock-out time and location
- **Dashboard Analytics**
  - Average daily clocked-in hours
  - Daily clock-in count
  - Weekly total hours per staff with name (last 7 days)


### 2. Careworker Role
- **Clock In**
  - Location-based clock-in within manager-set perimeter
  - Optional note field
  - Validation prevents clock-in outside perimeter
- **Clock Out**
  - Available when clocked in
  - Optional note field

### 3. User Authentication
- **Registration**
  - Username/password signup
  - Google login option
  - Email login option
- **Auth0 Integration**
  - Secure authentication
  - Role-based access (manager/careworker)
- **Features**
  - Login/logout functionality


### 4. Progressive Web App
- **Registration**
  - Username/password signup
  - Google login option
  - Email login option
- **Auth0 Integration**
  - Secure authentication
  - Role-based access (manager/careworker)
- **Features**
  - Login/logout functionality
 

## Tech Stack
- Frontend: React.js with React Router
- Backend: Node.js with Express.js
- Authentication: Auth0
- Database: MongoDB 
- Location Services: Geolocation API

