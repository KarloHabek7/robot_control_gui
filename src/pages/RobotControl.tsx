import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectionStatus from "@/components/ConnectionStatus";
import ControlPanel from "@/components/ControlPanel";
import PositionDisplay from "@/components/PositionDisplay";
import Robot3DViewer from "@/components/Robot3DViewer";
import JointControlTable from "@/components/JointControlTable";
import CommandPanel from "@/components/CommandPanel";
import RobotConfiguration from "@/components/RobotConfiguration";
import { useRobotStore } from "@/stores/robotStore";

export default function RobotControl() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [robotName, setRobotName] = useState("");
  const position = useRobotStore((state) => state.position);

  useEffect(() => {
    if (id) {
      fetchRobotDetails(id);
    }
  }, [id]);

  const fetchRobotDetails = async (robotId: string) => {
    try {
      const { data, error } = await supabase
        .from("robots")
        .select("*")
        .eq("id", robotId)
        .single();

      if (error) throw error;
      
      if (data) {
        setRobotName(data.name);
        // Update robot store position with database values
        useRobotStore.getState().setPosition({
          x: Number(data.x_coordinate),
          y: Number(data.y_coordinate),
          z: Number(data.z_coordinate),
        });
      }
    } catch (error) {
      console.error("Error fetching robot:", error);
      toast.error("Failed to load robot details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {robotName} - Control Interface
          </h1>
        </div>

        {/* Top Section - 3D Viewer and Joint Controls with equal heights */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* 3D Visualization */}
          <div className="h-[600px]">
            <Robot3DViewer />
          </div>

          {/* Joint Control Table */}
          <div className="h-[600px]">
            <JointControlTable />
          </div>
        </div>

        {/* Bottom Section - All Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Connection Status */}
          <div>
            <ConnectionStatus
              connected={false}
              onToggleConnection={() => {}}
            />
          </div>

          {/* Position Display */}
          <div>
            <PositionDisplay position={position} />
          </div>

          {/* Robot Configuration */}
          <div>
            <RobotConfiguration />
          </div>

          {/* Command Panel */}
          <div>
            <CommandPanel />
          </div>
        </div>

        {/* Compact Control Panel */}
        <div className="mt-4">
          <ControlPanel
            onMove={(direction, value) => console.log('Move:', direction, value)}
            onGoToPosition={(x, y, z) => console.log('Go to:', x, y, z)}
          />
        </div>
      </div>
    </div>
  );
}
