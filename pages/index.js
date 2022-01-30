import { promises as fs } from 'fs';
import path from 'path';
import Card from "../components/Card";
import A from '../components/Link';

const Home = ({ posts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
    {
      posts.map((post) => (
        //<A key={post.link} href={`./${post.link}`}>
          <Card title={post.title} description={post.description} key={post.link}/>
        //</A>
      ))
    }
  </div>
)

const getAllPosts = async () => {
  const allDir = path.join(process.cwd(), 'posts');
  const years = await fs.readdir(allDir);
  const posts = [];

  for (const y of years) {
    console.log(y);
    const yearDir = path.join(allDir, y);
    const months = await fs.readdir(yearDir);

    for (const m of months) {
      const monthDir = path.join(yearDir, m);
      const postsDir = await fs.readdir(monthDir);

      for (const p of postsDir) {
        posts.push({
          link: p,
          title: p,
          description: 'Lorem ipsum dolor sit amet.'
        })
      }
    }
  }

  return posts.reverse();
};

const getStaticProps = async () => ({
  props: { posts: await getAllPosts(), },
});

export default Home;
export { getStaticProps };