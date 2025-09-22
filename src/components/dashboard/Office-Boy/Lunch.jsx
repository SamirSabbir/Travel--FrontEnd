import React, { useState } from 'react';

const Lunch = () => {
  const [entries, setEntries] = useState([]);
  const [inputRows, setInputRows] = useState([
    {
      id: 1,
      date: '',
      lunchBoxes: '',
      source: '',
      note: '',
      bill: ''
    }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    
    setInputRows(prev => prev.map(row => 
      row.id === id ? { ...row, [name]: value } : row
    ));
  };

  const addInputRow = () => {
    const newId = inputRows.length > 0 ? Math.max(...inputRows.map(row => row.id)) + 1 : 1;
    setInputRows([...inputRows, {
      id: newId,
      date: '',
      lunchBoxes: '',
      source: '',
      note: '',
      bill: ''
    }]);
  };

  const removeInputRow = (id) => {
    if (inputRows.length > 1) {
      setInputRows(inputRows.filter(row => row.id !== id));
    }
  };

  const saveAllEntries = () => {
    // Filter out incomplete rows
    const validRows = inputRows.filter(row => 
      row.date && row.lunchBoxes && row.source && row.bill
    );

    if (validRows.length === 0) {
      alert('Please fill in all required fields in at least one row');
      return;
    }

    const newEntries = validRows.map(row => ({
      id: Date.now() + row.id, // Ensure unique ID
      date: row.date,
      lunchBoxes: row.lunchBoxes,
      source: row.source,
      note: row.note,
      bill: row.bill
    }));

    setEntries([...entries, ...newEntries]);
    
    // Reset input rows but keep one empty row
    setInputRows([{
      id: 1,
      date: '',
      lunchBoxes: '',
      source: '',
      note: '',
      bill: ''
    }]);
    
    alert(`${newEntries.length} lunch record(s) saved successfully!`);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(entries.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    
    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &laquo;
      </button>
    );
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 rounded-md border ${
            currentPage === i 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        &raquo;
      </button>
    );
    
    return buttons;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Lunch Management</h1>
          <p className="text-gray-600">Track and manage lunch expenses</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={addInputRow}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Row
          </button>
          <button
            onClick={saveAllEntries}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Save All
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Lunch Boxes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ($)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Input rows */}
              {inputRows.map(row => (
                <tr key={row.id} className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      name="date"
                      value={row.date}
                      onChange={(e) => handleInputChange(row.id, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      name="lunchBoxes"
                      value={row.lunchBoxes}
                      onChange={(e) => handleInputChange(row.id, e)}
                      placeholder="Number of boxes"
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      name="source"
                      value={row.source}
                      onChange={(e) => handleInputChange(row.id, e)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Source</option>
                      <option value="Catering">Catering</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="OtherSide food">OtherSide food</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="note"
                      value={row.note}
                      onChange={(e) => handleInputChange(row.id, e)}
                      placeholder="Additional notes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      name="bill"
                      value={row.bill}
                      onChange={(e) => handleInputChange(row.id, e)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => removeInputRow(row.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={inputRows.length <= 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Saved entries table */}
      {entries.length > 0 && (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lunch Boxes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill ($)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.lunchBoxes}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          entry.source === 'Catering' ? 'bg-blue-100 text-blue-800' :
                          entry.source === 'Restaurant' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {entry.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{entry.note || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${parseFloat(entry.bill).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 mb-8">
              <div className="flex space-x-2">
                {renderPaginationButtons()}
              </div>
            </div>
          )}

          {/* Summary section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lunch Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Total Expenses</h3>
                <p className="text-2xl font-bold text-blue-600">
                  ${entries.reduce((sum, entry) => sum + parseFloat(entry.bill), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Total Lunch Boxes</h3>
                <p className="text-2xl font-bold text-green-600">
                  {entries.reduce((sum, entry) => sum + parseInt(entry.lunchBoxes), 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">Average per Box</h3>
                <p className="text-2xl font-bold text-purple-600">
                  ${(entries.reduce((sum, entry) => sum + parseFloat(entry.bill), 0) / 
                    entries.reduce((sum, entry) => sum + parseInt(entry.lunchBoxes), 0)).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Lunch;