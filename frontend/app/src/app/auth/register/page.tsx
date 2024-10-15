import Logo from "@/components/Logo/Logo";
import Registration from "components/Registration/Registration";


const page = () => {
  return (
    <>
     <div className="flex flex-col  min-h-screen">
        <Logo />
    <div className="flex-1 flex  justify-center items-center   overflow-hidden "> 
      <Registration />
    </div>
    </div>
    </>
  );
};

export default page;
