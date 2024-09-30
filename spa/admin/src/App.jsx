import React from "react";
import ReactDOM from "react-dom/client";
import Tabs from "./pages/Tabs";

const App = () => {
	return (
		<>
			<Tabs />
		</>
	);
};

export default App;

ReactDOM.createRoot(document.getElementById("thrail_commerce_render")).render(
	<App />
);
