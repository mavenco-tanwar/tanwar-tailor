export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Queries</h3>
                    <p className="text-3xl font-bold text-[#1a1a2e] mt-2">--</p>
                    <p className="text-xs text-green-500 mt-1">Updates real-time</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Unread Messages</h3>
                    <p className="text-3xl font-bold text-[#c5a059] mt-2">--</p>
                    <p className="text-xs text-gray-400 mt-1">Requires attention</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">System Status</h3>
                    <div className="flex items-center mt-2">
                        <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                        <p className="text-lg font-bold text-[#1a1a2e]">Active</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">System operational</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Quick Actions</h3>
                <p className="text-gray-500">Select "Contacts" from the sidebar to view and manage customer queries.</p>
            </div>
        </div>
    );
}
