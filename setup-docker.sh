#!/bin/bash

echo "🐳 Setting up Test Academy with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker $(docker --version) detected"
echo "✅ Docker Compose $(docker-compose --version) detected"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads certificates

# Set proper permissions
chmod 755 uploads certificates

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose exec app npx prisma db push

# Seed the database
echo "🌱 Seeding the database..."
docker-compose exec app npx prisma db seed

echo "🎉 Setup complete!"
echo ""
echo "Services running:"
echo "  📱 Application: http://localhost:3002"
echo "  🗄️  Database: localhost:5432"
echo "  🔄 Redis: localhost:6379"
echo ""
echo "Demo accounts:"
echo "  Admin: admin@testacademy.com / admin123"
echo "  Tutor: tutor@testacademy.com / tutor123"
echo "  Student: student@testacademy.com / student123"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
echo "To restart: docker-compose restart"
