# WattControl — Virtual Energy Metering & Automatic Billing System

🌐 **Language / Bahasa:** [🇮🇩 Bahasa Indonesia](README.md) | **🇬🇧 English**

---

## Development Team
This project is developed by students of the **Faculty of Intelligent Technology, Universitas Dian Nuswantoro (UDINUS)** — Semarang, Indonesia (2026):

| Team Member | Student ID (NIM) | Role & Responsibilities |
| :--- | :--- | :--- |
| **Noval Fitriadi** | A11.2024.15659 | Project Manager & UI/UX Designer |
| **Baraza Nandian Syah** | A11.2024.15640 | System Analyst & Frontend Developer |
| **Yonazahran Yoga Meinendra Rizky** | A11.2024.15673 | Backend Developer & DevSecOps |

---

## Background & Solution
In boarding houses (*kos*) operating on an all-inclusive rent model with limited electrical capacity (2,200 VA), unreported high-wattage appliances (such as electric pots, rice cookers, electric kettles, and irons) often cause sudden PLN bill surges and main circuit breaker (MCB) trips.

**WattControl** solves this issue using a **software-only Virtual Energy Metering** approach—eliminating the high cost of physical IoT smart meters—through:
* **Fair Room Quota:** Standardized monthly electricity allowance of **100 kWh per room**.
* **Monthly Batch Meter Input:** Collective recording of physical kWh meter readings at the end of each month by the boarding house administrator.
* **Automated Calculation Engine:** Instant computation of usage, excess kWh, and penalty fees.
* **WhatsApp Billing Generator:** One-click formatted invoice generation ready to be copied and sent directly to tenants via WhatsApp.

---

## Key Features
1. **Room Master Data Management:** Manage room occupancy status (`Occupied` / `Vacant`), tenant profiles, and WhatsApp numbers.
2. **Batch Meter Input Page:** Streamlined form to record end-of-month physical kWh meter readings for all rooms in a single view.
3. **Calculation Engine & Visual Indicators:**
   * **Usage:** `New Meter Reading - Previous Meter Reading`
   * **Excess Quota:** `Usage - 100 kWh`
   * **Penalty Fee:** `Excess kWh × PLN Tariff (IDR 1,444.70 / kWh)`
   * **Dashboard Status Indicators:**
     * 🟢 **SAFE (AMAN):** Usage `≤ 80 kWh` (≤ 80% quota)
     * 🟡 **WARNING (SIAGA):** Usage `> 80 kWh` up to `100 kWh`
     * 🔴 **OVER LIMIT:** Usage `> 100 kWh`
4. **WhatsApp Invoice Generator:** **"Salin Nota WA"** button to automatically copy formatted billing details to the clipboard.
5. **Billing History & Payment Tracking:** Track monthly billing records and update payment statuses (`Unpaid` / `Paid`).

---

## Tech Stack & Infrastructure
* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js (REST API)
* **Database:** MySQL / MariaDB
* **Deployment & Hosting:** Vercel / Render
* **Design & Prototyping:** Figma

---

## Security Architecture & DevSecOps
As part of our **Secure Software Development Life Cycle (SSDLC)** practices, this repository enforces the following security controls:
* **Automated CI/CD Security Scanning:** Every Pull Request is automatically scanned using **Gitleaks** (Secret Detection), **Trivy** (Dependency & Vulnerability Scan), and **Semgrep** (Static Application Security Testing).
* **Branch Protection:** The `main` branch is protected against direct pushes and requires passing security checks before merging.
* **Environment Isolation:** Database credentials and sensitive configurations are strictly isolated via environment variables (`.env`) and excluded from version control.

---

## Running Locally (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com
cd wattcontrol-webapp
```

### 2. Configure Environment Variables
Copy the example environment file and adjust it to match your local database credentials:
```bash
cp .env.example .env
```

### 3. Install Dependencies & Start the Application
*(Adjust the commands below according to the `frontend` and `backend` directory structure in this repository)*
```bash
# Navigate to the backend / frontend directory and install packages
npm install

# Start the development server
npm run dev
```

---

## License
This project is developed for academic purposes under the Information Technology Project Management course - Universitas Dian Nuswantoro.
