const getServiceColor = (serviceType) => {
  const colors = {
    visa: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', dot: 'bg-amber-500' },
    hotel: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', dot: 'bg-blue-500' },
    ticket: { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8', dot: 'bg-purple-500' },
    transfer: { bg: '#dcfce7', border: '#22c55e', text: '#166534', dot: 'bg-green-500' },
    tourPackage: { bg: '#fef7cd', border: '#eab308', text: '#854d0e', dot: 'bg-yellow-500' },
    appointmentDate: { bg: '#fce7f3', border: '#ec4899', text: '#be185d', dot: 'bg-pink-500' },
  };
  return colors[serviceType] || { bg: '#f3f4f6', border: '#9ca3af', text: '#374151', dot: 'bg-gray-400' };
};

export default getServiceColor;

