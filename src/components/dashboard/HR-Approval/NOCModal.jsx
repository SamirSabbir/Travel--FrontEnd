import React from "react";

const NOCModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-2/3 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        <h2 className="text-xl font-semibold text-center mb-4">
          Trip & Travel - No Objection Certificate
        </h2>

        <div className="border p-6 rounded-lg bg-gray-50">
          <p className="font-bold">PRIVATE & CONFIDENTIAL</p>
          <p className="mt-2">To whom it may concern,</p>
          <p className="mt-2">Re: {data.name}</p>

          <p className="mt-4">
            This is to certify that{" "}
            <span className="font-semibold">{data.name}</span>, bearing passport
            no <span className="font-semibold">{data.passportNumber}</span>, has
            been working in Trip & Travel since{" "}
            <span className="font-semibold">{data.joiningDate}</span>. He is an
            employee of our organization and is currently working as{" "}
            <span className="font-semibold">{data.position}</span>.
          </p>

          <p className="mt-2">
            He intends to visit{" "}
            <span className="font-semibold">{data.country}</span> for{" "}
            <span className="font-semibold">{data.purpose}</span>.
          </p>

          <p className="mt-4">Yours sincerely,</p>
          <p className="font-semibold">{data.name}</p>
          <p>{data.email}</p>
        </div>
      </div>
    </div>
  );
};

export default NOCModal;
