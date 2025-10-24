import { useState } from 'react';
import RobotVisualizer from '@/components/RobotVisualizer';
import PositionDisplay from '@/components/PositionDisplay';
import ControlPanel from '@/components/ControlPanel';
import ConnectionStatus from '@/components/ConnectionStatus';
import CommandLog from '@/components/CommandLog';
import { useToast } from '@/hooks/use-toast';

interface Command {
  id: number;
  timestamp: string;
  command: string;
  status: 'success' | 'pending' | 'error';
}

const Index = () => {
  const { toast } = useToast();
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [connected, setConnected] = useState(false);
  const [commands, setCommands] = useState<Command[]>([]);

  const addCommand = (commandText: string, status: 'success' | 'pending' | 'error' = 'success') => {
    const newCommand: Command = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      command: commandText,
      status,
    };
    setCommands((prev) => [newCommand, ...prev].slice(0, 50));
  };

  const handleToggleConnection = () => {
    setConnected(!connected);
    if (!connected) {
      toast({
        title: "Connected",
        description: "Successfully connected to robot",
      });
      addCommand('Connection established', 'success');
    } else {
      toast({
        title: "Disconnected",
        description: "Robot connection closed",
      });
      addCommand('Connection closed', 'success');
    }
  };

  const handleMove = (direction: string, value: number = 10) => {
    if (!connected) {
      toast({
        title: "Not Connected",
        description: "Please connect to the robot first",
        variant: "destructive",
      });
      return;
    }

    let newPosition = { ...position };
    let commandText = '';

    switch (direction) {
      case 'up':
        newPosition.y += value;
        commandText = `Move UP +${value}m`;
        break;
      case 'down':
        newPosition.y -= value;
        commandText = `Move DOWN -${value}m`;
        break;
      case 'left':
        newPosition.x -= value;
        commandText = `Move LEFT -${value}m`;
        break;
      case 'right':
        newPosition.x += value;
        commandText = `Move RIGHT +${value}m`;
        break;
      case 'z-up':
        newPosition.z += value;
        commandText = `Move Z+ +${value}m`;
        break;
      case 'z-down':
        newPosition.z -= value;
        commandText = `Move Z- -${value}m`;
        break;
      case 'stop':
        commandText = 'EMERGENCY STOP';
        toast({
          title: "Emergency Stop",
          description: "All robot movements halted",
          variant: "destructive",
        });
        break;
    }

    if (direction !== 'stop') {
      setPosition(newPosition);
    }
    addCommand(commandText, 'success');
  };

  const handleGoToPosition = (x: number, y: number, z: number) => {
    if (!connected) {
      toast({
        title: "Not Connected",
        description: "Please connect to the robot first",
        variant: "destructive",
      });
      return;
    }

    setPosition({ x, y, z });
    addCommand(`Go to position (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`, 'success');
    toast({
      title: "Moving to Position",
      description: `Target: X=${x}, Y=${y}, Z=${z}`,
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 p-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">ROBOT CONTROL SYSTEM</h1>
            <p className="text-muted-foreground text-sm">Real-time coordinate tracking and movement control</p>
          </div>

          {/* Connection Status */}
          <div className="mb-6">
            <ConnectionStatus connected={connected} onToggleConnection={handleToggleConnection} />
          </div>

          {/* Position Display */}
          <div className="mb-6">
            <PositionDisplay position={position} />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualizer */}
            <div className="lg:col-span-2">
              <div className="card-premium rounded-xl p-6 shadow-lg">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Coordinate Space</h2>
                <div className="aspect-[4/3] bg-background/50 rounded-xl overflow-hidden border border-border/30">
                  <RobotVisualizer position={position} />
                </div>
              </div>
            </div>

            {/* Control Panel */}
            <div className="space-y-6">
              <ControlPanel onMove={handleMove} onGoToPosition={handleGoToPosition} />
              <CommandLog commands={commands} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
