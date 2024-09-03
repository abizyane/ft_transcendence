import Image from "next/image"
import Link from "next/link";

const Logo = () => {
  return (
    <>
<div className="absolute z-50 flex items-center top-0 left-0 ml-2 mt-2">
  <Link href="/">
    <Image
      src="https://res.cloudinary.com/dwxvnezhn/image/upload/f_auto,q_auto/v1/pics/nbs3tv67mny656ohbayx"
      alt="Logo"
      width={80}
      height={50}
    />
  </Link>
</div>
</>
  )
}

export default Logo;