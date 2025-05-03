import Link from "next/link";
import Log from "../../../public/Logo1.png";

const Logo = () => {
  return (
    <>
<div className=" top-0 left-0">
  <Link href="/">
  <img 
    src={Log.src}
    alt="Logo" 
    width="100"
    height="50"
    className="pt-3 mr-6 lg:mr-0 lg:p-4"
  />
  </Link>
</div>
</>
  )
}

export default Logo;