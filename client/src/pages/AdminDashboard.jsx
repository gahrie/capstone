import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) 
    ? date.toLocaleString()
    : "Invalid Date Format";
};

const AdminDashboard = () => {
  const [guests, setGuests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/guests");
      setGuests(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching guests");
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleTimeOut = async (guestId) => {
    try {
      const response = await axios.post(`http://localhost:3000/api/timelogs/timeout/${guestId}`);
      
      if (response.data && response.data.timeLog) {
        toast.success("Time out recorded successfully");
        await fetchGuests();
      } else {
        toast.warning("Unexpected response format");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error recording time out";
      toast.error(errorMessage);
      console.error("Timeout Error:", error);
    }
  };

  const isGuestLoggedIn = (guest) => {
    return !guest.timeOut;
  };

  const filteredGuests = guests.filter((guest) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      guest.fullName.toLowerCase().includes(searchLower) ||
      guest.gender.toLowerCase().includes(searchLower) ||
      guest.age.toString().includes(searchLower) ||
      guest.timeIn.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Guest Management
        </h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, gender, age, or time in..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {guest.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {guest.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {guest.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(guest.timeIn)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(guest.timeOut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {isGuestLoggedIn(guest) ? (
                      <button
                        onClick={() => handleTimeOut(guest.id)}
                        className="btn-primary"
                      >
                        Log Time Out
                      </button>
                    ) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
