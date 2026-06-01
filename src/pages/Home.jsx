import Hero from '../components/Hero.jsx'
import FeaturedScroll from '../components/FeaturedScroll.jsx'
import FeaturedAnime from '../components/FeaturedAnime.jsx'
import CharacterShowcase from '../components/CharacterShowcase.jsx'
import Timeline from '../components/Timeline.jsx'
import QuotesCarousel from '../components/QuotesCarousel.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedScroll />
      <FeaturedAnime />
      <CharacterShowcase />
      <Timeline />
      <QuotesCarousel />
    </>
  )
}
