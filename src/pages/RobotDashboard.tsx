import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Robot {
  id: string;
  name: string;
  x_coordinate: number;
  y_coordinate: number;
  z_coordinate: number;
  gripper_open: boolean;
  last_updated: string;
}

const RobotDashboard = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRobots();
  }, []);

  const fetchRobots = async () => {
    try {
      const { data, error } = await supabase
        .from('robots')
        .select('*')
        .order('name');

      if (error) throw error;
      setRobots(data || []);
    } catch (error) {
      console.error('Error fetching robots:', error);
      toast.error('Failed to load robots');
    } finally {
      setLoading(false);
    }
  };

  const handleRobotClick = (robotId: string) => {
    navigate(`/robot/${robotId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background relative overflow-hidden">
      {/* Diagonal gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="container mx-auto p-6 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3 tracking-tight">
            Laboratory Robot Fleet
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a robot to view its control interface
          </p>
        </div>

        {/* Robot Table Card */}
        <Card className="overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-semibold text-foreground">Robot Name</th>
                  <th className="text-left p-4 font-semibold text-foreground">Date & Time</th>
                  <th className="text-center p-4 font-semibold text-foreground">X</th>
                  <th className="text-center p-4 font-semibold text-foreground">Y</th>
                  <th className="text-center p-4 font-semibold text-foreground">Z</th>
                  <th className="text-center p-4 font-semibold text-foreground">Gripper Status</th>
                </tr>
              </thead>
              <tbody>
                {robots.map((robot) => (
                  <tr
                    key={robot.id}
                    onClick={() => handleRobotClick(robot.id)}
                    className={`
                      border-b transition-all cursor-pointer hover:scale-[1.01] hover:shadow-md
                      ${robot.gripper_open 
                        ? 'bg-green-500/20 hover:bg-green-500/30 border-green-500/30' 
                        : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30'
                      }
                    `}
                  >
                    <td className="p-4 font-medium text-foreground">{robot.name}</td>
                    <td className="p-4 text-muted-foreground font-mono text-sm">
                      {format(new Date(robot.last_updated), 'MMM dd, yyyy HH:mm:ss')}
                    </td>
                    <td className="p-4 text-center font-mono text-foreground">{robot.x_coordinate.toFixed(1)}</td>
                    <td className="p-4 text-center font-mono text-foreground">{robot.y_coordinate.toFixed(1)}</td>
                    <td className="p-4 text-center font-mono text-foreground">{robot.z_coordinate.toFixed(1)}</td>
                    <td className="p-4 text-center">
                      <span className={`
                        inline-block px-3 py-1 rounded-full text-sm font-semibold
                        ${robot.gripper_open 
                          ? 'bg-green-600 text-white' 
                          : 'bg-red-600 text-white'
                        }
                      `}>
                        {robot.gripper_open ? 'Open' : 'Closed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500/30 border-2 border-green-500"></div>
            <span className="text-sm text-muted-foreground">Gripper Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-500/30 border-2 border-red-500"></div>
            <span className="text-sm text-muted-foreground">Gripper Closed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotDashboard;