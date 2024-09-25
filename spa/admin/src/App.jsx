import React from "react";
import ReactDOM from "react-dom/client";
import Settings from "./pages/Settings";

const App = () => {
	return (
		<>
			<h2>Hello Soikut</h2>
			<Settings />
		</>
	);
};

export default App;

ReactDOM.createRoot(document.getElementById("thrail_commerce_render")).render(
	<App />
);
