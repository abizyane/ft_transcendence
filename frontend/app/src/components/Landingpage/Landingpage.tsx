import Image from "next/image";
import Link from "next/link";

const Landingpage = () => {
  return (
    <>
      <div className="font-mont text-center flex flex-col space-y-6 m-4 p-10 items-center overflow-hidden justify-center w-full ">
        <h1 className="text-4xl font-bold text-white">ASTRO PONG</h1>
        <p className=" text-white">
          Astro Pong is the ultimate destination for pong enthusiasts looking to
          showcase their skills and compete against the best. This website
          offers a thrilling platform for players to participate in exciting
          pong tournaments and engage with a vibrant community of fellow pong
          enthusiasts.
        </p>
        <div className="bg-violet-primary rounded-xl">
          <Link href="auth/login">
            <button className="purple_button">Join Now</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Landingpage;
