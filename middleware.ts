import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Create a custom route matcher
const isPublicRoute = (request: NextRequest) => {
  const publicRoutes = [
    "/",
    "/question/:id",
    "/tags",
    "/tags/:id",
    "/profile/:id",
    "/community",
  ];

  const ignoredRoutes = ["/api/webhooks", "/api/chatgpt"];

  // Check if the route is public or ignored
  return (
    publicRoutes.some((route) => request.url.match(new RegExp(`^${route}$`))) ||
    ignoredRoutes.some((route) => request.url.match(new RegExp(`^${route}$`)))
  );
};

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

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
