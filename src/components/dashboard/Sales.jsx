import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-toastify';
import { CheckCircle, Loader2 } from 'lucide-react';

const Sales = () => {
  const [mySales, setMySales] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);

  // Fetch My Sales
  const fetchSales = async () => {
    try {
      const res = await axios.get('/sales/my-sales');
      setMySales(res.data.data);
    } catch (err) {
      toast.error(err);
    }
  };

  // Fetch Pipeline Data
  const fetchPipeline = async () => {
    try {
      const res = await axios.get('/works/pipeline');
      setPipeline(res.data.data);
    } catch (err) {
      toast.error(err);
    }
  };

  // Confirm a sale
  const handleConfirm = async (saleId) => {
    setConfirmingId(saleId);
    try {
      await axios.patch(`/sales/confirm-sales/${saleId}`);
      toast.success('Sale confirmed successfully');
      fetchSales();
      fetchPipeline();
    } catch (err) {
      toast.error(err);
    } finally {
      setConfirmingId(null);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchPipeline();
  }, []);

  return (
    <div className="p-6 space-y-10">
      {/* My Sales */}
      <section>
        <h2 className="text-2xl font-bold mb-4">My Sales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {mySales.map((sale) => (
            <div
              key={sale._id}
              className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200"
            >
              <div className="text-lg font-semibold">{sale.customerName}</div>
              <div className="text-sm text-gray-600">{sale.phoneNumber}</div>
              <p className="text-gray-700 mt-2">{sale.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    sale.isConfirmed
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {sale.isConfirmed ? 'Confirmed' : 'Pending'}
                </span>

                {!sale.isConfirmed && (
                  <button
                    onClick={() => handleConfirm(sale._id)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    disabled={confirmingId === sale._id}
                  >
                    {confirmingId === sale._id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Confirming
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline View */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Pipeline</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {pipeline.map((item) => (
            <div
              key={item._id}
              className="bg-slate-100 border border-gray-300 rounded-xl p-4 shadow-sm"
            >
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="text-gray-600 text-sm">{item.phone}</p>
              <span className="inline-block mt-2 text-xs font-semibold text-white bg-purple-500 px-2 py-1 rounded-full capitalize">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sales;
