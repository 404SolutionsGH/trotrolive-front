import Image from "next/image";
import Support from "../../../components/support";
import { TeamCard } from "@/components/team-card";
import { StatCard } from "@/components/stat-card";
import { SiteHeader } from "@/components/site-header"; // Import the SiteHeader component
import aboutHero from "../../../public/assets/about-hero.png";
import Godfred from "../../../public/assets/godfredAddai.png";
import Hilda from "../../../public/assets/hildaAmoah.png";
import Baba from "../../../public/assets/baba-abdul.png";
import Nana from "../../../public/assets/nana-asamoah.png";

export const About = () => {
  return (
    <div className="bg-white">
      {/* Include the SiteHeader */}
      <SiteHeader />

      {/* Hero Section */}
      <section className="bg-[#FFF8F0] pt-16">
        <div className="container mx-auto grid lg:grid-cols-2 gap-8 p-10 items-center">
          <div>
            <h1 className="text-7xl lg:text-5xl font-bold text-[#0A2342] mb-4">
              We build bridges between passengers, drivers, and station masters
            </h1>
          </div>
          <div>
            <p className="text-[#4A5568] mb-5">
              At Trotro.Live, we aim to revolutionize public transportation in Ghana and beyond by fostering connections and improving efficiency in the trotro ecosystem.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full pb-10">
        <Image
          src={aboutHero}
          alt="Team collaboration"
          width={600}
          height={300}
          className="w-full"
        />
      </div>

      <hr className="w-[90%] mx-auto border-gray-500 mt-10 pt-5" />

      {/* DAO System Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="w-[50%]">
              <h2 className="text-5xl font-bold text-[#0A2342] mb-4">
                Empowering through transparency
              </h2>
            </div>
            <div>
              <p className="text-[#4A5568] mb-6">
                The Trotro.Live App improves price transparency and reduces information asymmetry between passengers and drivers. This leads to efficient fare negotiations, reducing overcharging and disputes. Our peer-to-peer parcel sending service enables faster and more convenient deliveries, benefiting businesses and individuals alike.
              </p>
              <p className="text-[#4A5568] mb-6">
                Users who contribute valuable trotro data, such as fares and routes, earn tokens, fostering a decentralized and community-driven ecosystem.
              </p>
            </div>
            <Image
              src="/assets/alxo.png"
              alt="Economic Impact"
              width={600}
              height={300}
              className="w-full"
            />
          </div>

          <blockquote className="text-xl font-medium text-[#0A2342]">
            &quot;In five years, we aim to digitalize transportation information nationwide, with an efficient, well-monitored Peer-to-Peer parcel sending system,&quot; says Godfred Addai Amoako, Founder and CEO of Trotro.Live.
          </blockquote>
        </div>
      </section>

      <hr className="w-[90%] mx-auto border-gray-300 mt-10 py-10" />

      {/* Economic Impact Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-[#0A2342] mb-12">
            Driving economic growth
          </h2>
          <p className="text-[#4A5568] mb-6">
            By creating employment opportunities and stimulating economic activity in logistics and e-commerce, Trotro.Live contributes to economic growth. Our platform saves time and costs for passengers and businesses alike.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard value="1402+" description="Routes and fares digitized for transparency." />
            <StatCard value="8+" description="Successful peer-to-peer parcel deliveries." />
            <StatCard value="9K+" description="Active users in past demos." />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-[#FFF0F7] py-16">
        <div className="container mx-auto">
          <h2 className="w-[50%] text-4xl font-bold text-[#0A2342] mb-12">
            Meet our <br />amazing team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamCard
              name="Godfred Addai"
              role="Founder & CEO"
              image={Godfred}
            />
            <TeamCard
              name="Hilda Amoah"
              role="Co-founder"
              image={Hilda}
            />
            <TeamCard
              name="Baba Abdul"
              role="Software Engineer"
              image={Baba}
            />
            <TeamCard
              name="Nana Asamoah"
              role="Frontend Engineer"
              image={Nana}
            />
          </div>
        </div>
      </section>

      <hr className="w-[90%] mx-auto bg-[#FFF0F7] border-gray-300 mt-16 pb-16" />

      {/* Support Section */}
      <section className="py-16 bg-[#FFF0F7]">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="justify-left">
              <h2 className="text-4xl font-bold text-[#0A2342] mb-4">
                Supported by
              </h2>
              <p className="text-[#4A5568] mb-6">
                We are proudly supported by ALX Ventures, EU Digilogic, and GPRTU, who share our vision of transforming public transportation in Ghana.
              </p>
            </div>
            <div className="justify-right">
              <Image
                src="/assets/supportedlogos.png"
                alt="Support logos"
                width={400}
                height={200}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Support />
    </div>
  );
};