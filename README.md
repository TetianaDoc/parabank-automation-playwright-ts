# ParaBank Playwright TypeScript Automation

A scalable, maintainable test automation framework for [ParaBank](https://parabank.parasoft.com/parabank) built with **Playwright** and **TypeScript**, organized using clean architectural separation of concerns.

---

## 🏛️ Architecture Overview

The repository is organized into three distinct layers to ensure strict separation of concerns, reusability, and maintainability:

```
parabank-automation-playwright-ts/
├── src/
│   ├── ui/                          # 🎨 UI Layer (Components & Pages)
│   │   ├── components/              # Modular UI components (Navigation, Header, Side Menu, Footer)
│   │   │   ├── base.component.ts
│   │   │   ├── header.component.ts
│   │   │   ├── navigation.component.ts
│   │   │   ├── account-menu.component.ts
│   │   │   └── footer.component.ts
│   │   └── pages/                   # Page Object Models (POM) encapsulating selectors & actions
│   │       ├── base.page.ts
│   │       ├── login.page.ts
│   │       ├── register.page.ts
│   │       ├── accounts-overview.page.ts
│   │       ├── open-account.page.ts
│   │       ├── transfer-funds.page.ts
│   │       └── bill-pay.page.ts
│   │
│   └── data/                        # 📦 Test Data Layer (Models, Fixtures, Factories)
│       ├── models/                  # Strongly-typed TypeScript interfaces
│       │   ├── user.model.ts
│       │   ├── account.model.ts
│       │   ├── bill-pay.model.ts
│       │   └── transfer.model.ts
│       ├── fixtures/                # Static test data, constants & expected messages
│       │   ├── users.data.ts
│       │   ├── billers.data.ts
│       │   └── test-constants.ts
│       └── factories/               # Dynamic data generators for test isolation & idempotency
│           ├── user.factory.ts
│           └── bill-pay.factory.ts
│
├── tests/                           # 🧪 Test Layer (Specs & Fixtures)
│   ├── fixtures/                    # Custom Playwright test fixtures
│   │   └── base.fixture.ts          # Extends Playwright test to inject page objects & test data
│   ├── auth/                        # Authentication & Registration test suite
│   │   ├── login.spec.ts
│   │   └── register.spec.ts
│   ├── accounts/                    # Accounts Overview & Creation test suite
│   │   ├── accounts-overview.spec.ts
│   │   └── open-account.spec.ts
│   ├── transfer/                    # Funds Transfer test suite
│   │   └── transfer-funds.spec.ts
│   └── bill-pay/                    # Bill Payment test suite
│       └── bill-pay.spec.ts
│
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration with path aliases
└── package.json                     # Scripts & dependencies
```

---

## 🧩 Architectural Separation Details

### 1. 🎨 UI Components & Pages (`src/ui/`)
- **Components (`src/ui/components/`)**: Shared, reusable UI widgets and sections (e.g., `HeaderComponent`, `NavigationComponent`, `AccountMenuComponent`, `FooterComponent`).
- **Pages (`src/ui/pages/`)**: Full Page Object Models extending `BasePage`. They encapsulate selectors, page interactions, and state verifications. Tests never interact with raw locators directly.

### 2. 📦 Test Data (`src/data/`)
- **Models (`src/data/models/`)**: TypeScript types and interfaces defining domain entities (`User`, `Account`, `BillPayee`, `TransferRequest`).
- **Static Fixtures (`src/data/fixtures/`)**: Predefined datasets and constants (`users.data.ts`, `billers.data.ts`, `test-constants.ts`).
- **Dynamic Factories (`src/data/factories/`)**: Dynamic data generators (`user.factory.ts`, `bill-pay.factory.ts`) ensuring test isolation and avoiding data collision on shared environments.

### 3. 🧪 Tests (`tests/`)
- **Fixtures (`tests/fixtures/base.fixture.ts`)**: Custom Playwright fixtures that inject page objects and pre-configured test fixtures (e.g. `registeredUser` automatically registers and logs in a unique user for test isolation).
- **Specs by Feature**: Organized in feature folders (`auth`, `accounts`, `transfer`, `bill-pay`) for clear test suite management and parallel execution.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm

### Installation
```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in headed browser
npm run test:headed

# Run with Playwright UI mode
npm run test:ui

# Run specific feature suites
npm run test:auth
npm run test:accounts
npm run test:transfer
npm run test:bill-pay

# View HTML test report
npm run report
```
