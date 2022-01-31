import { promises as fs } from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const Post = ({ text, title, found }) => found ? (
    <>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: text, }}></div>
    </>
) : (<h1>404 :(</h1>);

const getPostFile = async (post) => {
    const allDir = path.join(process.cwd(), 'posts');
    const years = await fs.readdir(allDir);

    for (const y of years) {
        const yearDir = path.join(allDir, y);
        const months = await fs.readdir(yearDir);

        for (const m of months) {
            const monthDir = path.join(yearDir, m);
            const postsDir = await fs.readdir(monthDir);

            const postFile = postsDir.find((p) => {
                return p === post
            });

            if (!!postFile)
                return path.join(monthDir, postFile, 'post.md');

        }
    }

    return null;
};

const getPostInfo = async (post) => {
    const postFile = await getPostFile(post);
    let text = '';
    let found = false;
    let data = {
        title: null,
    };

    try {
        if (postFile !== null) {
            found = true;

            text = await fs.readFile(postFile, { encoding: 'utf-8' });
            data = matter(text)
            text = await remark().use(remarkHtml).process(data.content);
            text = text.toString();
            data = data.data;
        }
    } catch { }

    return {
        title: data.title,
        text,
        found,
    }
}

const getStaticProps = async ({ params: { post } }) => ({
    props: await getPostInfo(post),
    revalidate: false,
});

const getStaticPaths = async () => ({ paths: [], fallback: 'blocking' })

export default Post;
export { getStaticProps, getStaticPaths };