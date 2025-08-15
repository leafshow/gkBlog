import React from "react";

function Draft({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="p-4 border-l-4 font-sans text-sm leading-relaxed rounded-md mb-4 mt-4 
                 bg-blue-50 text-blue-800 border-blue-500 
                 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-400"
    >
      {children}
    </div>
  );
}

export default Draft;
