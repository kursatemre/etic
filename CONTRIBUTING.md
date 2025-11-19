# Contributing to ETIC

Thank you for your interest in contributing to ETIC! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in your interactions with other contributors.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/etic.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit with a clear message: `git commit -m "Add: Description of your changes"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow the existing code style (Prettier is configured)
- Write meaningful variable and function names
- Add comments for complex logic

### Commit Messages

Use conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add multi-currency support to products`

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test in multiple browsers if making UI changes

### Pull Request Process

1. Update documentation if needed
2. Ensure your code follows the style guidelines
3. Write a clear PR description explaining your changes
4. Link any related issues
5. Wait for code review and address feedback

## Project Structure

Familiarize yourself with the monorepo structure:
- `apps/` - Application code (web, admin, storefront)
- `packages/` - Shared packages (database, types, ui)
- `services/` - Backend services (API, webhooks)

## Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing to ETIC!
