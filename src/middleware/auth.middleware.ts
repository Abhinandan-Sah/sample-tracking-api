// src/middleware/auth.middleware.ts

import { requireAuth } from '@clerk/express';

/**
 * This is the authentication middleware for protecting routes.
 *
 * It uses Clerk's `requireAuth` function, which does the following:
 * 1. Checks for a valid session token in the request headers/cookies.
 * 2. If the token is valid, it populates `req.auth` with user session data
 * and calls the next middleware in the chain.
 * 3. If the token is missing or invalid, it immediately ends the request
 * with a 401 Unauthorized error response.
 *
 * PREREQUISITE: The global `clerkMiddleware()` must be set up in `app.ts`
 * BEFORE this middleware is used in any route.
 */
export const authMiddleware = requireAuth;
