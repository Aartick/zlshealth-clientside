# Zealous Health

A [Next.js](https://nextjs.org) web application that allows clients to place orders and process them efficiently.

## 📖 Overview

This project is a full-stack web application built with Next.js(frontend + backend) and MongoDB as the database.
It allows users to browse, order medicines, and manage their orders securely with authentication.

## 🛠 Tech Stack

- **Framework:** Next.js 15
- **Frontend:** React 19, Tailwind CSS, Framer Motion
- **Backend:** Express.js, Mongoose
- **Database:** MongoDB Atlas
- **Auth:** NextAuth.js, JWT
- **Storage:** Cloudinary

## 📂 Project Structure

/project-root
├── /app # Next.js app router pages and api's
├── /components # Reusable React components
├── /models # Mongoose models
├── /utils # Utility functions
├── package.json # Project metadata + dependencies
└── README.md # Documentation

## 🚀 Getting Started

Follow the steps below to run this project on your local system:

# 1. Clone the repository

git clone https://github.com/Aartick/zlshealth-clientside.git
cd zlshealth-clientside

# 2. Install dependencies

Make sure you have Node.js (v18 or later) and npm (or yarn/pnpm/bun) installed. Then run:

npm install

# or

yarn install

# or

pnpm install

# or

bun install

# 3. Set up environment variables

Create a .env.local or .env file in the root directory and add:

MONGOURI=your_mongodb_connection_string

ACCESS_TOKEN_PRIVATE_KEY=your_secret_key
REFRESH_TOKEN_PRIVATE_KEY=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_SECRET=your_google_auth_secret

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password

# 4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

👉 The app will be running at: http://localhost:3000

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧪 Scripts

# package.json

"scripts": {
"dev": "next dev --turbopack",
"build": "next build",
"start": "next start",
"lint": "next lint"
}

## 📝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch (git checkout -b feature/awesome-feature)
3. Commit changes with meaningful messages
4. Push to your branch
5. Open a Pull Request

## 👨‍💻 Contributors

- **Team Aartick**

## 📜 License

This project is licensed under the MIT License.
