import React, { useState } from "react";

const VisaProcessing = ({ userRole }) => {
  const countries = [
    "USA",
    "Japan",
    "Indonesia",
    "UK",
    "Australia",
    "Canada",
    "Malaysia",
    "Thailand",
  ];
  const [selectedCountry, setSelectedCountry] = useState("USA");

  const [ds160Form, setDs160Form] = useState({
    name: "",
    email: "",
    applicationId: "",
    surname: "",
    birthYear: "",
    motherName: "",
  });

  const [usVisaForm, setUsVisaForm] = useState({
    username: "",
    password: "",
    question1: "",
    question2: "",
    question3: "",
  });

  const [generalForm, setGeneralForm] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const [submittedVisas, setSubmittedVisas] = useState([]);

  const handleDS160Change = (e) =>
    setDs160Form({ ...ds160Form, [e.target.name]: e.target.value });
  const handleUsVisaChange = (e) =>
    setUsVisaForm({ ...usVisaForm, [e.target.name]: e.target.value });
  const handleGeneralChange = (e) =>
    setGeneralForm({ ...generalForm, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    let newEntry = { country: selectedCountry };

    if (selectedCountry === "USA") {
      newEntry = {
        ...newEntry,
        ds160: ds160Form,
        usVisa: usVisaForm,
      };
    } else {
      newEntry = {
        ...newEntry,
        form: generalForm,
      };
    }

    setSubmittedVisas((prev) => [...prev, newEntry]);
    setDs160Form({
      name: "",
      email: "",
      applicationId: "",
      surname: "",
      birthYear: "",
      motherName: "",
    });
    setUsVisaForm({
      username: "",
      password: "",
      question1: "",
      question2: "",
      question3: "",
    });
    setGeneralForm({
      name: "",
      email: "",
      phone: "",
      username: "",
      password: "",
    });
    alert("Visa information submitted!");
  };

  if (userRole !== "admin" && userRole !== "employee") {
    return (
      <div className="text-red-500 text-center mt-10 text-lg font-semibold">
        ❌ HR is not authorized to access Visa Processing.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Visa Processing</h2>

      {/* Country Selector */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Select Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full max-w-md border rounded px-3 py-2"
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        {/* USA Form */}
        {selectedCountry === "USA" && (
          <>
            {/* DS-160 Section */}
            <fieldset className="border border-gray-300 p-4 rounded">
              <legend className="text-md font-semibold text-blue-600">
                Retrieve DS-160 Application
              </legend>
              {[
                { name: "name", label: "Name" },
                { name: "email", label: "Email" },
                { name: "applicationId", label: "Application ID" },
                { name: "surname", label: "First 5 letters of Surname" },
                { name: "birthYear", label: "Year of Birth" },
                { name: "motherName", label: "Mother's Given Name" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={ds160Form[name]}
                    onChange={handleDS160Change}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              ))}
            </fieldset>

            {/* US Visa Payment Section */}
            <fieldset className="border border-gray-300 p-4 rounded">
              <legend className="text-md font-semibold text-blue-600 mt-4">
                US Visa Payment & Date
              </legend>
              {[
                { name: "username", label: "Username" },
                { name: "password", label: "Password" },
                { name: "question1", label: "Security Question 1" },
                { name: "question2", label: "Security Question 2" },
                { name: "question3", label: "Security Question 3" },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label className="block font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    name={name}
                    value={usVisaForm[name]}
                    onChange={handleUsVisaChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              ))}
            </fieldset>
          </>
        )}

        {/* Other Country Form */}
        {selectedCountry !== "USA" && (
          <fieldset className="border border-gray-300 p-4 rounded">
            <legend className="text-md font-semibold text-blue-600">
              {selectedCountry} Visa Form
            </legend>
            {[
              { name: "name", label: "Name" },
              { name: "email", label: "Email" },
              { name: "phone", label: "Phone" },
              { name: "username", label: "Username" },
              { name: "password", label: "Password" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block font-medium mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={generalForm[name]}
                  onChange={handleGeneralChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            ))}
          </fieldset>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Visa Info
        </button>
      </form>
      {submittedVisas.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-4">
            Submitted Visa Applications
          </h3>
          <div className="space-y-6">
            {submittedVisas.map((entry, index) => (
              <div key={index} className="bg-white border rounded shadow p-4">
                <p className="font-bold text-blue-700 mb-2">
                  {index + 1}. Country: {entry.country}
                </p>

                {entry.country === "USA" ? (
                  <>
                    <p className="font-semibold text-gray-700">
                      DS-160 Application:
                    </p>
                    <ul className="ml-4 list-disc">
                      {Object.entries(entry.ds160).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ))}
                    </ul>

                    <p className="font-semibold text-gray-700 mt-2">
                      US Visa Payment Info:
                    </p>
                    <ul className="ml-4 list-disc">
                      {Object.entries(entry.usVisa).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-gray-700">
                      General Visa Info:
                    </p>
                    <ul className="ml-4 list-disc">
                      {Object.entries(entry.form).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaProcessing;
