import A from "./Link";
import { FiMenu } from "react-icons/fi";
import React from "react";
import { useSpring, animated } from "react-spring";
import useMeasure from "react-use-measure";


const Header = () => {
    const [bind, bounds] = useMeasure();
    const [isCollapsed, setCollapsed] = React.useState(true);
    const { opacity, height } = useSpring({
        from: {
            opacity: 0,
            height: 0,
        },
        to: {
            opacity: 1,
            height: bounds.height,
        },
        reverse: isCollapsed,
    });

    const toggleCollapsed = () => {
        setCollapsed(!isCollapsed)
    }

    return (
        <header className="p-4 z-1 w-full">
            <div className="content-center">
                <div className="flex flex-row">
                    <div id="title">
                        <A href="/"><h1 className="text-gray-800 text-2xl">Moskos&apos; <span className="text-cyan-900">CodeField</span></h1></A>
                    </div>
                    <div className="flex-grow"></div>
                    <div id="menu">
                        <button onClick={toggleCollapsed} className="p-1"><FiMenu /></button>
                    </div>
                </div>

                <animated.div style={{ overflow: "hidden", height, opacity }}>
                    <animated.ul className="transition-all text-center grid" ref={bind}>
                        <li className="m-1"><A href="https://github.com/eduardomosko/moskoscode">github</A></li>
                    </animated.ul>
                </animated.div>

            </div>
        </header>

    );
};

export default Header;
