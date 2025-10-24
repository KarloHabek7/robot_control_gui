import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Robot {
  id: string;
  name: string;
  x_coordinate: number;
  y_coordinate: number;
  z_coordinate: number;
  gripper_open: boolean;
  last_updated: string;
}

export default function RobotDashboard() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRobots();
  }, []);

  const fetchRobots = async () => {
    try {
      const { data, error } = await supabase
        .from("robots")
        .select("*")
        .order("name");

      if (error) throw error;
      setRobots(data || []);
    } catch (error) {
      console.error("Error fetching robots:", error);
      toast.error("Failed to load robots");
    } finally {
      setLoading(false);
    }
  };

  const handleRobotClick = (robotId: string) => {
    navigate(`/robot/${robotId}`);
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Robot Laboratory Dashboard
          </h1>
          <p className="text-muted-foreground">
            Click on any robot to access its control interface
          </p>
        </header>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">Robot Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
                  <th className="px-6 py-4 text-left font-semibold">X</th>
                  <th className="px-6 py-4 text-left font-semibold">Y</th>
                  <th className="px-6 py-4 text-left font-semibold">Z</th>
                  <th className="px-6 py-4 text-left font-semibold">Gripper Status</th>
                </tr>
              </thead>
              <tbody>
                {robots.map((robot) => (
                  <tr
                    key={robot.id}
                    onClick={() => handleRobotClick(robot.id)}
                    className={`border-b cursor-pointer transition-all hover:scale-[1.01] ${
                      robot.gripper_open
                        ? "bg-green-500/10 hover:bg-green-500/20"
                        : "bg-red-500/10 hover:bg-red-500/20"
                    }`}
                  >
                    <td className="px-6 py-4 font-medium">{robot.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDateTime(robot.last_updated)}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {robot.x_coordinate.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {robot.y_coordinate.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {robot.z_coordinate.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          robot.gripper_open
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {robot.gripper_open ? "Open" : "Closed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {robots.length === 0 && (
          <div className="text-center mt-8 text-muted-foreground">
            No robots available in the laboratory
          </div>
        )}
      </div>
    </div>
  );
}
