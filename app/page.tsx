'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
// import SelectCity from '@/components/UI/select/SelectCity';
// import CustomSelectOrigin from '@/components/UI/select/SelectLocation';
// import SelectDestination from '@/components/UI/select/SelectDestination';
// import ContactUs from '@/components/sections/Contact';

// Images Import
import phone from "../public/assets/phone.svg";
import playStore from "../public/assets/Google play.svg";
import appStore from "../public/assets/AppStore.svg";
import book from "../public/assets/book.svg";
import card from "../public/assets/card.svg";
import flag from "../public/assets/flag.svg";
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';



// const options1 = [
//   { label: 'Options 1', value: '1' },
//   { label: 'Options 2', value: '2' },
//   { label: 'Options 3', value: '3' },
//   { label: 'Options 4', value: ' 4' },
//   { label: 'Options 5', value: '5' },
//   { label: 'Options 6', value: '6' },
//   { label: 'Options 7', value: '7' },
//   { label: 'Options 8', value: '8' },
//   { label: 'Options 9', value: '9' },
//   { label: 'Options 10', value: '10' },
//   { label: 'Options 11', value: '11' },
//   { label: 'Options 12', value: '12' },
//   { label: 'Options 13', value: '13' },
//   { label: 'Options 14', value: '14' },
//   { label: 'Options 15', value: '15' },
//   { label: 'Options 16', value: '16' },
//   { label: 'Options 17', value: '17' },
//   { label: 'Options 18', value: '18' },
//   { label: 'Options 19', value: '19' },
//   { label: 'Options 20', value: '20' },
//   { label: 'Options 21', value: '21' },
//   { label: 'Options 22', value: '22' },
// ]
// const options2 = [
//   { label: 'Options 1', value: '1' },
//   { label: 'Options 2', value: '2'},
//   { label: 'Options 3', value: '3' },
// ]
// const options3 = [
//   { label: 'Option 1', value: '1' },
//   { label: 'Options 2', value: '2' },
//   { label: 'Options 3', value: '3' },
// ]





export default function Home() {

  const [ isMobile, setIsMobile ] = useState<boolean>(false);
  // const [ isMobileGFold, setIsMobileGFold ] = useState<boolean>(false);


  // const [selectCity, setSelectCity] = useState<string>('');
  // const [selectOrigin, setSelectOrigin] = useState<string>('');
  // const [selectDestination, setSelectDestination] = useState<string>('');



  //Hnadlers

  // const handleSelectChangeCity = (newValue: string) => {
  //   setSelectCity(newValue)
  // }

  // const handleSelectChangeOrigin = (newvalue: string) => {
  //   setSelectOrigin(newvalue)
  // }

  // const handleSelectChangeDestination = (newValue: string) => {
  //   setSelectDestination(newValue)
  // }




  useEffect(() => {

     const handleResize = (): void => {
         setIsMobile(window.innerWidth < 430 && window.innerWidth > 290)
     }

     handleResize()

    const handleResizeGFold = (): void => {
        //  setIsMobileGFold(window.innerWidth < 280)

    }

     handleResizeGFold()
  }, [])



  return (

    <>

      <Navbar />

      {/* className={` text-white text-3xl ${isMobile ? 'pgPadding-sm' : 'pgPadding-lg'}`} */}
        <main >

          <section className="bg-bg-home-hero mt-mt-nav object-cover bg-cover bg-no-repeat bg-center min-h-[40rem]">

            <div className="flex flex-row relative justify-center items-center ">

              <div className="bg-ow-white searchRouteBG absolute rounded-lg px-8 py-8 top-36 right-16  w-[25rem]  max-h-[26rem] min-h-[26rem] sm-425:w-[20rem] sm-425:right-10 sm-412:w-[21.7rem] sm-412:right-8 sm-360:!w-[20rem] sm-360:!right-5 sm-375:!w-[20rem] sm-320:!w-[17.2rem] sm-320:!right-6 sm-390:!right-5">
                <div className="text-ow-txt mb-6">
                  <span className="text-xl font-medium sm-320:text-base text-left break-words">Wondering the cost of transportation from anywhere in the country?</span>
                </div>
                <div className="flex flex-col gap-4  ">
                  {/* <SelectCity options={options1} value={selectCity} onChange={handleSelectChangeCity} />
                  <CustomSelectOrigin options={options2} value={selectOrigin} onChange={handleSelectChangeOrigin} />
                  <SelectDestination options={options3} value={selectDestination} onChange={handleSelectChangeDestination} /> */}
                </div>
              </div>
            </div>
          </section>

          {/* 2nd Section */}

          <section className="bgSection2">

            <div className="">

              <div className="flex flex-row  justify-between items-center   sm-412:justify-center sm-412:items-center">
                <div className={` w-[50%]  sm-412:!w-[100%] md-820:w-[100%] md-820:text-center  sm-412:px-[1.8rem]  ${isMobile ? 'px-[1.8rem] py-[4rem]' : 'pgPadding-lg'} `}>
                  <h1 className="text-dark-blue font-bold text-[56px] leading-[1] break-words mb-8 sm-412:text-[45px] ">All trotro live station on  your device</h1>
                  <div className="flex flex-col gap-10">
                    <p className="text-ow-txt font-normal text-xl">Our fare system for trotros and taxis is available at over 48 stations points throughout Ghana. Reaching more towns and stations.</p>
                    <p className="text-ow-txt font-normal text-xl">App on when looking for a partner! You can also find all TROTROs and TAXIs issuing offices in our app.</p>
                  </div>
                </div>
                  <div className="bg-bg-map !min-h-[35rem] w-[50%] object-cover bg-cover bg-no-repeat bg-center sm-412:bg-none sm-412:!w-[0] md-820:w-[0] md-820:bg-none bg"></div>
              </div>

            </div>

          </section>


           {/***********  Trotro Vibes Mobile section  *****************/}

          <section className={`trotroVibes-bg  ${isMobile ? 'px-[1.8rem] py-[4rem]' : 'pgPadding-lg'}`}>
            <div className="flex flex-col ">
              <div className="flex flex-row w-full justify-between  sm-412:flex-col-reverse md-768:flex-col-reverse lg-912:flex-col-reverse lg-912:gap-8">
                  <div className="w-[30%] sm-412:w-full md-768:w-full lg-912:w-full sm-412:gap-8 lg-912:gap-8 ">
                      <Image
                        alt='Trotro Live Mobile App'
                        src={phone}
                        className="sm-412:w-[50vw] md-768:w-[30vw] lg-912:w-[30vw] mx-auto md-768:mx-auto"
                      />
                  </div>
                  <div className="w-[50%]  sm-412:w-full md-768:w-full lg-912:w-full">
                    <h2 className="text-dark-blue text-[56px] font-bold sm-412:text-center sm-412:leading-[1.15] mb-5 md-540:text-center leading-[1.12] lg-912:text-center">Best city guide for Trotro rides!</h2>
                    <p className="text-ow-txt text-lg font-normal sm-412:text-center">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid aliquam quae sint quam magni maxime sequi, architecto dignissimos vitae mollitia.</p>
                    <div className="!w-full flex justify-start gap-8 mt-5 sm-412:flex-col sm-412:items-center md-540:items-center lg-912:flex-row lg-912:justify-center lg-912:items-center lg-912:flex ">
                      <Image
                        alt="Play Store Icon"
                        src={playStore}

                        className="w-[15rem] sm-412:w-[13rem] lg-1024:w-[10rem] lg-912:w-[10rem]"
                      />
                      <Image
                        alt="App Store Icon"
                        src={appStore}
                        className="w-[15rem] sm-412:w-[13rem] lg-1024:w-[10rem] lg-912:w-[10rem]"
                      />
                    </div>
                    <div className="mt-5 ">
                      <h3 className="text-dark-blue font-bold text-2xl mb-3">Features</h3>
                      <ul className="text-ow-txt ml-10 leading-7 text-lg font-normal">
                        <li className="list-disc">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur, tempore.</li>
                        <li className="list-disc">Lorem ipsum dolor sit amet consectetur adipisicing elit. At, doloremque.</li>
                        <li className="list-disc">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam, inventore?</li>
                      </ul>
                    </div>

                  </div>
              </div>
              <div className="flex flex-row gap-16 mt-12 sm-412:flex-col md-768:gap-8 lg-912:gap-8 md-540:flex-col md-540:gap-5">
                <div className="">
                  <Image
                    alt='Book Icon'
                    src={book}
                    className="mb-4"
                  />
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="text-dark-blue text-2xl font-bold mb-2">Get all stattions</h3>
                    <p className="text-ow-txt">Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, nulla!</p>
                  </div>
                </div>
                <div className="">
                  <Image
                    alt='Book Icon'
                    src={card}
                    className="mb-4"
                  />
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="text-dark-blue text-2xl font-bold mb-2">Available Fares</h3>
                    <p className="text-ow-txt">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, quod.</p>
                  </div>
                </div>
                <div className="">
                  <Image
                    alt='Book Icon'
                    src={flag}
                    className="mb-4"
                  />
                  <div className="flex flex-col justify-start items-start">
                    <h3 className="text-dark-blue text-2xl font-bold mb-2">Find missing item</h3>
                    <p className="text-ow-txt">Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, iste!</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/*****************  Contact Us Section *******************/}
          <section id="contact-us" className={` bg-primary-yellow-light ${isMobile ? 'px-[1.8rem] py-[4rem]' : 'pgPadding-lg'}`}>
            {/* <ContactUs /> */}
          </section>

        </main>

        <Footer />
    </>

  )
}
