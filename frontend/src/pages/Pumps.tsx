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
    fetch("http://localhost:8000/pumps")
      .then((res) => res.json())
      .then((data) => {
        setPumps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pumps:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading pumps...</p>;

  return (
    <div>
      <h2>Pumps</h2>
      {pumps.length === 0 ? (
        <p>No pumps found</p>
      ) : (
        pumps.map((pump) => (
          <div key={pump.id} style={{ marginBottom: "10px" }}>
            <strong>{pump.name}</strong>
            <p>Location: {pump.location}</p>
            <p>Status: {pump.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Pumps;