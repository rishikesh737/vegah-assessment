# Contributing

Thank you for your interest in contributing to this project!

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Docker and Docker Compose

### Getting Started

1. **Fork and clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/nextjs-nestjs-starter.git
cd nextjs-nestjs-starter
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Start the database**

```bash
docker-compose up -d
```

4. **Set up environment variables**

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

5. **Run database migrations**

```bash
pnpm db:migrate
```

6. **Start development servers**

```bash
pnpm dev
```

## Code Style

- We use ESLint and Prettier for code formatting
- Run `pnpm lint` to check for issues
- Run `pnpm lint:fix` to auto-fix issues
- Commit messages should follow [Conventional Commits](https://www.conventionalcommits.org/)

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all tests pass (`pnpm test`)
4. Ensure linting passes (`pnpm lint`)
5. Update documentation if needed
6. Submit a PR to the `develop` branch

## Commit Messages

We follow Conventional Commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:

```
feat(auth): add password reset functionality

- Add forgot password endpoint
- Add reset password with token
- Add email service for sending reset links
```

## Questions?

Feel free to open an issue for any questions or concerns.
