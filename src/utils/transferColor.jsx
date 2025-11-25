const getPremiumTransferTypeColor = (type) => {
  const colors = {
    "Airport Pick-up": {
      background: "bg-gradient-to-r from-blue-500 to-blue-600",
      text: "text-white",
      border: "border-blue-700",
      dot: "bg-white",
    },
    "Airport Drop-off": {
      background: "bg-gradient-to-r from-green-500 to-green-600",
      text: "text-white",
      border: "border-green-700",
      dot: "bg-white",
    },
    "Private Transfer": {
      background: "bg-gradient-to-r from-purple-500 to-purple-600",
      text: "text-white",
      border: "border-purple-700",
      dot: "bg-white",
    },
    Helicopter: {
      background: "bg-gradient-to-r from-red-500 to-red-600",
      text: "text-white",
      border: "border-red-700",
      dot: "bg-white",
    },
    "Speed Boat": {
      background: "bg-gradient-to-r from-indigo-500 to-indigo-600",
      text: "text-white",
      border: "border-indigo-700",
      dot: "bg-white",
    },
    Yatch: {
      background: "bg-gradient-to-r from-amber-500 to-amber-600",
      text: "text-white",
      border: "border-amber-700",
      dot: "bg-white",
    },
  };

  return (
    colors[type] || {
      background: "bg-gradient-to-r from-gray-500 to-gray-600",
      text: "text-white",
      border: "border-gray-700",
      dot: "bg-white",
    }
  );
};

export default getPremiumTransferTypeColor;
