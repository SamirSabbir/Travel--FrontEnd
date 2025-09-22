import React from "react";

const SalaryModal = ({ data, onClose }) => {
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
          Trip & Travel - Salary Certificate
        </h2>

        <div className="border p-6 rounded-lg bg-gray-50">
          <p className="font-bold">PRIVATE & CONFIDENTIAL</p>
          <p className="mt-2">To whom it may concern,</p>
          <p className="mt-2">Re: {data.name}</p>

          <p className="mt-4">
            Further to your recent reference enquiry, I can confirm that{" "}
            <span className="font-semibold">{data.name}</span> is a regular
            full-time employee at Trip & Travel.
          </p>
          <p className="mt-2">
            {data.name} is employed as a{" "}
            <span className="font-semibold">{data.position}</span> with Trip &
            Travel on{" "}
            <span className="font-semibold">{data.joiningDate}</span>. I can
            also confirm that the monthly salary is{" "}
            <span className="font-semibold">Tk {data.monthlySalary}</span>.
          </p>

          <p className="mt-4">
            The above information is given in the strictest confidence and
            should not be divulged to any third party.
          </p>

          <p className="mt-4">Yours sincerely,</p>
          <p className="font-semibold">{data.name}</p>
          <p>{data.email}</p>
        </div>
      </div>
    </div>
  );
};

export default SalaryModal;
