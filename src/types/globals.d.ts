// This file extends the global Express Request interface
// to include the 'auth' property provided by the Clerk middleware.

// By declaring this in a .d.ts file, TypeScript will automatically
// recognize `req.auth` in all your project files.

declare global {
  namespace Express {
    interface Request {
      auth: import('@clerk/express').AuthObject;
    }
  }
}

// You can leave this export statement as is.
// It's needed to make this file a module.
export {};
