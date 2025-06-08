# 💡 IdeaNick

**IdeaNick** is a web platform that allows users to publish their ideas, describe them in detail, attach related documents, images, certificates, and receive feedback in the form of likes.

A full-stack web application for managing ideas with modern frontend and backend technologies.  
This project demonstrates advanced architecture, best practices, and production-ready features.

---

## 🌐 Live Demo

👉 [ideanick.eu](https://ideanick.eu)

---

## ✨ Key Features

- 📥 Create and publish ideas with comprehensive descriptions
- 🔗 Unique nickname URL for each idea
- 🖼️ Upload images, certificates, and documents
- 🧑‍💼 Author profile pages
- 💙 Like functionality for ideas
- 🔍 Ideas listing page with search

---

## 🚀 Tech Stack

### Frontend

[![React](https://img.shields.io/badge/-React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Formik](https://img.shields.io/badge/-Formik-EF5B4D?style=flat&logo=formik&logoColor=white)](https://formik.org/)
[![Zod](https://img.shields.io/badge/-Zod-5A29E4?style=flat&logo=zod&logoColor=white)](https://github.com/colinhacks/zod)
[![SCSS](https://img.shields.io/badge/-SCSS-CC6699?style=flat&logo=sass&logoColor=white)](https://sass-lang.com/)
[![React Router](https://img.shields.io/badge/-React%20Router-CA4245?style=flat&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Prettier](https://img.shields.io/badge/-Prettier-F7B93E?style=flat&logo=prettier&logoColor=white)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)](https://eslint.org/)
[![Stylelint](https://img.shields.io/badge/-Stylelint-263238?style=flat&logo=stylelint&logoColor=white)](https://stylelint.io/)

### Backend

[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/-Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![tRPC](https://img.shields.io/badge/-tRPC-2596be?style=flat&logo=trpc&logoColor=white)](https://trpc.io/)
[![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![CRON](https://img.shields.io/badge/-CRON-323330?style=flat)](https://en.wikipedia.org/wiki/Cron)
[![Winston](https://img.shields.io/badge/-Winston-3E3E3E?style=flat)](https://github.com/winstonjs/winston)

### DevOps & Tools

[![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Heroku](https://img.shields.io/badge/-Heroku-430098?style=flat&logo=heroku&logoColor=white)](https://www.heroku.com/)
[![pnpm](https://img.shields.io/badge/-pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Husky](https://img.shields.io/badge/-Husky-000000?style=flat&logo=github&logoColor=white)](https://typicode.github.io/husky/)
[![Jest](https://img.shields.io/badge/-Jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)
[![Balsamiq](https://img.shields.io/badge/-Balsamiq-FF6600?style=flat)](https://balsamiq.com/)
[![MJML](https://img.shields.io/badge/-MJML-F06529?style=flat&logo=maildotru&logoColor=white)](https://mjml.io/)
[![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![AWS S3](https://img.shields.io/badge/-AWS%20S3-232F3E?style=flat&logo=amazonaws&logoColor=white)](https://aws.amazon.com/s3/)
[![Sentry](https://img.shields.io/badge/-Sentry-362D59?style=flat&logo=sentry&logoColor=white)](https://sentry.io/)
[![Mixpanel](https://img.shields.io/badge/-Mixpanel-121212?style=flat&logo=mixpanel&logoColor=white)](https://mixpanel.com/)
[![Cloudflare](https://img.shields.io/badge/-Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white)](https://www.cloudflare.com/)
[![DataDog](https://img.shields.io/badge/-Datadog-632CA6?style=flat&logo=datadog&logoColor=white)](https://www.datadoghq.com/)

---

## 🎯 Architecture & Features

The project is built with modern fullstack architecture using industry best practices and tools to ensure scalability, performance, and maintainability.

### 🧱 Frontend

- **React + TypeScript + Vite**  
  Performant frontend SPA with modern tooling, type safety, and modular structure.

- **React Router v7**  
  Client-side routing with support for nested routes and route guards.

- **Formik + Zod**  
  Powerful form management with schema-based validation and real-time user feedback.

- **SCSS + Include Media**  
  Responsive design with modern CSS preprocessors.

- **React Query + tRPC**  
  Efficient server state management with automatic caching.

### 🔌 Backend & API

- **tRPC + Express + Node.js**  
  Type-safe API communication between frontend and backend with no REST overhead.

- **Prisma ORM + PostgreSQL**  
  Relational database with fully typed schema access, migrations, and optimized queries.

- **Authentication System**  
  Secure login with hashed (salted) passwords, JWT tokens, and session handling.

- **Passport.js**  
  Authentication strategies with local and JWT strategies.

### 🗂️ File & Image Management

- **Cloudinary** – Image storage, transformation, and optimization.
- **AWS S3** – Document and certificate file storage.
- **Custom Upload Components** – Seamless file handling via React and Formik.

### 📧 Email Integration

- **MJML Email Templates**  
  Transactional emails using MJML templates and Handlebars.

- **Email Service**  
  Integration with email service providers for notifications.

### 📈 Monitoring & Analytics

- **Winston Logger**  
  Centralized logging with multiple transports (console, file, etc.).

- **Sentry**  
  Error tracking and performance monitoring in production environments.

- **Mixpanel**  
  Product analytics for tracking user behavior and custom events.

### ⚙️ DevOps & Developer Experience

- **Docker Containerization**  
  Containerized app for consistent builds across all environments.

- **Monorepo with pnpm Workspaces**  
  Efficient dependency management in monorepo structure.

- **Code Quality Tools**

  - **Prettier** – Unified code formatting
  - **ESLint** – JavaScript/TypeScript linting
  - **Stylelint** – CSS/SCSS linting

- **Husky + Lint-staged**  
  Git hooks to enforce clean commit messages and consistent code style.

- **Testing**
  - **Jest** – Unit testing
  - **Testing Library** – Component testing

---

## 📁 Project Structure

```
ideanick/
├── webapp/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilities
│   │   ├── styles/         # SCSS styles
│   │   └── types/          # TypeScript types
│   └── package.json
├── backend/                # Node.js Backend
│   ├── src/
│   │   ├── router/         # tRPC routers
│   │   ├── prisma/         # Database schema
│   │   ├── emails/         # MJML templates
│   │   ├── utils/          # Utilities
│   │   └── lib/            # Libraries
│   └── package.json
├── shared/                 # Shared code
└── package.json            # Root package.json
```

---

## 📦 Quick Start

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- pnpm
- PostgreSQL database
- Cloudinary account (for images)
- AWS S3 bucket (for files)

### Installation

```bash
# Clone the repository
git clone https://github.com/gkirber/ideanick.git
cd ideanick

# Install dependencies
pnpm install

# Setup environment variables
cp backend/env.example backend/.env
cp webapp/env.example webapp/.env

# Setup database
pnpm b pmd  # Run Prisma migrations
pnpm b pgc  # Generate Prisma client

# Start development servers
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev                    # Start frontend and backend in dev mode
pnpm b dev                  # Backend development
pnpm w dev                  # Frontend development

# Testing
pnpm test                   # Run all tests
pnpm b test                 # Backend tests
pnpm w test                 # Frontend tests

# Linting and formatting
pnpm lint                   # Lint all code
pnpm prettify              # Format code

# Database
pnpm b pmd                  # Prisma migrate dev
pnpm b pgc                  # Prisma generate

# Docker
pnpm dcb                    # Docker compose build
pnpm dcu                    # Docker compose up
```

---

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/.env`)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ideanick"

# JWT
JWT_SECRET="your-jwt-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="your-region"
AWS_S3_BUCKET="your-bucket-name"

# Email
EMAIL_FROM="noreply@ideanick.eu"
```

#### Frontend (`webapp/.env`)

```env
# API
VITE_API_URL="http://localhost:4000"

# Sentry
VITE_SENTRY_DSN="your-sentry-dsn"

# Mixpanel
VITE_MIXPANEL_TOKEN="your-mixpanel-token"
```

---

## 🚀 Deployment

### Docker

```bash
# Build Docker image
pnpm dcb

# Run with Docker Compose
pnpm dcu
```

### Heroku

```bash
# Login to Heroku and Container Registry
pnpm hl

# Deploy to Heroku
pnpm dth && pnpm dph && pnpm hr
```

---

## 🧪 Testing

The project includes a comprehensive test suite:

- **Unit tests** with Jest
- **Integration tests** for API endpoints
- **Component tests** with React Testing Library
- **E2E tests** (ready for setup)

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test -- --coverage

# Run tests in watch mode
pnpm test -- --watch
```

---

## 📊 Monitoring

### Production Monitoring

- **Sentry** - Error tracking and performance monitoring
- **Mixpanel** - User analytics and custom events
- **Winston** - Application logging
- **Cloudflare** - CDN and Web Application Firewall

### Development Tools

- **tRPC Playground** - API documentation and testing
- **React Developer Tools** - Component debugging
- **Redux DevTools** - State management debugging

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


## 👨‍💻 Author

**George Kirber**

- GitHub: [@gkirber](https://github.com/gkirber)
- Website: [ideanick.eu](https://ideanick.eu)

---

## 🙏 Acknowledgments

A huge thanks to **Sergey Dmitriev** for the excellent free full-stack web service development video tutorials from scratch.  
🔗 [SVAG Group Educational Resources](https://svag.group/ru/education/dev-web)

Thanks to all the open-source library developers who made this project possible.

---

<div align="center">
  <strong>Made with ❤️ and ☕</strong>
</div>
