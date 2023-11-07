import '@testing-library/jest-dom'
import 'whatwg-fetch';
require('dotenv').config({ path: '.env'})
global.ResizeObserver = require('resize-observer-polyfill')

// Mock useRouter:
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      prefetch: () => null
    };
  },
  usePathname() {
    return '';
  },
}));

// ensure we have the environment variables setup, or auto-fail all tests.
if (!process.env.JEST_DEFAULT_USER_EMAIL || !process.env.JEST_DEFAULT_USER_PASSWORD) {
  throw Error("!process.env.JEST_DEFAULT_USER_EMAIL || !process.env.JEST_DEFAULT_USER_PASSWORD")
}

if (!process.env.JEST_ADMIN_USER_EMAIL || !process.env.JEST_ADMIN_USER_PASSWORD) {
  throw Error("!process.env.JEST_DEFAULT_USER_EMAIL || !process.env.JEST_DEFAULT_USER_PASSWORD")
}

export type user_info_type = {
  name: string,
  email: string,
  password: string,
  role: string,
  roleText: string,
}

export const test_user_info: user_info_type = {
  name: "Integration",
  email: process.env.JEST_DEFAULT_USER_EMAIL!,
  password: process.env.JEST_DEFAULT_USER_PASSWORD!,
  role: "1",
  roleText: "Default",
}

export const test_admin_info: user_info_type = {
  name: "Integration Admin",
  email: process.env.JEST_ADMIN_USER_EMAIL!,
  password: process.env.JEST_ADMIN_USER_PASSWORD!,
  role: "2",
  roleText: "Administrator",
}
