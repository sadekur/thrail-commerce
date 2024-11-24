import React, { useEffect, useState } from "react";
import axios from "axios";
import Feature from "./components/Feature";
import Dashboard from "./components/Dashboard";
import Blocks from "./components/Blocks";
import Settings from "./components/Settings";

const Tabs = () => {
	const [activeTab, setActiveTab] = useState("dashboard");

	const tabs = ["dashboard", "feature", "blocks", "settings"];
	return (
		<>
			<div className=''>
				<div className='border-b border-gray-300 mb-4'>
					<ul className='flex items-center justify-start'>
						{tabs.map((tab) => (
							<li key={tab}>
								<button
									className={`py-2 px-4 ${
										activeTab === tab
											? "border-b-2 border-[#0029af] text-[#0029af]"
											: "text-[#0029af] hover:text-[#0842ff]"
									}`}
									onClick={() => setActiveTab(tab)}>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</button>
							</li>
						))}
					</ul>
				</div>
				<div className='mt-6'>
					{activeTab === "dashboard" && <Dashboard />}
					{activeTab === "feature" && <Feature />}
					{activeTab === "blocks" && <Blocks />}
					{activeTab === "settings" && <Settings />}
				</div>
			</div>
		</>
	);
};

export default Tabs;
