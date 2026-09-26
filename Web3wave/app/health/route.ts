import { NextResponse } from "next/server";

export async function GET() {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5004/api";
  const backendBaseUrl = rawApiUrl.replace(/\/api\/?$/, "");

  let backendStatus = "UNKNOWN";
  let backendData: any = null;

  try {
    const res = await fetch(`${backendBaseUrl}/health`, {
      cache: "no-store",
      headers: {
        "Accept": "application/json",
      },
    });

    if (res.ok) {
      backendStatus = "UP";
      backendData = await res.json().catch(() => null);
    } else {
      backendStatus = `DEGRADED (${res.status})`;
    }
  } catch (_err) {
    backendStatus = "UNREACHABLE";
  }

  return NextResponse.json(
    {
      success: true,
      status: "UP",
      service: "Web3Wave Platform",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "production",
      backend: {
        status: backendStatus,
        details: backendData,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  );
}
