import Landingpage from "components/Landingpage/Landingpage";
import Logo from "@/components/Logo/Logo";
export default function Home() {
  return (
    <>
    <div className="flex flex-col  min-h-screen">

    <div className=" overflow-hidden">
        <Logo />
    </div>
    <div className="flex-1 flex justify-center items-center overflow-hidden ">
      <Landingpage />
    </div>
    </div>
    </>
  );
}
