import Image from "next/image";
import PriceCards from "@/components/site/PriceCards";
import { pricingCards } from "@/lib/constants";

export default function Home() {

  const pricCardsHTML = pricingCards.map((item, index) => <PriceCards title={item.title} key={index} description={item.description} price={item.price} features={item.features} priceId={item.priceId}/> )
  return (
    <>
      <div className="relative min-h-full min-w-full flex items-center justify-center flex-col pt-32">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] lg:bg-[size:40px_54px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"/>

        <p className="text-5xl font-semibold">
          Run All Your Processes IN ONE PLACE
        </p>

        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text">
          <span className="text-9xl font-semibold md:text-[300px]">SiteCraft</span>
        </div>

        <div className="md:mt-[-70px] relative">
            <Image src={'/assets/preview.png'} alt="Banner" className="rounded-t-2xl border-2 border-muted" width={1200} height={1200}/>
        </div>
      </div>

      <div className="mt-10 md:mt-20 pb-12">
        <h2 className="font-bold text-4xl text-center">Choose what fits you right!</h2>

        <p className="text-center text-muted-foreground mt-5">
          Our straight foward pricing plans are tailored to meet your needs. If you are not ready to commit get started for free
        </p>

        <div className="flex flex-col gap-10 justify-center items-center md:flex-row mt-8 md:mt-12">
          {pricCardsHTML}
        </div>
      </div>

    </>
  );
}

