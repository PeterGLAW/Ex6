import { NextResponse} from "next/server";
import { PrismaClient } from "@/prisma/generated";
import {verifyToken} from "@/utils/auth";

export const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
        return NextResponse.json(
        { error: "Missing or invalid token" },
        { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1]; 
    const valid = verifyToken(token);

    if (!valid) {
        return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
        );
    }
    return NextResponse.json({Message: "access granted",user: valid},
        { status: 200 });

}