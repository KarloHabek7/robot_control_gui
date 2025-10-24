import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, MoveUp, MoveDown } from 'lucide-react';
import { useState } from 'react';

interface ControlPanelProps {
  onMove: (direction: string, value?: number) => void;
  onGoToPosition: (x: number, y: number, z: number) => void;
}

const ControlPanel = ({ onMove, onGoToPosition }: ControlPanelProps) => {
  const [targetX, setTargetX] = useState('0');
  const [targetY, setTargetY] = useState('0');
  const [targetZ, setTargetZ] = useState('0');
  const [stepSize, setStepSize] = useState('10');

  const handleGoTo = () => {
    onGoToPosition(parseFloat(targetX), parseFloat(targetY), parseFloat(targetZ));
  };

  return (
    <div className="space-y-6">
      {/* Directional Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">DIRECTIONAL CONTROL</h3>
        
        <div className="flex items-center justify-center mb-4">
          <Input
            type="number"
            value={stepSize}
            onChange={(e) => setStepSize(e.target.value)}
            className="w-20 text-center mr-2"
            placeholder="10"
          />
          <span className="text-sm text-muted-foreground">meters per step</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <div />
          <Button
            onClick={() => onMove('up', parseFloat(stepSize))}
            className="bg-secondary hover:bg-secondary/80 glow-border"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <div />
          
          <Button
            onClick={() => onMove('left', parseFloat(stepSize))}
            className="bg-secondary hover:bg-secondary/80 glow-border"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onMove('stop')}
            variant="destructive"
            className="glow-border"
          >
            STOP
          </Button>
          <Button
            onClick={() => onMove('right', parseFloat(stepSize))}
            className="bg-secondary hover:bg-secondary/80 glow-border"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <div />
          <Button
            onClick={() => onMove('down', parseFloat(stepSize))}
            className="bg-secondary hover:bg-secondary/80 glow-border"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <div />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => onMove('z-up', parseFloat(stepSize))}
            className="bg-secondary hover:bg-secondary/80 glow-border"
          >
            <MoveUp className="h-4 w-4 mr-2" />
            Z+
          </Button>
          <Button
            onClick={() => onMove('z-down', parseFloat(stepSize))}
            className="bg-secondary hover:bg-secondary/80 glow-border"
          >
            <MoveDown className="h-4 w-4 mr-2" />
            Z-
          </Button>
        </div>
      </div>

      {/* Coordinate Input */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">GO TO POSITION</h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">X Coordinate</label>
            <Input
              type="number"
              value={targetX}
              onChange={(e) => setTargetX(e.target.value)}
              placeholder="0.00"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Y Coordinate</label>
            <Input
              type="number"
              value={targetY}
              onChange={(e) => setTargetY(e.target.value)}
              placeholder="0.00"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Z Coordinate</label>
            <Input
              type="number"
              value={targetZ}
              onChange={(e) => setTargetZ(e.target.value)}
              placeholder="0.00"
              className="mt-1"
            />
          </div>
          
          <Button
            onClick={handleGoTo}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-border"
          >
            GO TO POSITION
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
