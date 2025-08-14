import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    // Protect all routes except API, static files, and auth routes
    "/((?!auth|api|_next/static|_next/image|favicon.ico|signup).*)",
  ],
};
