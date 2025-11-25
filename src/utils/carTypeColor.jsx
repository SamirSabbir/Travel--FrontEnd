const getEnhancedCarTypeColor = (type) => {
  const colors = {
    Sedan: {
      background: "bg-gradient-to-r from-blue-50 to-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    SUV: {
      background: "bg-gradient-to-r from-green-50 to-green-100",
      text: "text-green-800",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    MPV: {
      background: "bg-gradient-to-r from-purple-50 to-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    Minivan: {
      background: "bg-gradient-to-r from-red-50 to-red-100",
      text: "text-red-800",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    Minibus: {
      background: "bg-gradient-to-r from-indigo-50 to-indigo-100",
      text: "text-indigo-800",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
    "Luxury car": {
      background: "bg-gradient-to-r from-amber-50 to-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    Van: {
      background: "bg-gradient-to-r from-teal-50 to-teal-100",
      text: "text-teal-800",
      border: "border-teal-200",
      dot: "bg-teal-500",
    },
    Bus: {
      background: "bg-gradient-to-r from-pink-50 to-pink-100",
      text: "text-pink-800",
      border: "border-pink-200",
      dot: "bg-pink-500",
    },
  };

  return (
    colors[type] || {
      background: "bg-gradient-to-r from-gray-50 to-gray-100",
      text: "text-gray-800",
      border: "border-gray-200",
      dot: "bg-gray-500",
    }
  );
};

export default getEnhancedCarTypeColor;
