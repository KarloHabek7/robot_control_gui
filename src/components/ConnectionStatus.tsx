import { Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConnectionStatusProps {
  connected: boolean;
  onToggleConnection: () => void;
}

const ConnectionStatus = ({ connected, onToggleConnection }: ConnectionStatusProps) => {
  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${connected ? 'bg-success/20' : 'bg-destructive/20'}`}>
          {connected ? (
            <Wifi className="h-5 w-5 text-success" />
          ) : (
            <WifiOff className="h-5 w-5 text-destructive" />
          )}
        </div>
        <div>
          <div className="font-semibold text-sm">
            {connected ? 'Connected' : 'Disconnected'}
          </div>
          <div className="text-xs text-muted-foreground">
            {connected ? 'Robot is online and ready' : 'Click to connect to robot'}
          </div>
        </div>
      </div>
      
      <Button
        onClick={onToggleConnection}
        variant={connected ? "destructive" : "default"}
        className={connected ? "" : "bg-success hover:bg-success/90 text-white"}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
    </div>
  );
};

export default ConnectionStatus;
