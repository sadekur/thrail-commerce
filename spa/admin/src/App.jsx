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

// ReactDOM.createRoot(document.getElementById("thrail_commerce_render")).render(
// // 	<App />
// // );

const rootElement = document.getElementById('thrail_commerce_render');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);  // This line can throw the error if `rootElement` is null
  root.render(<App />);
} else {
  console.error("Target container 'root' is not found.");
}
