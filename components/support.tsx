// import Link from 'next/link'
import Image from "next/image"
import contact from "../public/assets/pexels-picha-stock-3894377 1.jpg"
// import { Button } from "@/components/ui/button"

const Support = () => {
  return (
    <section className="bg-[#FFF8F0] py-16">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-7xl font-extrabold mb-6">Have a question? Our team is happy to assist you</h1>
              <p className="text-gray-600 mb-6 py-10">
                Ask about TrotroLive  product, implementation or anything else. Our highly trained reps are standing by, ready to help.
              </p>
              <hr className="border-black mb-8"/>
              {/* <div className="flex gap-4 items-center py-5">
                <Button className="bg-pink-500 hover:bg-pink-600">Contact Us</Button>
                <div className="flex items-center gap-2">
                  <span>or call</span>
                  <Link href="tel:0556516391" className="text-pink-500 font-semibold underline">
                    0556 516 391
                  </Link>
                </div>
              </div> */}
            </div>
            <Image
              src={contact}
              alt="Customer support representative"
              width={450}
              height={300}
              className="rounded-lg justify-center mx-auto"
            />
          </div>
        </section>
  )
}

export default Support