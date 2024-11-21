import { useState } from "react";

const Newchat = ({ isOpen, closeModal }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Input 1:", input1);
    console.log("Input 2:", input2);
    closeModal();
  };

  if (!isOpen) return null;

  return  (
    <div className="w-full fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="relative bg-gray-800 p-6 rounded-xl w-96">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold mb-4">Create New Chat</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white" htmlFor="input1">
              Name
            </label>
            <input
              type="text"
              id="input1"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              className="w-full mt-2 p-2 border text-black rounded"
              placeholder="Search for a user"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white" htmlFor="input2">
              Message:
            </label>
            <input
              type="text"
              id="input2"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              className="w-full mt-2 p-2 border text-black rounded"
              placeholder="write your message"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-violet-primary text-white px-4 py-2 rounded "
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Newchat;
