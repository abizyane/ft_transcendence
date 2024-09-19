import solo from "../../../../public/solo.jpeg";
import multiplayers from "../../../../public/multiplayers.jpeg";

const Page = () => {
    return (
        <>
            <div className=" bg-gray-800 bg-opacity-60 rounded-xl flex flex-col gap-4 border-[1px] border-violet-primary  md:gap-6  mb-10 w-full justify-center items-center md:flex-row ">
                <div className="min-w-[200px] max-w-[350px] m-2 mt-8 md:mt-2 h-1/2 flex flex-col rounded-2xl border-4 border-violet-primary">
                    <div className="h-3/4">
                        <img src={solo.src} alt="mode solo" className="w-full h-full object-cover rounded-t-xl" />
                    </div>
                    <div className="bg-black h-1/4 text-center font-bold text-white rounded-b-xl">
                        Mode Solo
                    </div>
                </div>
                <div className="bg-gray-500 min-w-[200px] max-w-[350px] m-2 h-1/2 flex flex-col rounded-2xl mb-8 md:mb-2 border-4 border-violet-primary">
                    <div className="h-3/4">
                        <img src={multiplayers.src} alt="mode multiplayers" className="w-full h-full object-cover rounded-t-xl" />
                    </div>
                    <div className="bg-black h-1/4 text-center font-bold text-white rounded-b-xl">
                        Mode Tournements
                    </div>
                </div>
            </div>

        </>
    );
}

export default Page;
