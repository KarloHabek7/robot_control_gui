import { create } from 'zustand';

export interface Joint {
  id: number;
  name: string;
  angle: number; // current angle in degrees
  targetAngle: number; // target angle in degrees
  minLimit: number;
  maxLimit: number;
  velocity: number; // degrees per second
  torque: number; // percentage
  enabled: boolean;
}

export interface RobotConfig {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  dof: number;
  joints: Joint[];
}

interface RobotState {
  // Current robot configuration
  currentConfig: RobotConfig | null;
  
  // Available robot configurations
  availableConfigs: RobotConfig[];
  
  // Connection status
  isConnected: boolean;
  connectionUrl: string;
  
  // Robot network configuration
  robotIP: string;
  robotPort: number;
  
  // Program control
  isProgramRunning: boolean;
  currentProgramName: string;
  
  // Position (end effector)
  position: { x: number; y: number; z: number };
  
  // Actions
  setCurrentConfig: (config: RobotConfig) => void;
  addConfig: (config: RobotConfig) => void;
  updateJoint: (jointId: number, updates: Partial<Joint>) => void;
  setJointAngle: (jointId: number, angle: number) => void;
  setPosition: (position: { x: number; y: number; z: number }) => void;
  setConnectionStatus: (status: boolean) => void;
  setConnectionUrl: (url: string) => void;
  setRobotIP: (ip: string) => void;
  setRobotPort: (port: number) => void;
  setProgramRunning: (running: boolean) => void;
  setCurrentProgramName: (name: string) => void;
  resetJoints: () => void;
}

// Default 6-DOF robot configuration
const defaultConfig: RobotConfig = {
  id: 'default-6dof',
  name: 'Generic 6-DOF Robot',
  manufacturer: 'Generic',
  model: '6-Axis',
  dof: 6,
  joints: [
    { id: 1, name: 'Base', angle: 0, targetAngle: 0, minLimit: -180, maxLimit: 180, velocity: 0, torque: 0, enabled: true },
    { id: 2, name: 'Shoulder', angle: 0, targetAngle: 0, minLimit: -90, maxLimit: 90, velocity: 0, torque: 0, enabled: true },
    { id: 3, name: 'Elbow', angle: 0, targetAngle: 0, minLimit: -135, maxLimit: 135, velocity: 0, torque: 0, enabled: true },
    { id: 4, name: 'Wrist 1', angle: 0, targetAngle: 0, minLimit: -180, maxLimit: 180, velocity: 0, torque: 0, enabled: true },
    { id: 5, name: 'Wrist 2', angle: 0, targetAngle: 0, minLimit: -180, maxLimit: 180, velocity: 0, torque: 0, enabled: true },
    { id: 6, name: 'Wrist 3', angle: 0, targetAngle: 0, minLimit: -180, maxLimit: 180, velocity: 0, torque: 0, enabled: true },
  ],
};

export const useRobotStore = create<RobotState>((set) => ({
  currentConfig: defaultConfig,
  availableConfigs: [defaultConfig],
  isConnected: false,
  connectionUrl: 'ws://localhost:8080',
  robotIP: '192.168.1.100',
  robotPort: 30002,
  isProgramRunning: false,
  currentProgramName: '',
  position: { x: 0, y: 0, z: 0 },
  
  setCurrentConfig: (config) => set({ currentConfig: config }),
  
  addConfig: (config) => set((state) => ({
    availableConfigs: [...state.availableConfigs, config],
  })),
  
  updateJoint: (jointId, updates) => set((state) => {
    if (!state.currentConfig) return state;
    
    return {
      currentConfig: {
        ...state.currentConfig,
        joints: state.currentConfig.joints.map((joint) =>
          joint.id === jointId ? { ...joint, ...updates } : joint
        ),
      },
    };
  }),
  
  setJointAngle: (jointId, angle) => set((state) => {
    if (!state.currentConfig) return state;
    
    return {
      currentConfig: {
        ...state.currentConfig,
        joints: state.currentConfig.joints.map((joint) =>
          joint.id === jointId ? { ...joint, angle, targetAngle: angle } : joint
        ),
      },
    };
  }),
  
  setPosition: (position) => set({ position }),
  
  setConnectionStatus: (status) => set({ isConnected: status }),
  
  setConnectionUrl: (url) => set({ connectionUrl: url }),
  
  setRobotIP: (ip) => set({ robotIP: ip }),
  
  setRobotPort: (port) => set({ robotPort: port }),
  
  setProgramRunning: (running) => set({ isProgramRunning: running }),
  
  setCurrentProgramName: (name) => set({ currentProgramName: name }),
  
  resetJoints: () => set((state) => {
    if (!state.currentConfig) return state;
    
    return {
      currentConfig: {
        ...state.currentConfig,
        joints: state.currentConfig.joints.map((joint) => ({
          ...joint,
          angle: 0,
          targetAngle: 0,
          velocity: 0,
          torque: 0,
        })),
      },
      position: { x: 0, y: 0, z: 0 },
    };
  }),
}));
