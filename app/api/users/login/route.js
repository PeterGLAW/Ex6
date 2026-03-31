import { NextResponse} from "next/server";
import { PrismaClient } from "@/prisma/generated";
import {comparePassword, generateToken} from "@/utils/auth";

export const prisma = new PrismaClient();

export async function POST(request, { params }) {
    try {
        const { username, password} = await request.json();
//Validations
        if (!username || !password) {
        return NextResponse.json({error: "Username and password required"},
        { status: 400 });
        }

        const searchUser = await prisma.user.findUnique({
            where: { username:username }
        });

        if (!searchUser || !(await comparePassword(password, searchUser.password))){
            return NextResponse.json({error: "Unauthorized"},
        { status: 401 });
        }



//generate JWT Token
        const accessToken = generateToken({username: searchUser.username,role: searchUser.role});
        const refreshToken = generateToken({username: searchUser.username,role: searchUser.role});
        return NextResponse.json({ "accessToken":accessToken, "refreshToken":refreshToken },{status: 200});
    }
    catch(error){

        return NextResponse.json({error: "Login Failed"},
        { status: 500 });
        }

}

