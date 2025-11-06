@echo off
REM SPIDER Marketplace Development Setup Script for Windows

echo 🕷️  Setting up SPIDER Marketplace development environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

echo ✅ Docker is running

REM Start database and Redis
echo 🐘 Starting PostgreSQL and Redis...
docker-compose up -d postgres redis

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run db:generate --workspace=@spider/api

REM Run database migrations
echo 🗄️  Running database migrations...
npm run db:migrate --workspace=@spider/api

REM Seed database
echo 🌱 Seeding database...
npm run db:seed --workspace=@spider/api

echo 🎉 Development environment setup complete!
echo.
echo Available services:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:3001
echo   - API Docs: http://localhost:3001/api/docs
echo   - pgAdmin: http://localhost:8080 (admin@spider.com / admin123)
echo   - Redis Commander: http://localhost:8081
echo.
echo To start development servers:
echo   npm run dev
echo.
echo To stop services:
echo   docker-compose down