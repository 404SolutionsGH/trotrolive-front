import Image from "next/image";
import { Button } from "@/components/ui/button";
import Support from "../../../components/support";
import { TeamCard } from "@/components/team-card";
import { StatCard } from "@/components/stat-card";
import aboutHero from "../../../public/assets/about-hero.png";
import Godfred from "../../../public/assets/godfredAddai.png"
import Hilda from "../../../public/assets/hildaAmoah.png"
import Baba from "../../../public/assets/baba-abdul.png"
import Nana from "../../../public/assets/nana-asamoah.png"


const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-[#FFF8F0] pt-16">
        <div className="container mx-auto grid lg:grid-cols-2 gap-8 p-10 items-center">
          <div>
            <h1 className="text-7xl lg:text-5xl font-bold text-[#0A2342] mb-4">
              We build bridges between stations and passengers
            </h1>
          </div>
          <div>
            <p className="text-[#4A5568] mb-5">
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the
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

      {/* Together we are strong Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-12">
            <div className="w-[50%]">
              <h2 className="text-5xl font-bold text-[#0A2342] mb-4">
                Together we are strong
              </h2>
            </div>
            <div>
              <p className="text-[#4A5568] mb-6">
                Our crew is always getting bigger, but we all work toward one goal: to make transportation success and possible everywhere.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu.
              </p>
            </div>
            <div className="py-16">
              <div className="flex items-center gap-4">
                <Image
                  src={Godfred}
                  alt="Godfred Addai"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-[#0A2342]">Godfred Addai</p>
                  <p className="text-sm text-[#4A5568]">Founder & CEO</p>
                </div>
              </div>
            </div>

            <div>
              <blockquote className="text-xl font-medium text-[#0A2342]">
                &quot;Our goal is to build systems that give passengers and stations the ability to create fruitful and enduring relations with each other&quot;
              </blockquote>
            </div>
          </div>

          <hr className="w-[90%] mx-auto border-gray-300 mt-10 py-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard value="402+" description="It has survived not only five centuries, but also the leap into electronic typesetting." />
            <StatCard value="368+" description="It has survived not only five centuries, but also the leap into electronic typesetting." />
            <StatCard value="11K+" description="It has survived not only five centuries, but also the leap into electronic typesetting." />
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
      {/* </section> */}

      <hr className="w-[90%] mx-auto bg-[#FFF0F7] border-gray-300 mt-16 pb-16" />

      {/* Join Team Section */}
      {/* <section className="py-16 bg-[#FFF0F7]"> */}
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="justify-left">
              <h2 className="text-4xl font-bold text-[#0A2342] mb-4">
                Join our team
              </h2>
            </div>
            <div className="justify-right">
              <p className="text-[#4A5568] mb-6">
                We believe it takes great people to make a great product. That&apos;s why we hire not only the perfect professional, but people who embody our company&apos;s values.
              </p>
              <Button variant="link" className="text-[#D6246E] p-0">
                See open positions →
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Support />
    </div>
  );
};

export default About;
