import Logo from "@/components/Logo/Logo";
import LoginForm from "components/login/LoginForm";

const loginPage = () => {
  return (
    <>
      <div className="flex flex-col  min-h-screen">
        <Logo />
        <div className="flex-1 flex justify-center items-center overflow-hidden ">
          <LoginForm />
        </div>
      </div>
    </>
  );
};

export default loginPage;
