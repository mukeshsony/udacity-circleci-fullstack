# MyStore - Angular E-Commerce Application# MystoreAngular



A full-featured e-commerce application built with Angular that demonstrates a complete shopping experience.This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.



## Features## Development server



- **Product List Page**: Browse available products in a responsive grid layoutRun `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

- **Product Details Page**: View detailed information about individual products

- **Shopping Cart**: Add, remove, and update quantities of products## Code scaffolding

- **Checkout Form**: Validate and collect customer information with Angular Reactive Forms

- **Order Confirmation**: Display order summary after successful checkoutRun `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

- **Responsive Design**: Mobile-friendly UI that works on all devices

- **Client-Side Routing**: Seamless navigation without page reloads## Build



## Project StructureRun `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.



```## Running unit tests

src/

├── app/Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

│   ├── components/

│   │   ├── product-list/       # Main product catalog## Running end-to-end tests

│   │   ├── product-detail/     # Individual product view

│   │   ├── cart/               # Shopping cartRun `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

│   │   ├── checkout/           # Checkout form

│   │   ├── confirmation/       # Order confirmation## Further help

│   │   └── header/             # Navigation header

│   ├── models/To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

│   │   ├── product.model.ts    # Product interface
│   │   ├── cart-item.model.ts  # Cart item interface
│   │   └── order.model.ts      # Order interface
│   ├── services/
│   │   ├── product.service.ts  # Product data management
│   │   └── cart.service.ts     # Shopping cart state management
│   ├── app.routes.ts           # Route configuration
│   └── app.config.ts           # Application configuration
└── assets/
    └── data.json               # Product data
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)
- Angular CLI (installed automatically with project dependencies)

### Installation

1. Navigate to the project directory:
```bash
cd mystore-angular
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
ng serve
```

or

```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you make changes to the source files.

## Usage Guide

### Browsing Products
- The home page displays all available products
- Click on any product card to view detailed information

### Adding to Cart
- On the product detail page, select a quantity and click "Add to Cart"
- The cart badge in the header shows the total number of items

### Managing Cart
- Click the cart icon in the header to view your cart
- Update quantities or remove items as needed
- Click "Proceed to Checkout" when ready

### Checkout Process
- Fill in the required information:
  - Full Name (minimum 3 characters)
  - Address (minimum 6 characters)
  - Email (valid email format)
  - Credit Card (exactly 16 digits)
- All fields are validated on the client side
- Click "Complete Order" to submit

### Order Confirmation
- View your order summary
- Cart is automatically cleared after successful checkout
- Click "Continue Shopping" to return to the product catalog

## Technical Implementation

### State Management
- **CartService**: Uses RxJS BehaviorSubject to manage cart state
- Real-time updates across all components that subscribe to cart changes

### Routing
- Configured in `app.routes.ts`
- Protected routes ensure users can't access confirmation without completing checkout
- Wildcard route handles 404 errors

### Form Validation
- Reactive Forms with built-in validators
- Real-time validation feedback
- Submit button disabled until form is valid

### Component Architecture
- Standalone components (Angular 15+ feature)
- Parent-child component communication
- Service-based data sharing

## Building for Production

Build the application:
```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Development Commands

- `ng serve` - Start development server
- `ng build` - Build the project
- `ng test` - Run unit tests
- `ng lint` - Run linting

## Customization

### Adding Products
Edit `src/assets/data.json` to add or modify products. Each product should have:
- `id`: Unique identifier
- `name`: Product name
- `price`: Price as a number
- `url`: Image URL
- `description`: Product description
- `category`: (optional) Product category

### Styling
- Global styles: `src/styles.css`
- Component-specific styles: Each component has its own `.css` file
- Color scheme can be modified in the CSS variables

## License

This project is part of the Udacity Nanodegree program.

## Acknowledgments

- Built with Angular CLI
- Product images from Unsplash
- Styling inspired by modern e-commerce platforms
