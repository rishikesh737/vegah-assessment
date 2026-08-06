# Deployment Guide

This guide covers deploying the Next.js + NestJS starter to various platforms.

## Prerequisites

- Docker and Docker Compose installed
- Access to a PostgreSQL database
- Access to a Redis instance

## Environment Variables

### API (Required)

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

### Web (Required)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Option 1: Docker Compose (Self-Hosted)

The simplest deployment option for VPS or self-hosted environments.

### Steps

1. **Clone the repository on your server**

```bash
git clone https://github.com/dsamdave/nextjs-nestjs-starter.git
cd nextjs-nestjs-starter
```

2. **Create production environment file**

```bash
cp .env.example .env.production
# Edit .env.production with your values
```

3. **Build and run**

```bash
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d
```

4. **Run migrations**

```bash
docker-compose exec api npx prisma migrate deploy
```

## Option 2: Vercel (Frontend) + Railway (Backend)

A modern, scalable approach using managed platforms.

### Deploy Frontend to Vercel

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set root directory to `apps/web`

2. **Configure environment variables**
   - `NEXT_PUBLIC_API_URL` = Your Railway API URL

3. **Deploy**
   - Vercel will automatically build and deploy

### Deploy Backend to Railway

1. **Create a new project on Railway**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo

2. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-configure `DATABASE_URL`

3. **Add Redis**
   - Click "New" → "Database" → "Redis"
   - Railway will auto-configure `REDIS_URL`

4. **Configure the API service**
   - Set root directory to `apps/api`
   - Add environment variables:
     - `JWT_SECRET`
     - `JWT_REFRESH_SECRET`
     - `CORS_ORIGIN` (your Vercel URL)

5. **Deploy**
   - Railway will automatically build and deploy

## Option 3: AWS (ECS/Fargate)

For enterprise-scale deployments.

### Infrastructure Setup

1. **Create ECR repositories**

```bash
aws ecr create-repository --repository-name starter-api
aws ecr create-repository --repository-name starter-web
```

2. **Push Docker images**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push
docker build -t starter-api -f apps/api/Dockerfile .
docker tag starter-api:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/starter-api:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/starter-api:latest
```

3. **Create ECS cluster, task definitions, and services**

See AWS documentation for detailed ECS setup.

### Database Setup

- Use RDS for PostgreSQL
- Use ElastiCache for Redis

## Post-Deployment Checklist

- [ ] Run database migrations
- [ ] Seed initial data (if needed)
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup policies for database
- [ ] Test all authentication flows
- [ ] Verify CORS settings

## Health Checks

Both services expose health check endpoints:

- **API**: `GET /api/v1/health`
- **Web**: Next.js built-in health checks

## Monitoring

Recommended monitoring setup:

- **Logs**: CloudWatch, Datadog, or Logtail
- **APM**: New Relic, Datadog, or Sentry
- **Uptime**: Pingdom, UptimeRobot, or Better Uptime

## Scaling

### Horizontal Scaling

Both services are stateless and can be horizontally scaled:

- Use a load balancer (ALB, Nginx, etc.)
- Ensure sticky sessions are NOT required
- Redis handles session/cache consistency

### Database Scaling

- Read replicas for read-heavy workloads
- Connection pooling (PgBouncer)
- Consider Aurora PostgreSQL for auto-scaling

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check `DATABASE_URL` format
   - Verify network connectivity
   - Check security group/firewall rules

2. **CORS errors**
   - Verify `CORS_ORIGIN` includes your frontend URL
   - Check for trailing slashes

3. **JWT errors**
   - Ensure secrets are set correctly
   - Check token expiration settings

## Support

For deployment issues, please open a GitHub issue with:
- Platform you're deploying to
- Error messages
- Relevant configuration (sanitized)
