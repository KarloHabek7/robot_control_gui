interface PositionDisplayProps {
  position: { x: number; y: number; z: number };
}

const PositionDisplay = ({ position }: PositionDisplayProps) => {
  const formatCoord = (value: number) => value.toFixed(2);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="card-premium rounded-xl p-5 shadow-lg hover:shadow-glow transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">X Axis</div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        <div className="text-3xl font-bold text-foreground mb-1">{formatCoord(position.x)}</div>
        <div className="text-xs text-muted-foreground">meters</div>
      </div>
      <div className="card-premium rounded-xl p-5 shadow-lg hover:shadow-glow transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Y Axis</div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        <div className="text-3xl font-bold text-foreground mb-1">{formatCoord(position.y)}</div>
        <div className="text-xs text-muted-foreground">meters</div>
      </div>
      <div className="card-premium rounded-xl p-5 shadow-lg hover:shadow-glow transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Z Axis</div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
        <div className="text-3xl font-bold text-foreground mb-1">{formatCoord(position.z)}</div>
        <div className="text-xs text-muted-foreground">meters</div>
      </div>
    </div>
  );
};

export default PositionDisplay;
