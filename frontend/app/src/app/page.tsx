import Landingpage from "components/Landingpage/Landingpage";
import Logo from "@/components/Logo/Logo";
export default function Home() {
  return (
    <>
    <div className="flex flex-col  min-h-screen">
        <Logo />
    <div className="flex-1 flex justify-center items-center overflow-hidden ">
      <Landingpage />
    </div>
    </div>
    </>
  );
}
