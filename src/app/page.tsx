import { HomeClient } from "@/components/HomeClient";
import { runIngestion } from "@/adapters";
import type { UserContext } from "@/lib/types";

const DEFAULT_CTX: UserContext = {
  lat: 34.7692,
  lng: 137.3915,
  budgetYen: 3000,
  maxWalkMinutes: 60,
  rainOk: true,
  mood: "bored",
};

export default async function Page() {
  const result = await runIngestion(DEFAULT_CTX);
  return <HomeClient events={result.events} adapters={result.adapters} />;
}
