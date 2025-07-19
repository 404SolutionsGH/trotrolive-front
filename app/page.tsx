import { SiteHeader } from "@/components/site-header";
import Footer from "@/components/footer";
import HomePageBody from "@/components/HomePageBody";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <HomePageBody />
      <Footer />
    </div>
  );
}
