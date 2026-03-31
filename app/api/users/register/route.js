import { NextResponse} from "next/server";
import { PrismaClient } from "@/prisma/generated/client";
import {hashPassword} from "@/utils/auth";

export const prisma = new PrismaClient();

export async function POST(request, { params }) {
    try {
        const { username, password,role} = await request.json();
//Validations
        if (!username || !password) {
        return NextResponse.json({error: "Username and password required"},
        { status: 400 });
        }

        const searchUser = await prisma.user.findUnique({
            where: { username:username }
        });

        if (searchUser != null){
            return NextResponse.json({error: "Username not Unique"},
        { status: 400 });
        
        }


// hash password and create user
        const hashedPassword = hashPassword(password);

        const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            role: role || "USER"
        }
        })

        return {
        status: 201,
        body: {
            message: "User registered successfully",
            userId: newUser.id
        }
        }
    }
    catch(error){

        return NextResponse.json({error: "Registration Failed"},
        { status: 500 });
        }

}

