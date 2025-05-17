# Kitledger CSS Framework Documentation

A minimalist, dependency-free CSS framework designed specifically for accounting/ERP applications, optimized for efficiency and reliability.

## Overview

Kitledger CSS is a single-file CSS framework built with a focus on:

- **Efficiency**: Terminal-inspired compact layouts maximize information density
- **Reliability**: Minimalist approach with few dependencies 
- **Financial Focus**: Specialized components for accounting/ERP interfaces
- **Themability**: Full customization through CSS variables

The framework provides a fusion of modern web interfaces with the efficiency of classic terminal UIs like AS400, delivering a sleek but highly functional experience.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Theming](#theming)
4. [Layout System](#layout-system)
5. [Typography](#typography)
6. [Components](#components)
7. [Utilities](#utilities)
8. [Special Modes](#special-modes)
9. [Financial Components](#financial-components)
10. [Browser Support](#browser-support)
11. [Performance Considerations](#performance-considerations)
12. [Best Practices](#best-practices)

## Installation

Simply include the `kitledger.css` file in your project:

```html
<link rel="stylesheet" href="path/to/kitledger.css">
```

## Basic Usage

Kitledger CSS uses the `kl-` prefix for all classes to avoid conflicts with other frameworks.

```html
<div class="kl-container">
  <div class="kl-row">
    <div class="kl-col-md-6">
      <div class="kl-card">
        <div class="kl-card-header">Account Summary</div>
        <div class="kl-card-body">
          <p>Content goes here...</p>
          <button class="kl-btn kl-btn-primary">View Details</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Theming

Kitledger CSS uses CSS custom properties (variables) for all design tokens, making it easy to theme your application.

### Default Theme Variables

```css
:root {
  /* Color palette */
  --kl-primary: #22C55E;
  --kl-primary-light: #86efac;
  --kl-primary-dark: #16a34a;
  --kl-secondary: #475569;
  /* ...more variables... */
}
```

### Creating Custom Themes

Create a custom theme by overriding the CSS variables:

```css
.custom-theme {
  --kl-primary: #0088cc;
  --kl-primary-dark: #006699;
  --kl-bg-body: #f0f0f0;
  /* Override only what you need */
}
```

### Built-in Themes

The framework includes two built-in themes:

1. **Dark mode**: Add `kl-dark` class to a container
2. **Terminal mode**: Add `kl-terminal-mode` class for an AS400-inspired interface

## Layout System

Kitledger CSS includes a responsive 12-column grid system.

### Container

```html
<div class="kl-container">
  <!-- Content constrained to maximum widths at various breakpoints -->
</div>
```

### Grid System

```html
<div class="kl-row">
  <div class="kl-col-12 kl-col-md-6 kl-col-lg-4">
    <!-- Responsive column: full width on mobile, half on medium, third on large -->
  </div>
</div>
```

### Responsive Breakpoints

- Default: Mobile first (< 640px)
- `sm`: Small devices (≥ 640px)
- `md`: Medium devices (≥ 768px)
- `lg`: Large devices (≥ 1024px)
- `xl`: Extra large devices (≥ 1280px)

## Typography

Kitledger CSS uses IBM Plex Mono for headings and system fonts for body text.

### Headings

```html
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<!-- ... -->
```

### Text Utilities

```html
<p class="kl-text-primary">Primary text</p>
<p class="kl-text-secondary">Secondary text</p>
<p class="kl-text-center">Centered text</p>
<p class="kl-text-sm">Small text</p>
<p class="kl-font-bold">Bold text</p>
```

## Components

### Buttons

```html
<!-- Button variants -->
<button class="kl-btn kl-btn-primary">Primary</button>
<button class="kl-btn kl-btn-secondary">Secondary</button>
<button class="kl-btn kl-btn-success">Success</button>
<button class="kl-btn kl-btn-danger">Danger</button>

<!-- Soft variants -->
<button class="kl-btn kl-btn-primary-soft">Primary Soft</button>
<button class="kl-btn kl-btn-secondary-soft">Secondary Soft</button>

<!-- Other variants -->
<button class="kl-btn kl-btn-outline">Outline</button>
<button class="kl-btn kl-btn-ghost">Ghost</button>

<!-- Button sizes -->
<button class="kl-btn kl-btn-sm">Small</button>
<button class="kl-btn kl-btn-lg">Large</button>
```

### Forms

```html
<div class="kl-form-group">
  <label class="kl-form-label">Username</label>
  <input type="text" class="kl-form-control">
  <small class="kl-form-text">Enter your username</small>
</div>

<!-- Input with prepend/append -->
<div class="kl-input-group">
  <div class="kl-input-group-prepend">
    <span class="kl-input-group-text">$</span>
  </div>
  <input type="number" class="kl-form-control">
  <div class="kl-input-group-append">
    <span class="kl-input-group-text">.00</span>
  </div>
</div>
```

### Tables

```html
<table class="kl-table kl-table-striped kl-table-hover">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Item 1</td>
      <td>$100.00</td>
    </tr>
    <!-- More rows... -->
  </tbody>
</table>
```

### Cards

```html
<div class="kl-card">
  <div class="kl-card-header">
    Card Title
  </div>
  <div class="kl-card-body">
    <h5 class="kl-card-title">Special Title</h5>
    <p>Card content goes here...</p>
  </div>
  <div class="kl-card-footer">
    Footer content
  </div>
</div>
```

### Alerts

```html
<div class="kl-alert kl-alert-primary">
  Primary alert message
</div>

<div class="kl-alert kl-alert-danger">
  Danger alert message
</div>
```

### Badges

```html
<span class="kl-badge kl-badge-primary">New</span>
<span class="kl-badge kl-badge-warning">Pending</span>
```

## Utilities

### Spacing

Margin and padding utilities follow the format: `kl-{property}{direction}-{size}`

```html
<div class="kl-m-3">Margin on all sides</div>
<div class="kl-mt-2">Margin top</div>
<div class="kl-p-4">Padding on all sides</div>
<div class="kl-px-3">Padding on X-axis (left and right)</div>
```

### Display

```html
<div class="kl-d-none">Hidden on all screens</div>
<div class="kl-d-none kl-d-md-block">Hidden on mobile, visible on medium and up</div>
```

### Border & Shadow

```html
<div class="kl-border">Border on all sides</div>
<div class="kl-border-top">Border on top</div>
<div class="kl-rounded">Rounded corners</div>
<div class="kl-shadow">Box shadow</div>
```

## Special Modes

### Dark Mode

```html
<body class="kl-dark">
  <!-- All content will use dark theme -->
</body>

<!-- Or apply to a specific container -->
<div class="kl-dark">
  <!-- Only this content will use dark theme -->
</div>
```

### Terminal Mode (AS400-inspired)

```html
<div class="kl-terminal-mode">
  <!-- Content will have high-contrast, monospace styling reminiscent of AS400 terminals -->
</div>
```

## Financial Components

### Accounting Tables

```html
<table class="kl-table kl-table-accounting">
  <thead>
    <tr>
      <th>Account</th>
      <th>Description</th>
      <th>Debit</th>
      <th>Credit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1000</td>
      <td>Cash</td>
      <td class="kl-currency kl-debit">500.00</td>
      <td class="kl-currency"></td>
    </tr>
    <tr>
      <td>4000</td>
      <td>Revenue</td>
      <td class="kl-currency"></td>
      <td class="kl-currency kl-credit">500.00</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="2">Total</td>
      <td class="kl-currency">500.00</td>
      <td class="kl-currency">500.00</td>
    </tr>
  </tfoot>
</table>
```

### Account Codes

```html
<span class="kl-account-code">1000</span> Cash
<span class="kl-account-code">2000</span> Accounts Payable
```

### Journal Entries

```html
<div class="kl-journal-entry">
  <div class="kl-journal-entry-header">
    <div>Journal Entry #1001</div>
    <div>May 16, 2025</div>
  </div>
  <div class="kl-journal-entry-body">
    <table class="kl-table kl-table-accounting">
      <!-- Account entries here -->
    </table>
  </div>
  <div class="kl-journal-entry-footer">
    <div>Created by: User</div>
    <div>Balance: $1,000.00</div>
  </div>
</div>
```

### Financial Statements

```html
<div class="kl-financial-statement">
  <div class="kl-section-heading">Income Statement</div>
  
  <div class="kl-row">
    <div>Revenue</div>
    <div>$10,000.00</div>
  </div>
  
  <div class="kl-row kl-indent-1">
    <div>Sales</div>
    <div>$8,000.00</div>
  </div>
  
  <div class="kl-row kl-indent-1">
    <div>Services</div>
    <div>$2,000.00</div>
  </div>
  
  <div class="kl-row">
    <div>Expenses</div>
    <div>$6,000.00</div>
  </div>
  
  <div class="kl-row kl-row-total">
    <div>Net Income</div>
    <div>$4,000.00</div>
  </div>
</div>
```

### Data Entry Grid

```html
<table class="kl-data-grid">
  <thead>
    <tr>
      <th>Date</th>
      <th>Description</th>
      <th>Amount</th>
      <th>Tax</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <input type="date" class="kl-form-control">
      </td>
      <td>
        <input type="text" class="kl-form-control">
      </td>
      <td class="kl-cell-numeric kl-cell-editable">
        <input type="number" class="kl-form-control">
      </td>
      <td class="kl-cell-numeric kl-cell-editable">
        <input type="number" class="kl-form-control">
      </td>
      <td class="kl-cell-numeric kl-cell-formula">
        0.00
      </td>
    </tr>
  </tbody>
</table>
```

### Command Bar

```html
<div class="kl-command-bar">
  <span class="kl-command-prefix">></span>
  <input type="text" class="kl-command-input" placeholder="Type a command...">
</div>
```

### Navigation

```html
<div class="kl-sidebar">
  <div class="kl-sidebar-section">Main</div>
  <ul class="kl-sidebar-menu">
    <li class="kl-sidebar-item">
      <a href="#" class="kl-sidebar-link kl-active">Dashboard</a>
    </li>
    <li class="kl-sidebar-item">
      <a href="#" class="kl-sidebar-link">Journal Entries</a>
    </li>
    <li class="kl-sidebar-item">
      <a href="#" class="kl-sidebar-link">General Ledger</a>
    </li>
  </ul>
  
  <div class="kl-sidebar-section">Reports</div>
  <ul class="kl-sidebar-menu">
    <li class="kl-sidebar-item">
      <a href="#" class="kl-sidebar-link">Balance Sheet</a>
    </li>
    <li class="kl-sidebar-item">
      <a href="#" class="kl-sidebar-link">Income Statement</a>
    </li>
  </ul>
</div>
```

## Browser Support

Kitledger CSS uses modern CSS features and is designed to work in all modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Performance Considerations

- The entire framework is a single file under 20KB (minified and gzipped)
- No JavaScript dependencies
- Minimal use of complex selectors for better performance
- Designed for efficient rendering even with large datasets

## Best Practices

1. **Use the grid system** for layout instead of custom CSS
2. **Leverage utility classes** whenever possible instead of writing custom styles
3. **Customize via variables** rather than overriding component styles directly
4. **Use Terminal Mode** for data-heavy interfaces where efficiency is critical
5. **Apply accounting-specific components** for financial data to ensure proper alignment and formatting

## Best Practices

1. **Use the grid system** for layout instead of custom CSS
2. **Leverage utility classes** whenever possible instead of writing custom styles
3. **Customize via variables** rather than overriding component styles directly
4. **Use Terminal Mode** for data-heavy interfaces where efficiency is critical
5. **Apply accounting-specific components** for financial data to ensure proper alignment and formatting