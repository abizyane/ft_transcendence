import Image from "next/image"
import Link from "next/link";

const Logo = () => {
  return (
    <>
<div className=" top-0 left-0">
  <Link href="/">
  <img 
    src="https://res.cloudinary.com/dwxvnezhn/image/upload/f_auto,q_auto/v1/pics/nbs3tv67mny656ohbayx" 
    alt="Logo" 
    width="80" 
    height="50"
  />
  </Link>
</div>
</>
  )
}

export default Logo;