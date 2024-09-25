import Logo from "@/components/Logo/Logo";
import LoginForm from "components/login/LoginForm";

const loginPage = () => {
  return (
    <>
        <div className=" h-16">
          <Logo/>
        </div>
        <LoginForm />
    </>
  );
};

export default loginPage;
