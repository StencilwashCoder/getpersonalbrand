import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, password, name, username } = await req.json()

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if username is valid (alphanumeric and hyphens only)
    if (!/^[a-z0-9-]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain lowercase letters, numbers, and hyphens" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || null,
        username,
        site: {
          create: {
            content: [],
            theme: {
              primaryColor: "#2563eb",
              font: "inter",
              template: "modern",
            },
            published: false,
          },
        },
      },
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
