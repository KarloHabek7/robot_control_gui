import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ConnectionStatus from '@/components/ConnectionStatus';
import PositionDisplay from '@/components/PositionDisplay';
import Robot3DViewer from '@/components/Robot3DViewer';
import JointControlTable from '@/components/JointControlTable';
import RobotConfiguration from '@/components/RobotConfiguration';
import CommandPanel from '@/components/CommandPanel';
import { useRobotStore } from '@/stores/robotStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

const RobotControl = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { position, isConnected, setConnectionStatus } = useRobotStore();
  const [robotName, setRobotName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRobotDetails();
    }
  }, [id]);

  const fetchRobotDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('robots')
        .select('name')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setRobotName(data.name);
      }
    } catch (error) {
      console.error('Error fetching robot:', error);
      toast.error('Failed to load robot details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConnection = () => {
    const newStatus = !isConnected;
    setConnectionStatus(newStatus);
    
    if (newStatus) {
      toast.success(`Connected to ${robotName} (demo mode)!`);
    } else {
      toast.info(`Disconnected from ${robotName}`);
    }
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
      
      <div className="container mx-auto p-6 relative z-10 max-w-[1800px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:scale-105 transition-transform"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
                {robotName} Control Interface
              </h1>
              <p className="text-muted-foreground text-sm">
                Professional robot control and monitoring system
              </p>
            </div>
          </div>
          <ConnectionStatus 
            connected={isConnected} 
            onToggleConnection={handleToggleConnection} 
          />
        </div>

        {/* Top Section - 3D Viewer and Joint Controls */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* 3D Visualization */}
          <div>
            <Robot3DViewer />
          </div>

          {/* Joint Control Table */}
          <div>
            <JointControlTable />
          </div>
        </div>

        {/* Bottom Section - Configuration, Position, and Commands */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default RobotControl;