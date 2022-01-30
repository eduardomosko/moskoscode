
const Card = ({ image, title, description }) => {
    const num = parseInt(Math.random() * 3);

    return (
        <div className={`transition-all group rounded-3xl hover:rounded-xl m-2 text-white ${['gradient-1', 'gradient-2', 'gradient-3'][num]}`}>
            {/* <div className="transition-all m-3 rounded-3xl group-hover:rounded-lg overflow-hidden bg-white" ref={ref}>
                <Image src='https://pixy.org/src/21/219269.jpg' layout="responsive" height='150' width={bounds.width} className="object-cover" />
            </div> */}
            <div className="m-3">
                <h1 className="text-xl"><b>{title}</b></h1>
                <span className="text-white m-1">{description}</span>
            </div>
        </div>
    );
};

export default Card;