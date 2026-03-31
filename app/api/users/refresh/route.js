import { NextResponse} from "next/server";
import { PrismaClient } from "@/prisma/generated";
import {verifyToken,generateToken} from "@/utils/auth";

export const prisma = new PrismaClient();

export async function POST(request, { params }) {
    const body = await request.json();
    const { refreshToken } = body;
    if (!refreshToken) {
        return NextResponse.json(
        { error: "Missing or invalid token" },
        { status: 401 }
        );
    }
 
    const valid = verifyToken(refreshToken);

    if (!valid) {
        return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
        );
    }
    const { username, role } = valid;

    const accessToken = generateToken({ username, role });

    return NextResponse.json({Message: "access granted","accessToken": accessToken},
        { status: 200 });

}