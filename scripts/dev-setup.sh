#!/bin/bash

# SPIDER Marketplace Development Setup Script

echo "🕷️  Setting up SPIDER Marketplace development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Start database and Redis
echo "🐘 Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate --workspace=@spider/api

# Run database migrations
echo "🗄️  Running database migrations..."
npm run db:migrate --workspace=@spider/api

# Seed database
echo "🌱 Seeding database..."
npm run db:seed --workspace=@spider/api

echo "🎉 Development environment setup complete!"
echo ""
echo "Available services:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:3001"
echo "  - API Docs: http://localhost:3001/api/docs"
echo "  - pgAdmin: http://localhost:8080 (admin@spider.com / admin123)"
echo "  - Redis Commander: http://localhost:8081"
echo ""
echo "To start development servers:"
echo "  npm run dev"
echo ""
echo "To stop services:"
echo "  docker-compose down"