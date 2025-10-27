# Test Academy - Docker Setup Complete! 🐳

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
./setup-docker.sh
```

### Option 2: Manual Setup
```bash
# Build and start all services
docker-compose up --build -d

# Run database migrations
docker-compose exec app npx prisma db push

# Seed the database
docker-compose exec app npx prisma db seed
```

## 🌐 Access Points

- **Application**: http://localhost:3001
- **Database**: localhost:5432 (postgres/postgres123)
- **Redis**: localhost:6379
- **Health Check**: http://localhost:3001/api/health

## 🔑 Demo Accounts

- **Admin**: admin@testacademy.com / admin123
- **Tutor**: tutor@testacademy.com / tutor123
- **Student**: student@testacademy.com / student123

## 🐳 Docker Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| **App** | test-academy-app | 3001 | Next.js Application |
| **Database** | test-academy-db | 5432 | PostgreSQL Database |
| **Cache** | test-academy-redis | 6379 | Redis Cache |

## 📋 Useful Commands

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f postgres

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Access database shell
docker-compose exec postgres psql -U postgres -d testacademy

# Run Prisma Studio
docker-compose exec app npx prisma studio

# Rebuild everything
docker-compose up --build -d
```

## 🔧 Configuration

The application is configured with:
- **PostgreSQL** database with persistent volumes
- **Redis** for caching and session storage
- **Health checks** for monitoring
- **Automatic restarts** on failure
- **Network isolation** for security

## 📁 File Structure

```
├── docker-compose.yml    # Docker services configuration
├── Dockerfile           # Application container definition
├── .dockerignore        # Files to exclude from Docker build
├── setup-docker.sh      # Automated setup script
├── DOCKER.md           # Detailed Docker documentation
└── uploads/            # File upload directory (created automatically)
```

## 🚨 Troubleshooting

1. **Port conflicts**: Modify ports in `docker-compose.yml`
2. **Permission issues**: Run `chmod 755 uploads certificates`
3. **Database issues**: Check with `docker-compose ps`
4. **Reset everything**: `docker-compose down -v && docker-compose up --build -d`

## ✅ Features Included

- ✅ Complete LMS with all user flows
- ✅ PostgreSQL database with persistent storage
- ✅ Redis caching for better performance
- ✅ Health monitoring endpoints
- ✅ Automatic database migrations
- ✅ Pre-seeded demo data
- ✅ File upload support
- ✅ Certificate generation
- ✅ Real-time notifications

Your Test Academy is now ready to run with Docker! 🎉
