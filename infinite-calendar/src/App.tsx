import React, { Suspense } from "react";
import "./App.css";

const Calendar = React.lazy(() =>
  import("./components/Calendar/Calendar").then((module) => ({
    default: module.Calendar,
  }))
);

const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    <span className="ml-4 text-lg text-gray-600">Loading Calendar...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <div className="App">
      <Suspense fallback={<LoadingFallback />}>
        <Calendar />
      </Suspense>
    </div>
  );
};

export default App;
