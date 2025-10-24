import { useState } from 'react';
import { useRobotStore, RobotConfig } from '@/stores/robotStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, Settings } from 'lucide-react';
import { toast } from 'sonner';

const RobotConfiguration = () => {
  const { currentConfig, availableConfigs, setCurrentConfig, addConfig } = useRobotStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Parse URDF file (simplified - in production, use proper URDF parser)
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          
          // Simple URDF parsing (this is a placeholder - real URDF parsing is more complex)
          // In production, you'd use a proper URDF parser library
          const jointMatches = content.match(/<joint[^>]*name="([^"]*)"[^>]*>/g) || [];
          
          const newConfig: RobotConfig = {
            id: `urdf-${Date.now()}`,
            name: file.name.replace('.urdf', ''),
            manufacturer: 'Custom',
            model: 'URDF Import',
            dof: jointMatches.length,
            joints: jointMatches.map((_, index) => ({
              id: index + 1,
              name: `Joint ${index + 1}`,
              angle: 0,
              targetAngle: 0,
              minLimit: -180,
              maxLimit: 180,
              velocity: 0,
              torque: 0,
              enabled: true,
            })),
          };
          
          addConfig(newConfig);
          setCurrentConfig(newConfig);
          toast.success(`Loaded robot configuration: ${newConfig.name}`);
          setIsDialogOpen(false);
        } catch (error) {
          toast.error('Failed to parse URDF file');
          console.error(error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="card-premium rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Robot Configuration
          </h3>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Robot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Robot Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Upload URDF File</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept=".urdf,.xml"
                    onChange={handleFileUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a URDF file to automatically configure robot joints and geometry
                </p>
              </div>
              
              {uploadedFile && (
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ready to import</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Active Robot</Label>
          <Select
            value={currentConfig?.id}
            onValueChange={(value) => {
              const config = availableConfigs.find(c => c.id === value);
              if (config) {
                setCurrentConfig(config);
                toast.success(`Switched to ${config.name}`);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableConfigs.map((config) => (
                <SelectItem key={config.id} value={config.id}>
                  {config.name} ({config.dof} DOF)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentConfig && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/20 rounded-lg">
            <div>
              <div className="text-xs text-muted-foreground">Manufacturer</div>
              <div className="text-sm font-semibold text-foreground">{currentConfig.manufacturer}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Model</div>
              <div className="text-sm font-semibold text-foreground">{currentConfig.model}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Degrees of Freedom</div>
              <div className="text-sm font-semibold text-foreground">{currentConfig.dof}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Active Joints</div>
              <div className="text-sm font-semibold text-foreground">
                {currentConfig.joints.filter(j => j.enabled).length}/{currentConfig.joints.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RobotConfiguration;
