# E-Commerce Microservices API

A complete microservices-based e-commerce backend built with Docker and Docker Compose, featuring separate services for products and users, with an Nginx API gateway and MongoDB database.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              API Gateway (Nginx)                │
│              Port: 8080                         │
└───────────────┬─────────────┬───────────────────┘
                │             │
      ┌─────────▼──────┐  ┌──▼──────────────┐
      │ Product Service│  │  User Service   │
      │   (Node.js)    │  │   (Flask)       │
      │   Port: 3001   │  │   Port: 5000    │
      └────────┬───────┘  └─────┬───────────┘
               │                │
               └────────┬───────┘
                        │
                   ┌────▼─────┐
                   │ MongoDB  │
                   │ Port:    │
                   │ 27017    │
                   └──────────┘
```

## Services

- **API Gateway (Nginx)**: Reverse proxy and load balancer
- **Product Service (Node.js)**: Manages product catalog
- **User Service (Python Flask)**: Handles user authentication and profiles
- **MongoDB**: Shared database for all services

## Project Structure

```
.
├── docker-compose.yml
├── .env
├── init-mongo.js
├── product-service/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── user-service/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app.py
└── nginx/
    └── nginx.conf
```

## Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)

## Setup Instructions

### 1. Clone or create the project structure

Create the following directories:
```bash
mkdir -p product-service user-service nginx
```

### 2. Place all files in their respective directories

- Root files: `docker-compose.yml`, `.env`, `init-mongo.js`
- `product-service/`: `Dockerfile`, `package.json`, `server.js`
- `user-service/`: `Dockerfile`, `requirements.txt`, `app.py`
- `nginx/`: `nginx.conf`

### 3. Build and start all services

```bash
# Build and start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check service health
docker-compose ps
```

### 4. Verify services are running

```bash
# Check API Gateway
curl http://localhost:8080/health

# Check Product Service
curl http://localhost:8080/api/products

# Check User Service  
curl http://localhost:8080/api/users
```

## API Endpoints

All requests go through the API Gateway at `http://localhost:8080`

### Product Service

```bash
# Get all products
GET /api/products

# Get all products with filters
GET /api/products?category=Electronics&minPrice=50&maxPrice=200

# Get single product
GET /api/products/:id

# Create product
POST /api/products
Content-Type: application/json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "stock": 20
}

# Update product
PUT /api/products/:id
Content-Type: application/json
{
  "price": 899.99,
  "stock": 15
}

# Delete product
DELETE /api/products/:id
```

### User Service

```bash
# Get all users
GET /api/users

# Get single user
GET /api/users/:id

# Register user
POST /api/users
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "1234567890",
  "address": "123 Main St"
}

# Login user
POST /api/users/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "securepass123"
}

# Update user
PUT /api/users/:id
Content-Type: application/json
{
  "name": "John Smith",
  "phone": "0987654321"
}

# Delete user
DELETE /api/users/:id
```

## Testing Examples

### Create a product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "Gaming laptop",
    "price": 1299.99,
    "category": "Electronics",
    "stock": 10
  }'
```

### Register a user
```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "password123",
    "phone": "5551234567"
  }'
```

### Get products by category
```bash
curl "http://localhost:8080/api/products?category=Electronics"
```

## Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View logs for specific service
docker-compose logs -f product-service
docker-compose logs -f user-service

# Rebuild specific service
docker-compose up -d --build product-service

# Access MongoDB shell
docker exec -it ecommerce-db mongosh -u admin -p admin123

# Execute commands in a container
docker exec -it product-service sh
docker exec -it user-service bash

# View resource usage
docker stats
```

## Key Docker Concepts Demonstrated

### 1. **Multi-stage Builds**
Both Dockerfiles use multi-stage builds to separate development and production environments.

### 2. **Health Checks**
All services have health checks to ensure they're running correctly before dependent services start.

### 3. **Networking**
Services communicate via a custom bridge network (`ecommerce-network`).

### 4. **Volumes**
- Named volume for MongoDB persistence: `mongodb_data`
- Bind mounts for development with hot reload

### 5. **Environment Variables**
Configuration is externalized using environment variables.

### 6. **Service Dependencies**
Services use `depends_on` with health check conditions to start in the correct order.

### 7. **Reverse Proxy**
Nginx acts as an API gateway, routing requests to appropriate services.

## Development Features

- **Hot Reload**: Changes to code are automatically reflected
- **Product Service**: Uses nodemon for auto-restart
- **User Service**: Flask development server with reload enabled

## Production Considerations

To run in production mode:

1. Update Dockerfiles to use production stages
2. Change environment variables in `.env`
3. Add authentication/authorization
4. Implement proper logging and monitoring
5. Use secrets management for sensitive data
6. Add SSL/TLS certificates to Nginx
7. Implement rate limiting and security headers

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### MongoDB connection issues
```bash
# Check MongoDB is running
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Access MongoDB shell to verify
docker exec -it ecommerce-db mongosh -u admin -p admin123
```

### Port already in use
```bash
# Change port in docker-compose.yml
ports:
  - "8081:80"  # Change 8080 to 8081
```

## Cleanup

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

## Next Steps

- Add authentication middleware (JWT)
- Implement order service
- Add Redis for caching
- Set up CI/CD pipeline
- Add monitoring with Prometheus/Grafana
- Implement API documentation with Swagger
- Add integration tests

## Learning Objectives Achieved

✅ Container orchestration with Docker Compose
✅ Multi-stage Docker builds
✅ Service networking and communication
✅ Health checks and service dependencies
✅ Volume management for persistence
✅ Environment configuration
✅ Reverse proxy with Nginx
✅ Microservices architecture patterns