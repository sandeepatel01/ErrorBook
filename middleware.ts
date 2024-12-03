import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Utility function to determine if a route matches any pattern
const isMatchingRoute = (request: NextRequest, routes: string[]) => {
  return routes.some((route) => {
    // Convert dynamic route segments (e.g., :id) to regex wildcards
    const regex = new RegExp(
      `^${route.replace(/:([a-zA-Z0-9_]+)/g, "([^/]+)")}$`,
    );
    return regex.test(new URL(request.url).pathname); // Direct use of pathname
  });
};

const isPublicRoute = (request: NextRequest) => {
  const publicRoutes = [
    "/",
    "/question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
    "/sign-in(.*)",
    "/sign-up(.*)",
  ];

  const ignoredRoutes = ["/api/webhooks", "/api/chatgpt"];

  // Check if the route is either public or ignored
  return (
    isMatchingRoute(request, publicRoutes) ||
    isMatchingRoute(request, ignoredRoutes)
  );
};

export default clerkMiddleware(async (auth, request) => {
  try {
    // If the route is not public or ignored, protect it with Clerk authentication
    if (!isPublicRoute(request)) {
      console.log("Protecting route:", request.url);
      await auth.protect();
    } else {
      console.log("Public route accessed:", request.url);
    }
  } catch (error) {
    console.error("Auth protection error:", error);
    // Optional: Send an error response for unauthorized access
    return new Response("Unauthorized", { status: 401 });
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Matches all routes except static files and _next
    "/",
    "/(api|trpc)(.*)", // Matches API and TRPC routes
  ],
};

// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextRequest } from "next/server";

// // Utility function to determine if a route matches any pattern
// const isMatchingRoute = (request: NextRequest, routes: string[]) => {
//   return routes.some((route) => {
//     // Convert dynamic route segments (e.g., :id) to regex wildcards
//     const regex = new RegExp(
//       `^${route.replace(/:([a-zA-Z0-9_]+)/g, "([^/]+)")}$`,
//     );
//     return regex.test(new URL(request.url).pathname); // Direct use of pathname
//   });
// };

// const isPublicRoute = (request: NextRequest) => {
//   const publicRoutes = [
//     "/",
//     "/question/:id",
//     "/tags",
//     "/tags/:id",
//     "/profile/:id",
//     "/community",
//   ];

//   const ignoredRoutes = ["/api/webhooks", "/api/chatgpt"];

//   // Check if the route is either public or ignored
//   return (
//     isMatchingRoute(request, publicRoutes) ||
//     isMatchingRoute(request, ignoredRoutes)
//   );
// };

// export default clerkMiddleware(async (auth, request) => {
//   try {
//     // If the route is not public or ignored, protect it with Clerk authentication
//     if (!isPublicRoute(request)) {
//       console.log("Protecting route:", request.url);
//       await auth.protect();
//     } else {
//       console.log("Public route accessed:", request.url);
//     }
//   } catch (error) {
//     console.error("Auth protection error:", error);
//     // Optional: Send an error response for unauthorized access
//     return new Response("Unauthorized", { status: 401 });
//   }
// });

// export const config = {
//   matcher: [
//     "/((?!.*\\..*|_next).*)", // Matches all routes except static files and _next
//     "/",
//     "/(api|trpc)(.*)", // Matches API and TRPC routes
//   ],
// };

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// // Add "/" to the public routes
// const isPublicRoute = createRouteMatcher({
//   publicRoutes: [
//     "/",
//     "/api/webhooks",
//     "/question/:id",
//     "/tags",
//     "/tags/:id",
//     "/profile/:id",
//     "/community",
//     // "/sign-in(.*)",
//     // "/sign-up(.*)",
//   ],
//   ignoredRoutes: ["/api/webhooks", "/api/chatgpt"],
// });

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],

//   // matcher: [
//   //   "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//   //   "/(api|trpc)(.*)",
//   // ],
// };
