import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "@/utill/amplify-server-utills";
import { headers, ROUTES, ROUTES_FEATURES, UserRolesInterface } from "./constant";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const user = await authenticatedUser({ request, response });
    const roleFromCookie = request.cookies.get('userRole')?.value as UserRolesInterface | undefined;
    const userRoleFeatures = request.cookies.get('featureList')?.value as string;
    const arr = userRoleFeatures?.split(',').map(s => s.replace(/'/g, ''));
   
    if (request.nextUrl.pathname.endsWith('.json')) {
      return NextResponse.next();
    } 
    if (!user && !roleFromCookie) {
      if (request.nextUrl.pathname !== '/') {
        return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
      }
      // Allow access to the login page
      return NextResponse.next();
    } else {
      if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
      }
      return NextResponse.next();
    }
  
  }
  
  export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
  };