import Logo from "@/components/Logo/Logo";
import Registration from "components/Registration/Registration";


const page = () => {
  return (
    <>
    <div className="h-16">
      <Logo/>
    </div>
    <div className="flex justify-center items-center min-h-screen w-full mb-2"> 
      <Registration />
    </div>
    </>
  );
};

export default page;
