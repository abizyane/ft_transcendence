import Image from "next/image";
import bar from "../../../public/Bar.svg";
import notification from "../../../public/Notification.svg";

const Navbar = () => {
  return (
    <>
      <nav className="absolute right-0 top-0 m-4 h-10 rounded-xl z-10">

        <div className="flex justify-end space-x-4">
          <div className=" bg-black rounded-md w-12 h-12 flex justify-center items-center space-x-24">
            <Image
              src={notification}
              alt="Notification"
              className="w-7 h-7"
              width={48}
              height={48}
            />
          </div>
          <div className=" bg-black rounded-md w-12 h-12 flex justify-center items-center">
            <Image
              src={bar}
              alt="bar"
              className="w-7 h-7"
              width={48}
              height={48}
            />
          </div>
          
        </div>
      </nav>
    </>
  );
};

export default Navbar;
