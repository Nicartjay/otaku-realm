import HyperScroll from '../components/HyperScroll.jsx'
import FeaturedScroll from '../components/FeaturedScroll.jsx'
import FeaturedAnime from '../components/FeaturedAnime.jsx'
import CharacterShowcase from '../components/CharacterShowcase.jsx'
import Timeline from '../components/Timeline.jsx'
import QuotesCarousel from '../components/QuotesCarousel.jsx'
import RubikCube from '../components/RubikCube.jsx'

export default function Home({ autoScroll }) {
  return (
    <>
      <HyperScroll autoScroll={autoScroll} />
      <FeaturedScroll />
      <FeaturedAnime />
      <CharacterShowcase />
      <RubikCube />
      <Timeline />
      <QuotesCarousel />
    </>
  )
}
