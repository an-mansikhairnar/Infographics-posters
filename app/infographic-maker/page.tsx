import AiBannerSection from "../component/AiBannerSection/AiBannerSection"
import HeroSection from "../component/BannerSection/BannerSection"
import FlexibleStartSection from "../component/IntroductionSection/IntroductionSection"
import PricingSection from "../component/PricingSection/PricingSection"
import StepsSection from "../component/StepSection/StepSection"

export default function InfographicsHome(){
  return (
    <>
      <HeroSection/>
      <FlexibleStartSection />
      <StepsSection />
      <AiBannerSection/>
      {/* <PricingSection/> */}
    </>
  )
}