import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Tabs from "./pages/Tabs";               // main page with tabs
import StockThreshold from "./pages/StockThreshold"; // separate page

const App = () => {
    const [currentPage, setCurrentPage] = useState("");

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace("#", "") || "";
            setCurrentPage(hash);
        };

        window.addEventListener("hashchange", handleHashChange);
        handleHashChange();

        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case "":
            case "/":
                return <Tabs />;          // tabs live here, fully internal
            case "/stock-threshold":
                return <StockThreshold />;
            default:
                return (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-red-600">404 - Page not found</h2>
                    </div>
                );
        }
    };

    return <div>{renderPage()}</div>;
};

const rootElement = document.getElementById("thrail_commerce_render");
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(<App />);
}

export default App;