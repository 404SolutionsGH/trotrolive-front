import { SiteHeader } from "@/components/site-header";
import Footer from "@/components/footer";
import HomePageBody from "@/components/HomePageBody";

export default async function Home() {
  const res = await fetch("https://api.trotro.live/api/stations/?format=json");

  if (!res.ok) {
    throw new Error("Failed to fetch stations");
  }

  const { results } = (await res.json()) as StationsApiResponse;

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <HomePageBody stations={results} />
      <Footer />
    </div>
  );
}
