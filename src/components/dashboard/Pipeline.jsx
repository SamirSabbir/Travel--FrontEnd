import React from "react";

const Pipeline = ({ userRole }) => {
  // Dummy customer + status data (will later come from backend)

  /* useEffect(() => {
  fetch("/api/pipeline") // your backend endpoint
    .then(res => res.json())
    .then(data => setPipelineData(data));
}, []);
*/
  const pipelineData = [
    {
      id: 1,
      name: "Alice",
      phone: "01711-123456",
      status: "Completed",
    },
    {
      id: 2,
      name: "Bob",
      phone: "01822-654321",
      status: "Pending More Info",
    },
    {
      id: 3,
      name: "Charlie",
      phone: "01555-999888",
      status: "Draft",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pipeline Overview</h2>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">Customer Name</th>
              <th className="px-4 py-3 border-b">Phone</th>
              <th className="px-4 py-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {pipelineData.map((cust, index) => (
              <tr key={cust.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b font-medium text-blue-700">
                  {cust.name}
                </td>
                <td className="px-4 py-2 border-b">{cust.phone}</td>
                <td
                  className={`px-4 py-2 border-b font-semibold ${
                    cust.status === "Completed"
                      ? "text-green-600"
                      : cust.status === "Draft"
                      ? "text-gray-500"
                      : "text-orange-500"
                  }`}
                >
                  {cust.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pipeline;
