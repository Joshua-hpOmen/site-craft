import Image from "next/image";
import PriceCards from "@/components/site/PriceCards";
import { pricingCards } from "@/lib/constants";
import ExploreCards from "./_components/explor-cards";

export default function Home() {

  const pricCardsHTML = pricingCards.map((item, index) => <PriceCards title={item.title} key={index} description={item.description} price={item.price} features={item.features} priceId={item.priceId}/> )

  const featuresToExploreArr : {heading: string, paragraph: string, link: string}[] = [
    {
      heading: "Website Builder",
      paragraph: " The Website Builder for Agency CRM is a powerful tool designed to streamline the process of creating and managing websites for agencies.\n With its intuitive interface and robust features, agencies can easily build custom websites tailored to their clients&apos; needs without extensive coding knowledge. \nFrom drag-and-drop functionality to seamless integration with CRM systems, this tool empowers agencies to deliver stunning websites efficiently and effectively, ultimately enhancing client satisfaction and driving business growth. ",
      link: "https://sitecraftprod.vercel.app/subaccount/user_2znDwstVW9IFBGfHMXLKipC5qLt/funnels/d02cc4e6-ba81-4f01-886c-e5a9afd3254c/editor/cb3e9595-7470-4810-a708-e6234bd15192"
    },
    {
      heading: "Kanban Board",
      paragraph: "The Kanban Board for pipelines in Agency CRM offers a visual and efficient way for agencies to manage their projects and workflows.\nBy organizing tasks into customizable pipelines, agencies can easily track the progress of projects from start to finish.\nWith features like drag-and-drop functionality and customizable columns, this tool enables teams to prioritize tasks, collaborate effectively, and stay organized, ultimately improving productivity and project delivery.",
      link: "https://sitecraftprod.vercel.app/subaccount/user_2znDwstVW9IFBGfHMXLKipC5qLt/pipelines/f129d0bf-5929-42f8-ad44-ea4e0e5f3993"
    },
    {
      heading: "Leads Dashboard",
      paragraph: "The Leads Dashboard for Agency CRM offers a comprehensive overview of potential opportunities and client interactions, empowering agencies to effectively manage their sales pipeline.\nWith real-time updates and customizable filters, agencies can track leads, prioritize follow-ups, and analyze conversion rates with ease.\nThis feature enhances sales performance by providing actionable insights, enabling agencies to make informed decisions and drive business growth.",
      link: "https://sitecraftprod.vercel.app/subaccount/user_2znDwstVW9IFBGfHMXLKipC5qLt/contacts"
    }
  ]
  return (
    <>
      <div className="relative min-h-full min-w-full flex items-center justify-center flex-col pt-32 scrollHide">
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
      

      <div>

        <div className="flex gap-5 items-center justify-center flex-col">
          <h1 className="font-bold text-3xl">Explore Features</h1>

          <p className="text-muted-foreground text-sm text-center">
            Site-Craft allows agencies to create websites, contact, organize and advertise to customers.
            <br />
            Here are some of the most interesting ones.
          </p>
        </div>

        <br />

        <div className="flex px-5 gap-3">

          <div className="flex flex-col gap-5 w-[30%]">
            {featuresToExploreArr.map((inst, indx) => <ExploreCards key={indx} heading={inst.heading} paragraph={inst.paragraph} link={inst.link}/>)}
          </div>

          <div className="overflow-y-auto scrollHide flex flex-col gap-3 max-h-[800px]">
            <div className="border-2 border-white/10 rounded-md">
              <Image width={1000} height={1000} alt="Image of website" src={"/assets/website_builder.png"} />
            </div>
            <div className="border-2 border-white/10 rounded-md">
              <Image width={1000} height={1000} alt="Image of website" src={"/assets/kanban.png"} />
            </div>
            <div className="border-2 border-white/10 rounded-md">
              <Image width={1000} height={1000} alt="Image of website" src={"/assets/dashboard.png"} />
            </div>
          </div>

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

