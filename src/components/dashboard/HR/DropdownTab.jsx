import { useState } from "react";

const DropdownTab = ({ tab, selectedTab, setSelectedTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-2 rounded transition flex justify-between items-center ${
          selectedTab.startsWith(tab.name) 
            ? "bg-[#0F4F55] text-white" 
            : "hover:bg-blue-100"
        }`}
      >
        {tab.name}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {tab.subTabs.map((subTab) => (
            <button
              key={subTab.name}
              onClick={() => setSelectedTab(subTab.name)}
              className={`w-full text-left p-2 rounded transition ${
                selectedTab === subTab.name
                  ? "bg-[#0F4F55] text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {subTab.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownTab;