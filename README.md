
# Zenith Hotel Management Dashboard

**Zenith Hotel Management** is a comprehensive, modern, and fully responsive Hotel Management Dashboard. Built with React, TypeScript, and a custom Tailwind CSS design system, it provides a full suite of features designed to streamline hotel operations for various staff roles.

The application is architected as a self-contained single-page application that runs entirely in the browser using a zero-build setup, demonstrating a modern frontend approach with a focus on clean code, type safety, and a polished user experience.

---

## 1. Core Features

- **Role-Based Access Control:** A secure login system that tailors the UI and functionality to the user's role (Admin, Manager, Front Desk, etc.).
- **Comprehensive Dashboards:** At-a-glance views of key hotel metrics like occupancy, arrivals, departures, and housekeeping status.
- **Full Reservation Management:** Complete CRUD (Create, Read, Update, Delete) functionality for guest reservations with detailed forms and modals.
- **Guest Profiles & History:** Centralized guest management with contact information and a complete reservation history.
- **Visual Room Management:** Manage room status and availability through both a detailed list and an interactive monthly calendar view.
- **Housekeeping Coordination:** Create, assign, track, and update housekeeping tasks, with automatic room status updates upon task completion.
- **Reporting & Analytics:** View and download key operational reports (Occupancy, Revenue) in CSV format.
- **User Administration:** A dedicated interface for Admins to manage staff accounts and roles.
- **Guest Feedback System:** A simple, elegant interface for guests to submit feedback and for management to review it.
- **Modern UI/UX:** A clean, professional design system with full light/dark mode support, subtle animations, and a focus on usability and accessibility.

---

## 2. User Roles & Permissions

The application is built around a robust role-based access control (RBAC) system to ensure staff members only see the information and tools relevant to their jobs.

### Role Descriptions:

*   **Admin (`admin`):** Has unrestricted access to all application features, including the ability to manage user accounts and delete critical data like reservations and guests. This role is for top-level system administrators.
*   **Manager (`manager`):** Has access to all operational features, including dashboards, reports, and feedback. They can manage reservations and guests but cannot manage user accounts.
*   **Front Desk (`frontdesk`):** Focused on guest-facing operations. This role can manage reservations and guest profiles, and view room availability. They cannot access reports or user management.
*   **Housekeeping (`housekeeping`):** Has a specialized view focused on managing cleaning tasks. They can view room statuses and update their assigned tasks.
*   **Guest (`guest`):** A limited-access role designed for hotel guests. Upon logging in, they are directed to a page to submit feedback about their stay.

### Feature Access Matrix:

| Feature / Page      | Admin | Manager | Front Desk | Housekeeping | Guest |
| ------------------- | :---: | :-----: | :--------: | :----------: | :---: |
| **Dashboard**       | ✔️    |   ✔️   |     ✔️    |      -       |   -   |
| **Reservations**    | ✔️    |   ✔️   |     ✔️    |      -       |   -   |
| **Guests**          | ✔️    |   ✔️   |     ✔️    |      -       |   -   |
| **Rooms**           | ✔️    |   ✔️   |     ✔️    |      ✔️     |   -   |
| **Housekeeping**    | ✔️    |   ✔️   |      -     |      ✔️     |   -   |
| **Reports**         | ✔️    |   ✔️   |      -     |      -       |   -   |
| **Feedback**        | ✔️    |   ✔️   |      -     |      -       |   -   |
| **Users**           | ✔️    |    -    |      -     |      -       |   -   |
| **Submit Feedback** |   -   |    -    |      -     |      -       | ✔️    |

---

## 3. Technology & Architecture

### 3.1. Technology Stack

*   **Frontend Library:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (with an inline, custom design system)
*   **Icons:** Custom, tree-shakeable SVG components
*   **Setup:** Zero-build environment using `importmap` to load dependencies from a CDN.

### 3.2. Architecture

*   **Centralized State Management:** The root `App.tsx` component serves as the single source of truth, managing all core application state (`reservations`, `guests`, `rooms`, `currentUser`, etc.) using React's `useState` hook.
*   **Unidirectional Data Flow:** State and state-mutating functions are passed down to child components via props. This "prop drilling" approach is suitable for this project's scale and ensures a predictable data flow.
*   **Component-Based Structure:** The UI is broken down into logical, reusable components organized by feature (`pages/`) and type (`components/common`, `components/layout`, etc.).
*   **Internal Routing:** Page navigation is handled by a state variable (`currentPage`) in `App.tsx`, which conditionally renders the appropriate page component. This lightweight approach avoids the need for an external routing library.

### 3.3. Data Models (`types.ts`)

A central `types.ts` file provides strict TypeScript definitions for all data structures, ensuring type safety and consistency across the application. Key models include:
*   `User`: Defines the structure for a user account, including their role.
*   `Guest`: Contains guest contact and personal information.
*   `Room` & `RoomType`: Defines the properties of a physical room and its category (e.g., Single, Suite).
*   `Reservation`: The core entity linking a `Guest` to a `Room` for a specific date range.
*   `HousekeepingTask`: Represents a task assigned to a staff member for a specific room.
*   **Enums:** TypeScript enums (e.g., `RoomStatus`, `ReservationStatus`, `Role`) are used extensively to prevent errors from typos and ensure that status fields and roles are always valid.

---

## 4. In-Depth Functionality

### `DashboardPage`
- **Purpose:** Provide a high-level, real-time snapshot of hotel operations.
- **Functionality:** Displays key metrics in distinct `Card` components:
    - **Occupancy:** A percentage gauge showing the ratio of occupied to total rooms.
    - **Today's Movements:** Counts of scheduled arrivals and departures for the current day.
    - **Guest Information:** A live count of all guests currently checked into the hotel.
    - **Housekeeping:** A summary of rooms marked as "Dirty" and the number of pending housekeeping tasks.

### `ReservationsPage`
- **Purpose:** The main hub for managing all guest bookings.
- **Functionality:**
    - A searchable and sortable `Table` lists all reservations.
    - **Create/Edit:** A `ReservationModal` allows for creating new reservations or editing existing ones, including guest selection, room assignment, dates, and pricing.
    - **Checkout:** For "Checked-In" reservations, a one-click checkout action opens a `PaymentModal` to process the final payment and automatically updates the room status to "Dirty".
    - **Delete:** Admins have the ability to permanently delete a reservation via a confirmation modal.

### `GuestsPage`
- **Purpose:** Manage a central database of all hotel guests.
- **Functionality:**
    - A searchable `Table` lists all guests.
    - **Create/Edit:** A `Modal` with a `GuestForm` allows for adding new guests or updating their contact information.
    - **View Profile:** Clicking a guest's name navigates to a dedicated `GuestProfilePage`, showing their details and a complete history of their past and upcoming reservations.

### `RoomsPage`
- **Purpose:** Visualize and manage the status and availability of all hotel rooms.
- **Functionality:**
    - **Dual Views:** Users can toggle between:
        1.  **List View:** A `Table` showing all rooms, their type, and current status, with an option to view details.
        2.  **Calendar View:** An interactive monthly calendar grid where each row is a room and each column is a day. Cells are color-coded to show availability, confirmed bookings, and checked-in status. New reservations can be created by clicking an available cell.
    - **Room Details:** A `RoomDetailsModal` provides comprehensive information about a specific room, including its amenities, current status, and a list of upcoming reservations.
    - **Status Updates:** Staff can manually change a room's status (e.g., to "Available" or "Out of Service") directly from the details modal.

---

## 5. Design System & UI/UX

### 5.1. Color Palette

The color system is defined in `index.html` and used throughout the app via Tailwind CSS utility classes.

| Palette   | Name        | Usage                                                              |
| :-------- | :---------- | :----------------------------------------------------------------- |
| `primary`   | Slate Blue  | Primary actions, sidebar, interactive element focus rings.         |
| `neutral`   | Cool Gray   | Backgrounds, body text, borders, secondary elements.             |
| `accent`    | Muted Gold  | Highlights, "Checked-In" status, star ratings.                     |
| `success`   | Green       | Positive states ("Available", "Done"), success notifications.      |
| `danger`    | Red         | Negative states ("Dirty", "Cancelled"), destructive actions.       |
| `info`      | Blue        | Informational states ("Confirmed", "In Progress").                 |

### 5.2. Visual Style & Components

- **Layout:** The primary layout consists of a fixed `Sidebar` for navigation and a main content area with a sticky `Header`. The entire interface is fully responsive.
- **Neomorphic Depth:** A unique `box-shadow` style (`solid-light`/`solid-dark`) is applied to `Card` components, creating a subtle, tactile depth that makes UI elements feel distinct from the background.
- **Typography:** A standard system sans-serif font is used for readability. A clear typographic hierarchy distinguishes between titles, labels, and content.
- **Animations:** Subtle `fade-in` and `zoom-in` animations on modals and `fade-in-right` on toasts provide a smooth user experience without being distracting.
- **Iconography:** A custom set of SVG icons is used for clarity and visual appeal. Icons are implemented as React components for optimal performance.
- **Dark Mode:** The application has full, first-class support for light, dark, and system-preference themes, switchable via the `Header`.

### 5.3. Core Reusable Components

The `components/common/` directory contains the building blocks of the UI:

- **`Card.tsx`:** The primary container for displaying grouped content.
- **`Table.tsx`:** A generic, sortable table component used across multiple pages.
- **`Modal.tsx`:** A reusable and accessible modal for forms and confirmation dialogs.
- **`Button.tsx`:** A versatile button component with variants for `primary`, `secondary`, and `danger` actions.
- **`Input.tsx` & `Select.tsx`:** Standardized form controls with consistent styling.
- **`StatusBadge.tsx`:** A set of color-coded badges to provide at-a-glance status information.
- **`ToastContainer.tsx` & `Toast.tsx`:** A non-intrusive notification system for providing user feedback.

---

## 6. Getting Started

### 6.1. Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari, Edge).
- A simple local web server. The [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for VS Code is a great option.

### 6.2. Installation & Launch

1.  Ensure all project files are located in the same directory.
2.  Start a local web server from the root of the project directory.
3.  Open the provided URL (e.g., `http://127.0.0.1:5500`) in your browser.

### 6.3. Demo Logins

Use any of the following usernames to log in. **Any password will be accepted.**

- **Admin:** `admin`
- **Manager:** `manager`
- **Front Desk:** `frontdesk`
- **Housekeeping:** `housekeeping`
- **Guest:** `guest`

---

## 7. Deployment to GitHub Pages

This project is configured for a simple, one-command deployment to GitHub Pages. Because this is a zero-build application, the deployment process directly publishes your source files without a build step.

### 7.1. Prerequisites

- Your project must be a GitHub repository.
- You must have [Node.js and npm](https://nodejs.org/en/download/) installed locally.

### 7.2. Configuration

1.  **Update `package.json`:** Before deploying, open the `package.json` file and set the `homepage` field to your GitHub Pages URL. It should follow this format:
    ```json
    "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
    ```
    Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` accordingly.

### 7.3. Deployment Steps

1.  **Install Dependency:** Open your terminal in the project's root directory and run this command once to install the deployment tool:
    ```bash
    npm install
    ```
2.  **Deploy:** After the installation is complete, run the deploy script:
    ```bash
    npm run deploy
    ```

This command will publish the contents of your project directory to a `gh-pages` branch on your GitHub repository. Your application will then be live at the URL you specified in the `homepage` field.

---

## 8. Future Improvements

- **Advanced State Management:** For larger applications, replace prop drilling with a dedicated state management library like Zustand or Redux Toolkit.
- **Backend Integration:** Replace the mock data in `/data/index.ts` with asynchronous API calls to a real backend service.
- **Testing:** Implement a testing suite using Jest and React Testing Library for components and business logic.
- **Advanced Reporting:** Integrate a charting library (e.g., Chart.js, Recharts) for better data visualization on the `ReportsPage`.
- **Performance Optimization:** For larger datasets, introduce techniques like virtualization (windowing) for long tables and lazy loading for page components.