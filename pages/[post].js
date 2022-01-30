import { promises as fs } from 'fs';
import path from 'path';

const Post = ({ text }) => (
    <div>
        {text}
    </div>
);

const getPostFile = async (post) => {
    const allDir = path.join(process.cwd(), 'posts');
    const years = await fs.readdir(allDir);

    for (const y of years) {
        console.log(y);
        const yearDir = path.join(allDir, y);
        const months = await fs.readdir(yearDir);

        for (const m of months) {
            const monthDir = path.join(yearDir, m);
            const postsDir = await fs.readdir(monthDir);
            console.log('  ' + m);

            const postFile = postsDir.find((p) => {
                console.log('    ' + p);
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

    if (postFile !== null) {
        found = true;
        
        text = await fs.readFile(postFile, {encoding: 'utf-8'});
    }

    return {
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