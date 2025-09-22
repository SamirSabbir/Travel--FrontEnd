import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

const Hotel = () => {
  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [openCalendarId, setOpenCalendarId] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/hotel/user");
        setHotelData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch hotel data");
        console.error("Error fetching hotel data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, []);

  // Handle adult count change
  const handleAdultChange = (id, value) => {
    const updatedData = hotelData.map((item) => {
      if (item._id === id) {
        return { ...item, adult: Math.max(0, value) };
      }
      return item;
    });
    setHotelData(updatedData);
  };

  // Handle child count change
  const handleChildChange = (id, value) => {
    const updatedData = hotelData.map((item) => {
      if (item._id === id) {
        return { ...item, child: Math.max(0, value) };
      }
      return item;
    });
    setHotelData(updatedData);
  };

  const handleRoomsChange = (id, value) => {
    const updatedData = hotelData.map((item) => {
      if (item._id === id) {
        return { ...item, room: Math.max(0, value) };
      }
      return item;
    });
    setHotelData(updatedData);
  };

  // Handle date change
  const handleDateChange = (id, field, value) => {
    setHotelData((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            night: {
              ...item.night,
              [field]: value,
            },
          };
        }
        return item;
      })
    );
  };

  // Handle room type change
  const handleRoomChange = (id, value) => {
    const updatedData = hotelData.map((item) => {
      if (item._id === id) {
        return { ...item, roomType: value };
      }
      return item;
    });
    setHotelData(updatedData);
  };

  // Handle rating change
  const handleRatingChange = (id, rating) => {
    const updatedData = hotelData.map((item) => {
      if (item._id === id) {
        return { ...item, rating };
      }
      return item;
    });
    setHotelData(updatedData);
  };

  // Handle price change
  const handlePriceChange = (id, field, value) => {
    const updatedData = hotelData.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    });
    setHotelData(updatedData);
  };

   const handlePerNightPriceChange = (id, field, value) => {
    const updatedData = hotelData.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    });
    setHotelData(updatedData);
  };

  const handleHotelNameChange = (id, field, value) => {
    const updatedData = hotelData.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    });
    setHotelData(updatedData);
  };

  // Room type options
  const roomTypes = [
    "Double room",
    "Single room",
    "Triple room",
    "Deluxe room",
    "Presidential suite",
    "Twin room",
    "Suite",
    "Connecting Rooms",
    "Quad room",
    "Studio",
    "Standard room",
    "Executive room",
    "Junior suite",
    "Quadruple room",
    "Suite rooms",
    "Adjoining Room",
    "Double hotel room",
    "Honeymoon suite",
    "King Room",
    "Queen room",
    "Single hotel room",
    "Studio hotel room",
    "Accessible room",
    "Apartment style",
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Handle save action
  const handleSave = async (id) => {
    try {
      const item = hotelData.find((item) => item._id === id);

      const itemToSave = {
        ...item,
        night: {
          from: item.night?.from
            ? new Date(item.night.from).toISOString().split("T")[0]
            : null,
          to: item.night?.to
            ? new Date(item.night.to).toISOString().split("T")[0]
            : null,
        },
      };

      console.log(itemToSave);

      await axios.patch(`/hotel/${id}`, itemToSave);
      alert("Changes saved successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save changes");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Hotel Management
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Unique ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hotel Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Adults
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Children
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nights
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Room
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Room Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Night Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total Price
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotelData.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.workId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.workId?.uuId || "N/A"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-20"
                        value={item.hotelName || ""}
                        onChange={(e) =>
                          handleHotelNameChange(
                            item._id,
                            "hotelName",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                        onClick={() =>
                          handleAdultChange(item._id, (item.adult || 0) - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-200">
                        {item.adult || 0}
                      </span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-r px-2 py-1"
                        onClick={() =>
                          handleAdultChange(item._id, (item.adult || 0) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                        onClick={() =>
                          handleChildChange(item._id, (item.child || 0) - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-200">
                        {item.child || 0}
                      </span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-r px-2 py-1"
                        onClick={() =>
                          handleChildChange(item._id, (item.child || 0) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    {/* Clickable field */}
                    <div
                      className="border rounded px-2 py-1 cursor-pointer bg-white min-w-[180px]"
                      onClick={() =>
                        setOpenCalendarId(
                          openCalendarId === item._id ? null : item._id
                        )
                      }
                    >
                      {item.night?.from && item.night?.to
                        ? `${format(
                            new Date(item.night.from),
                            "MMM d, yyyy"
                          )} → ${format(
                            new Date(item.night.to),
                            "MMM d, yyyy"
                          )}`
                        : "Select dates"}
                    </div>

                    {/* Calendar modal */}
                    {openCalendarId === item._id && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                          <DateRange
                            ranges={[
                              {
                                startDate: item.night?.from
                                  ? new Date(item.night.from)
                                  : new Date(),
                                endDate: item.night?.to
                                  ? new Date(item.night.to)
                                  : new Date(),
                                key: "selection",
                              },
                            ]}
                            onChange={(ranges) => {
                              handleDateChange(
                                item._id,
                                "from",
                                ranges.selection.startDate
                              );
                              handleDateChange(
                                item._id,
                                "to",
                                ranges.selection.endDate
                              );
                              setOpenCalendarId(null); // close after picking
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

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                        onClick={() =>
                          handleRoomsChange(item._id, (item.room || 0) - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-200">
                        {item.room || 0}
                      </span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-r px-2 py-1"
                        onClick={() =>
                          handleRoomsChange(item._id, (item.room || 0) + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    <select
                      className="border rounded px-2 py-1"
                      value={item.roomType || ""}
                      onChange={(e) =>
                        handleRoomChange(item._id, e.target.value)
                      }
                    >
                      <option value="">Select Room Type</option>
                      {roomTypes.map((room) => (
                        <option key={room} value={room}>
                          {room}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(item._id, star)}
                          className="text-yellow-400 focus:outline-none"
                        >
                          {star <= (item.rating || 0) ? (
                            <svg
                              className="w-5 h-5 fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5 fill-current text-gray-300"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="pr-1">৳</span>
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        value={item.perNightPrice || ""}
                        onChange={(e) =>
                          handlePerNightPriceChange(
                            item._id,
                            "perNightPrice",
                            e.target.value
                          )
                        }
                        min="0"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="pr-1">৳</span>
                      <input
                        type="number"
                        className="border rounded px-2 py-1 w-20"
                        value={item.totalPrice || ""}
                        onChange={(e) =>
                          handlePriceChange(
                            item._id,
                            "totalPrice",
                            e.target.value
                          )
                        }
                        min="0"
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleSave(item._id)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
