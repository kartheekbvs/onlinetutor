# TutorLink - Online Tutor Booking & Session Management Platform

A high-level, real-time platform built with a Java Spring Boot backend and a React frontend, featuring a premium minimalist "White & Black" design.

## Features
- **Tutor Discovery**: Browse expert tutors by subject and rate.
- **Instant Booking**: Seamless booking workflow with real-time feedback.
- **Session Management**: Student dashboard to track upcoming and past sessions.
- **Real-time Notifications**: Real-time dashboard updates for booking confirmations.
- **Premium Aesthetics**: High-fidelity, minimalist UI using Vanilla CSS and Framer Motion.

## Tech Stack
- **Backend**: Java 17, Spring Boot, Spring Data JPA, Spring Security, WebSockets (STOMP).
- **Frontend**: React 18, Vite, Lucide Icons, Framer Motion.
- **Database**: H2 (In-memory for easy local execution).

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven
- Node.js & npm

### Running the Backend
1. Navigate to the `backend` directory.
2. Run `mvn spring-boot:run`.
3. The API will be available at `http://localhost:8080`.

### Running the Frontend
1. Navigate to the `frontend` directory.
2. Run `npm install` (to install dependencies: react, framer-motion, lucide-react).
3. Run `npm run dev`.
4. The application will be available at `http://localhost:5173`.

## Architecture Note
The project uses a standard RESTful API architecture combined with WebSockets for real-time features. Evaluation logic for bookings and session management is handled by the Spring Boot service layer.
