import { NextResponse } from "next/server"
import { env } from "../../../../../src/server/env"
export async function GET() {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${
    env.GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    "http://localhost:3000/api/auth/github/callback"
  )}&scope=user:email`

  return NextResponse.redirect(githubAuthUrl)
} 