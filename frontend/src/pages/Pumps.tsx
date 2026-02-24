import { useEffect, useState } from "react";

interface Pump {
  id: number;
  name: string;
  location: string;
  status: string;
}

const Pumps = () => {
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/pumps", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch pumps");
        }
        return res.json();
      })
      .then((data: Pump[]) => {
        setPumps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pumps:", err);
        setPumps([]);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading pumps...</p>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Pumps</h2>

      {pumps.length === 0 ? (
        <p className="text-gray-500">No pumps found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pumps.map((pump) => (
            <div
              key={pump.id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                {pump.name}
              </h3>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Location:</span>{" "}
                {pump.location}
              </p>

              <div className="mt-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    pump.status === "working"
                      ? "bg-green-100 text-green-700"
                      : pump.status === "maintenance"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {pump.status}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pumps;