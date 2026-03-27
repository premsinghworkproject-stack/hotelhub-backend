# Testing Setup and Documentation

## 📋 Overview

This document outlines the comprehensive testing setup for the Booking GraphQL Backend application using Jest and TypeScript.

## 🛠️ Installation

### Required Dependencies
```bash
pnpm add -D jest @types/jest ts-jest supertest @types/supertest
```

### Test Scripts Added to package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:unit": "jest --config jest.config.js"
  }
}
```

## 🗂️ Project Structure

```
src/
├── modules/
│   ├── elasticsearch/
│   │   ├── elasticsearch.service.spec.ts
│   │   ├── elasticsearch.service.ts
│   │   └── elasticsearch.module.ts
│   ├── hotel/
│   │   ├── hotel.service.spec.ts
│   │   ├── hotel.repository.spec.ts
│   │   └── hotel.module.ts
│   └── auth/
│       ├── auth.service.spec.ts
│       └── auth.module.ts
test/
├── setup.jest.ts
├── modules/
│   └── elasticsearch/
│       └── elasticsearch.service.spec.ts
├── basic.test.ts
└── simple.test.js
jest.config.js
```

## ⚙️ Jest Configuration (jest.config.js)

```javascript
module.exports = {
  displayName: 'Booking GraphQL Backend',
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: [
    'test/**/*.spec.ts',
    'test/**/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  testTimeout: 10000,
  moduleFileExtensions: ['js', 'json', 'ts'],
  verbose: true
};
```

## 🧪 Test Environment Setup

### Environment Variables
- `NODE_ENV=test` - Test environment
- `ELASTICSEARCH_NODE=http://localhost:9201` - Different port for tests
- `DATABASE_URL=sqlite::memory:` - In-memory SQLite for tests

### Test Utilities (test/setup.jest.ts)
- Mock factories for test data
- Common mock implementations
- Test application factory

## 📝️ Running Tests

### Basic Tests
```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage

# Run specific test file
npx jest test/basic.test.ts

# Debug tests
pnpm run test:debug
```

## 🧪 Test Categories

### 1. Unit Tests
- **Service Layer**: Business logic testing
- **Repository Layer**: Data access testing
- **Controller Layer**: Endpoint testing
- **Resolver Layer**: GraphQL resolver testing

### 2. Integration Tests
- **Module Integration**: Cross-module functionality
- **Database Integration**: Sequelize ORM testing
- **Elasticsearch Integration**: Search functionality testing

### 3. End-to-End Tests
- **API Testing**: Full request/response cycles
- **GraphQL Testing**: Query and mutation testing

## 📊 Coverage Requirements

### Target Coverage
- **Statements**: ≥ 80%
- **Branches**: ≥ 80%
- **Functions**: ≥ 80%
- **Lines**: ≥ 80%

### Coverage Reports
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **Text**: Console output

## 🔧 Test Data Factories

### Hotel Factory
```typescript
const createTestHotel = (overrides = {}) => ({
  id: 1,
  name: 'Test Hotel',
  description: 'Test Description',
  address: '123 Test St',
  city: 'Test City',
  state: 'TS',
  country: 'USA',
  rating: 4.5,
  totalReviews: 100,
  isActive: true,
  ...overrides
});
```

### User Factory
```typescript
const createTestUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  isActive: true,
  ...overrides
});
```

## 📝️ Writing Tests

### Test Structure
```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    test('should handle expected behavior', async () => {
      // Arrange
      const input = createTestData();
      
      // Act
      const result = await service.methodName(input);
      
      // Assert
      expect(result).toEqual(expectedOutput);
    });
    
    test('should handle errors', async () => {
      // Arrange
      const mockService = createMockService();
      mockService.methodName.mockRejectedValue(new Error('Test error'));
      
      // Act & Assert
      await expect(service.methodName(input)).rejects.toThrow('Test error');
    });
  });
});
```

### Best Practices
1. **AAA Pattern**: Arrange, Act, Assert
2. **Descriptive Tests**: Clear test names and descriptions
3. **Mock Dependencies**: Isolate unit under test
4. **Edge Cases**: Test boundary conditions
5. **Error Handling**: Test failure scenarios
6. **Async Testing**: Proper async/await usage

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 🔍 Debugging Tests

### Common Issues
1. **TypeScript Configuration**: Ensure tsconfig.json includes test types
2. **Module Resolution**: Check Jest moduleNameMapping
3. **Mock Implementation**: Verify mock behavior matches real implementation
4. **Async Timing**: Use proper timeout handling
5. **Database Cleanup**: Reset database between tests

## 📈 Next Steps

1. ✅ Complete test coverage for all modules
2. ✅ Add integration tests for API endpoints
3. ✅ Implement E2E tests for critical user flows
4. ✅ Set up CI/CD pipeline
5. ✅ Add performance testing
6. ✅ Add load testing

## 🛠️ Troubleshooting

### Jest Not Finding Tests
1. Check file naming: `*.spec.ts` or `*.test.ts`
2. Verify Jest configuration roots
3. Ensure TypeScript compilation
4. Check testMatch patterns

### Mock Issues
1. Use `jest.clearAllMocks()` in beforeEach
2. Verify mock return values
3. Check mock call counts

### Database Issues
1. Use in-memory database for tests
2. Clean up between tests
3. Verify connection strings

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing Guide](https://docs.nestjs.com/guides/testing)
- [Sequelize Testing](https://sequelize.org/docs/v6/other-topics/testing/)
- [Elasticsearch Testing](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api-testing.html)
