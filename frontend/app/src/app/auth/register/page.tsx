import Registration from "components/Registration/Registration";


const page = () => {
  return (
    <>
    <div className="w-full h-screen flex justify-center items-center">

      <div className="font-mont w-96 h-fit p-4  backdrop-blur-lg bg-gray-800 bg-opacity-10  rounded-xl shadow-lg"> 
              <Registration />
    </div>
    </div>
    </>
  );
};

export default page;
