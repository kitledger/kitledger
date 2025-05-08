## Style Guide
# TypeScript Style Guide

## File Organization

Files must be named using `snake_case`:
```typescript
// ✅ Good
user_service.ts
authentication_helper.ts

// ❌ Bad
userService.ts
AuthenticationHelper.ts
```

## Naming Conventions

### Variables, Constants and Functions
Use `camelCase`:
```typescript
// ✅ Good
const userId = 1;
let userCount = 0;

// ❌ Bad
const user_id = 1;
let User_Count = 0;
```
```typescript
// ✅ Good
function getData() {}
const processUser = () => {};

// ❌ Bad
function GetData() {}
const Process_User = () => {};
```

### Properties
Use `snake_case`:
```typescript
// ✅ Good
interface User {
    user_id: number;
    first_name: string;
}

// ❌ Bad
interface User {
    userId: number;
    firstName: string;
}
```

### Classes, Types, and Interfaces
Use `PascalCase`:
```typescript
// ✅ Good
class UserService {}
type UserData = string;
interface UserInterface {}

// ❌ Bad
class user_service {}
type userData = string;
interface userInterface {}
```

## Formatting

- Use tabs for indentation
- Maximum line length: 120 characters
- Use semicolons
- Use single quotes for strings
- Indentation width: 4 spaces

Note: These formatting rules are configured with the built-in Deno formatter. In order to apply them, run:
```bash
deno task format
```