import A from "./Link";

const Card = ({ title, description, link }) => {
    const num = parseInt(Math.random() * 3);

    return (
        <A className={`p-4 transition-all group rounded-3xl hover:rounded-xl text-white ${['gradient-1', 'gradient-2', 'gradient-3'][num]}`} href={link}>
            <h1 className="text-xl"><b>{title}</b></h1>
            <span className="text-white m-1">{description}</span>
        </A>
    );
};

export default Card;