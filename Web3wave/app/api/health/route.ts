import { GET as getHealth } from "../../health/route";

export async function GET() {
  return getHealth();
}
