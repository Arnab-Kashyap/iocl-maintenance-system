// src/pages/PumpDetail.tsx
import { useEffect, useState } from "react";
import TimelineCard from "../components/dashboard/TimelineCard";
import type { TimelineCardProps } from "../components/dashboard/TimelineCard";
import { useParams } from "react-router-dom";

interface Pump {
  id: number;
  name: string;
  status: string;
  location: string;
  maintenance_history: { date: string; action: string; status: string }[];
}

const PumpDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pump, setPump] = useState<Pump | null>(null);
  const [timeline, setTimeline] = useState<TimelineCardProps[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/pumps/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(res => res.json())
      .then((data: Pump) => {
        setPump(data);
        // Map backend history to TimelineCardProps with type-safe status
        const timelineData: TimelineCardProps[] = (data.maintenance_history || []).map(item => ({
          date: item.date,
          action: item.action,
          status: item.status === "Completed" ? "Completed" : "Pending", // ✅ type-safe
        }));
        setTimeline(timelineData);
      })
      .catch(err => {
        console.error(err);
      });
  }, [id]);

  if (!pump) return <p>Loading pump details...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">{pump.name} Details</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <p>
          <strong>Status:</strong> {pump.status}
        </p>
        <p>
          <strong>Location:</strong> {pump.location}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Maintenance Timeline</h3>
      <div className="space-y-2">
        {timeline.length > 0 ? (
          timeline.map((item, index) => <TimelineCard key={index} {...item} />)
        ) : (
          <p>No maintenance history available</p>
        )}
      </div>
    </div>
  );
};

export default PumpDetail;