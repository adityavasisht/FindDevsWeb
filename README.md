# 🚀 FindDevs: Developer Matchmaking Platform

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AWS](https://img.shields.io/badge/Deployment-AWS%20EC2-orange)
![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-black)

**FindDevs** (often referred to as "Tinder for Devs") is a social platform designed to connect developers based on tech stacks and interests. It features real-time communication, connection management, and a high-performance backend architecture.

---

## ⚡ Key Features & Metrics

* [cite_start]**Real-Time Messaging:** Bi-directional chat infrastructure using **Socket.io/WebSockets** with latency **<50ms**[cite: 22].
* [cite_start]**Scalable Backend:** RESTful API handles complex schema validation and indexing, ensuring response times **<200ms**[cite: 21].
* [cite_start]**Production Grade:** Deployed on **AWS EC2** with **Nginx** (Reverse Proxy) and **PM2** (Process Clustering) for 99.9% uptime[cite: 23].
* [cite_start]**Monetization:** Integrated **Razorpay** for secure subscription payments[cite: 24].
* [cite_start]**Automated Systems:** **Cron Jobs** paired with **Amazon SES** for scheduled maintenance and transactional emails[cite: 24].
* [cite_start]**Optimized Frontend:** Mobile-first **React.js** UI with efficient state management, reducing First Contentful Paint (FCP) by **40%**[cite: 25].

---

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Redux Toolkit (State Management) |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB (with Mongoose for Schema Validation) |
| **DevOps** | AWS EC2, Nginx, PM2, Docker |
| **Services** | Razorpay (Payments), Amazon SES (Email), Cloudinary (Media) |

---

## 🏗️ System Architecture

1.  **Load Balancing:** Nginx serves as a reverse proxy to distribute traffic and handle SSL termination.
2.  **Concurrency:** PM2 clusters Node.js processes to utilize all CPU cores on the EC2 instance.
3.  **Data Integrity:** Complex Mongoose schemas enforce validation before data hits the MongoDB database.
4.  **Security:** Implemented **JWT** for stateless authentication and **Helmet** for header security.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas URL)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/adityavasisht/FindDevs.git](https://github.com/adityavasisht/FindDevs.git)
    cd FindDevs
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    RAZORPAY_KEY_ID=your_key
    AWS_SES_KEY=your_aws_key
    ```

4.  **Run the Server**
    ```bash
    # Development Mode
    npm run dev
    
    # Production Mode
    npm start
    ```

---

## 📬 Contact
**Aditya Vasisht** Full Stack Developer | Bangalore  
[LinkedIn](https://www.linkedin.com/in/aditya-vasisht-480b79252/) | [Email](mailto:vasishtaditya8@gmail.com)
