#!/bin/bash

echo "🚀 Setting up Test Academy..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up database
echo "🗄️ Setting up database..."
npx prisma db push
npx prisma db seed

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration"
fi

echo "🎉 Setup complete!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "Demo accounts:"
echo "  Admin: admin@testacademy.com / admin123"
echo "  Tutor: tutor@testacademy.com / tutor123"
echo "  Student: student@testacademy.com / student123"
echo ""
echo "Open http://localhost:3000 in your browser"
