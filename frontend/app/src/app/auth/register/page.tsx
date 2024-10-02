import Logo from "@/components/Logo/Logo";
import Registration from "components/Registration/Registration";


const page = () => {
  return (
    <>
    <div className="h-16">
      <Logo/>
    </div>
    <div className="flex justify-center items-center h-screen w-full"> 
      <Registration />
    </div>
    </>
  );
};

export default page;
