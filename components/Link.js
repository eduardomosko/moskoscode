import Link from "next/link"

const A = ({ href, children, ...props }) => (
    <Link href={href}><a href={href} {...props}>{children}</a></Link>
)

export default A;