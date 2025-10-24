interface PositionDisplayProps {
  position: { x: number; y: number; z: number };
}

const PositionDisplay = ({ position }: PositionDisplayProps) => {
  const formatCoord = (value: number) => value.toFixed(2).padStart(7, ' ');

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-muted-foreground text-xs mb-1">X AXIS</div>
        <div className="text-2xl font-bold glow-text">{formatCoord(position.x)}</div>
        <div className="text-xs text-muted-foreground mt-1">meters</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-muted-foreground text-xs mb-1">Y AXIS</div>
        <div className="text-2xl font-bold glow-text">{formatCoord(position.y)}</div>
        <div className="text-xs text-muted-foreground mt-1">meters</div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-muted-foreground text-xs mb-1">Z AXIS</div>
        <div className="text-2xl font-bold glow-text">{formatCoord(position.z)}</div>
        <div className="text-xs text-muted-foreground mt-1">meters</div>
      </div>
    </div>
  );
};

export default PositionDisplay;
