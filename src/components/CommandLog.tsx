import { ScrollArea } from '@/components/ui/scroll-area';

interface Command {
  id: number;
  timestamp: string;
  command: string;
  status: 'success' | 'pending' | 'error';
}

interface CommandLogProps {
  commands: Command[];
}

const CommandLog = ({ commands }: CommandLogProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'error':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✓';
      case 'pending':
        return '⟳';
      case 'error':
        return '✗';
      default:
        return '•';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3">COMMAND LOG</h3>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {commands.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No commands yet
            </div>
          ) : (
            commands.map((cmd) => (
              <div
                key={cmd.id}
                className="flex items-start gap-3 text-sm border-l-2 border-border pl-3 py-2 hover:bg-secondary/50 transition-colors"
              >
                <span className={`${getStatusColor(cmd.status)} font-bold`}>
                  {getStatusIcon(cmd.status)}
                </span>
                <div className="flex-1">
                  <div className="text-foreground">{cmd.command}</div>
                  <div className="text-xs text-muted-foreground mt-1">{cmd.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CommandLog;
