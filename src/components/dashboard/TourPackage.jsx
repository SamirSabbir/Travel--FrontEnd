import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, differenceInDays } from "date-fns";

const TourPackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCalendarId, setOpenCalendarId] = useState(null);

  const countries = [
    "France", "UK", "Canada", "Australia", "Sweden", "USA", "Thailand", 
    "Singapore", "Germany", "South Korea", "Japan", "UAE", "Portugal", 
    "Netherland", "Belgium", "Poland", "Finland", "Denmark", "Estonia", 
    "Austria", "Czech Republic", "Iceland", "Slovenia", "Latvia", "Norway", 
    "Nepal", "China", "Luxembourg", "Kenya", "New Zealand"
  ];

  // Fetch tour packages from API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/tourPackage/user');
        
        // Handle both array and single object responses
        if (Array.isArray(response.data)) {
          setPackages(response.data.map(pkg => ({
            ...pkg,
            dates: pkg.dates || { from: null, to: null }
          })));
        } else if (response.data && typeof response.data === 'object') {
          setPackages([{
            ...response.data,
            dates: response.data.dates || { from: null, to: null }
          }]);
        } else {
          setPackages([]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Handle date change
  const handleDateChange = (id, field, value) => {
    setPackages(prev => 
      prev.map(item => {
        if (item._id === id) {
          const updatedDates = {
            ...item.dates,
            [field]: value
          };
          
          // Calculate nights based on date difference
          let nights = item.night || 0;
          if (updatedDates.from && updatedDates.to) {
            nights = differenceInDays(updatedDates.to, updatedDates.from);
          }
          
          return {
            ...item,
            dates: updatedDates,
            night: nights
          };
        }
        return item;
      })
    );
  };

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = value;
    setPackages(updatedPackages);
  };

  // Handle save action
  const handleSave = async (index) => {
    try {
      const packageItem = packages[index];
      
      // Prepare data for API - convert dates to ISO strings
      const dataToSave = {
        ...packageItem,
        dates: {
          from: packageItem.dates?.from ? packageItem.dates.from.toISOString() : null,
          to: packageItem.dates?.to ? packageItem.dates.to.toISOString() : null
        }
      };
      
      await axios.put(`/tourPackage/${packageItem._id}`, dataToSave);
      alert('Package updated successfully!');
    } catch (err) {
      alert('Error updating package: ' + err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tour Package Management</h1>
      
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique ID</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transfer</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nights</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sight Seeing</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flights</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(packages) && packages.length > 0 ? (
              packages.map((packageItem, index) => (
                <tr key={packageItem._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {packageItem.workId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {packageItem.workId?.uuId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.country || ''}
                      onChange={(e) => handleInputChange(index, 'country', e.target.value)}
                      className=" px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.transfer || ''}
                      onChange={(e) => handleInputChange(index, 'transfer', e.target.value)}
                      className=" px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    {/* Clickable field for date range */}
                    <div
                      className="border rounded px-2 py-1 cursor-pointer bg-white min-w-[180px]"
                      onClick={() =>
                        setOpenCalendarId(
                          openCalendarId === packageItem._id ? null : packageItem._id
                        )
                      }
                    >
                      {packageItem.dates?.from && packageItem.dates?.to
                        ? `${format(packageItem.dates.from, "MMM d, yyyy")} → ${format(
                            packageItem.dates.to,
                            "MMM d, yyyy"
                          )} (${packageItem.night || 0} nights)`
                        : "Select dates"}
                    </div>

                    {/* Calendar modal */}
                    {openCalendarId === packageItem._id && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                          <DateRange
                            ranges={[
                              {
                                startDate: packageItem.dates?.from
                                  ? new Date(packageItem.dates.from)
                                  : new Date(),
                                endDate: packageItem.dates?.to
                                  ? new Date(packageItem.dates.to)
                                  : new Date(),
                                key: "selection",
                              },
                            ]}
                            onChange={(ranges) => {
                              handleDateChange(
                                packageItem._id,
                                "from",
                                ranges.selection.startDate
                              );
                              handleDateChange(
                                packageItem._id,
                                "to",
                                ranges.selection.endDate
                              );
                              setOpenCalendarId(null); // close calendar after picking
                            }}
                            moveRangeOnFirstSelection={false}
                            rangeColors={["#2563eb"]}
                          />

                          {/* Close button */}
                          <div className="flex justify-end mt-2">
                            <button
                              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                              onClick={() => setOpenCalendarId(null)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.hotel || ''}
                      onChange={(e) => handleInputChange(index, 'hotel', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.sightSeeing || ''}
                      onChange={(e) => handleInputChange(index, 'sightSeeing', e.target.value)}
                      className=" px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={packageItem.flights || ''}
                      onChange={(e) => handleInputChange(index, 'flights', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={packageItem.totalPrice || ''}
                      onChange={(e) => handleInputChange(index, 'totalPrice', e.target.value)}
                      className="w-[90px] px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSave(index)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-4 text-center">
                  No tour packages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TourPackage;