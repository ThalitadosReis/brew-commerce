import { NextResponse } from "next/server";
import { withAdmin } from "@/middleware/auth";

export const GET = withAdmin(async (req) => {
  return NextResponse.json({
    success: true,
    user: req.user,
  });
});
