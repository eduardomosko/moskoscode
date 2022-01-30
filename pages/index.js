import Card from "../components/Card";

const cards = [
  {
    title: "Hello, World",
    description: "Lorem impsum dolor sit amed.",
  },
  {
    title: "Hello, World",
    description: "Lorem impsum dolor sit amed.",
  },
  {
    title: "Hello, World",
    description: "Lorem impsum dolor sit amed.",
  },
]

const Home = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
      {
        cards.map((c, i) => (
          <>
            <Card {...c} key={i} />
            <Card {...c} key={i} />
            <Card {...c} key={i} />
            <Card {...c} key={i} />
            <Card {...c} key={i} />
            <Card {...c} key={i} />
          </>
        ))
      }
    </div>
  </>
)

export default Home;