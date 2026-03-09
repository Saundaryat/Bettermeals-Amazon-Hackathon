# Registration Component

A complete registration form component that matches the design requirements.

## Features

- **Form Fields:**
  - Email (valid email format)
  - WhatsApp Number (Indian format: +91XXXXXXXXXX)
  - Password (8+ chars, uppercase, lowercase, number)
  - Confirm Password (must match password)

- **Validation:**
  - Real-time form validation using Zod schema
  - Password strength requirements
  - WhatsApp number format validation
  - Terms of Service acceptance required

- **UI Features:**
  - Password visibility toggle
  - Orange carrot logo
  - Responsive design
  - Loading states
  - Error handling with toast notifications

- **Navigation:**
  - "Log In" link redirects to `/app/login`
  - Terms of Service link opens in new tab
  - After successful registration, redirects to login page

## Usage

```tsx
import RegistrationForm from '@/components/registration/RegistrationForm';

// In your component
<RegistrationForm />
```

## Routes

- **Registration Page:** `/app/registration`
- **Login Page:** `/app/login`

## API Integration

The component uses `RegistrationService` to handle API calls to `/auth/register` endpoint.

## Styling

Uses Tailwind CSS with shadcn/ui components for consistent styling.
