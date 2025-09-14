import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Play, Pause, Square, Plus, Save, Trash2, Check, Volume2, Volume1, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTabataTimer } from '@/hooks/use-timers';

const TimerDisplay = ({ seconds, isRestPhase, totalSeconds }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="relative">
        <Progress 
          value={progress} 
          className={`h-4 ${isRestPhase ? 'bg-blue-200' : 'bg-red-200'}`} 
        />
        <div 
          className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${isRestPhase ? 'text-blue-800' : 'text-red-800'}`}
        >
          {isRestPhase ? 'Descanso' : 'Trabalho'}
        </div>
      </div>
      <div className={`text-6xl font-bold mt-4 ${isRestPhase ? 'text-blue-600' : 'text-red-600'}`}>
        {minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

const CycleIndicator = ({ currentCycle, totalCycles }) => {
  return (
    <div className="mt-4 text-center">
      <p className="text-muted-foreground">Ciclo</p>
      <div className="text-2xl font-bold">
        {currentCycle} / {totalCycles}
      </div>
    </div>
  );
};

const TabataTimer = () => {
  const { 
    config, 
    setConfig, 
    presets, 
    addPreset, 
    removePreset, 
    loadPreset 
  } = useTabataTimer();
  
  const [timer, setTimer] = useState(config.workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [savePresetDialogOpen, setSavePresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  
  // Refs para os áudios
  const startSoundRef = useRef(null);
  const restSoundRef = useRef(null);
  const endSoundRef = useRef(null);
  const countdownSoundRef = useRef(null);
  
  // Temporizador
  const intervalRef = useRef(null);
  
  // Calcular o total de segundos do timer atual
  const totalSeconds = isRestPhase ? config.restTime : config.workTime;
  
  // Função para iniciar/pausar o timer
  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      // Se o timer estiver em 0, reinicie-o
      if (timer === 0) {
        resetTimer();
        return;
      }
      
      // Tocar som de início se estiver no início de um ciclo (não for descanso e estiver na fase de trabalho)
      if (!isRestPhase && timer === config.workTime) {
        playSound(startSoundRef);
      }
      
      intervalRef.current = setInterval(() => {
        setTimer(prevTime => {
          if (prevTime === 1) {
            // Quando o timer chega a 0, decidir o que fazer a seguir
            if (isRestPhase) {
              // Fim do descanso
              if (currentCycle >= config.cycles) {
                // Fim de todos os ciclos
                clearInterval(intervalRef.current);
                playSound(endSoundRef);
                setIsRunning(false);
                return 0;
              } else {
                // Próximo ciclo
                setCurrentCycle(prev => prev + 1);
                setIsRestPhase(false);
                playSound(startSoundRef);
                return config.workTime;
              }
            } else {
              // Fim do trabalho, iniciar descanso
              setIsRestPhase(true);
              playSound(restSoundRef);
              return config.restTime;
            }
          } else if (prevTime <= 4 && prevTime > 0) {
            // Tocar som de contagem regressiva nos últimos 3 segundos
            playSound(countdownSoundRef);
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    setIsRunning(!isRunning);
  };
  
  // Função para reiniciar o timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsRestPhase(false);
    setCurrentCycle(1);
    setTimer(config.workTime);
  };
  
  // Função para salvar preset
  const handleSavePreset = () => {
    if (presetName.trim()) {
      addPreset(presetName);
      setSavePresetDialogOpen(false);
      setPresetName('');
    }
  };
  
  // Função para tocar som
  const playSound = (soundRef) => {
    if (soundRef.current && !muted) {
      soundRef.current.volume = volume;
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(error => {
        console.error("Erro ao tocar som:", error);
      });
    }
  };
  
  // Atualizar o timer quando as configurações mudarem
  useEffect(() => {
    if (!isRunning) {
      setTimer(config.workTime);
    }
  }, [config.workTime, isRunning]);
  
  // Limpar intervalo ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  // Carregar arquivos de áudio quando o componente montar
  useEffect(() => {
    startSoundRef.current = new Audio(`/${config.startSound}`);
    restSoundRef.current = new Audio(`/${config.restSound}`);
    endSoundRef.current = new Audio(`/${config.endSound}`);
    countdownSoundRef.current = new Audio(`/${config.countdownSound}`);
    
    return () => {
      // Limpar recursos de áudio ao desmontar
      startSoundRef.current = null;
      restSoundRef.current = null;
      endSoundRef.current = null;
      countdownSoundRef.current = null;
    };
  }, [config.startSound, config.restSound, config.endSound, config.countdownSound]);
  
  // Atualizar os arquivos de áudio quando o volume mudar
  useEffect(() => {
    const updateVolume = (audio) => {
      if (audio) {
        audio.volume = muted ? 0 : volume;
      }
    };
    
    updateVolume(startSoundRef.current);
    updateVolume(restSoundRef.current);
    updateVolume(endSoundRef.current);
    updateVolume(countdownSoundRef.current);
  }, [volume, muted]);
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Timer Tabata</CardTitle>
            <CardDescription>
              Método de treino intervalado de alta intensidade
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setMuted(!muted)}
              title={muted ? "Ativar som" : "Silenciar"}
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : volume > 0.5 ? (
                <Volume2 className="h-5 w-5" />
              ) : (
                <Volume1 className="h-5 w-5" />
              )}
            </Button>
            {!muted && (
              <Slider
                className="w-24 mr-2"
                value={[volume * 100]}
                min={0}
                max={100}
                step={10}
                onValueChange={(value) => setVolume(value[0] / 100)}
              />
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">Presets</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Presets Salvos</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {presets.length > 0 ? (
                  presets.map(preset => (
                    <DropdownMenuItem 
                      key={preset.id}
                      className="flex items-center justify-between"
                      onClick={() => loadPreset(preset.id)}
                    >
                      <span>{preset.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePreset(preset.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>Nenhum preset salvo</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSavePresetDialogOpen(true)}>
                  <Save className="mr-2 h-4 w-4" />
                  <span>Salvar configuração atual</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="work-time">Tempo de Esforço (segundos)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="work-time"
                  type="number"
                  min={5}
                  max={300}
                  value={config.workTime}
                  onChange={(e) => setConfig({...config, workTime: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-24"
                />
                <Slider
                  value={[config.workTime]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={(value) => setConfig({...config, workTime: value[0]})}
                  disabled={isRunning}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="rest-time">Tempo de Descanso (segundos)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="rest-time"
                  type="number"
                  min={5}
                  max={120}
                  value={config.restTime}
                  onChange={(e) => setConfig({...config, restTime: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-24"
                />
                <Slider
                  value={[config.restTime]}
                  min={5}
                  max={60}
                  step={5}
                  onValueChange={(value) => setConfig({...config, restTime: value[0]})}
                  disabled={isRunning}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="cycles">Número de Ciclos</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cycles"
                  type="number"
                  min={1}
                  max={20}
                  value={config.cycles}
                  onChange={(e) => setConfig({...config, cycles: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-24"
                />
                <Slider
                  value={[config.cycles]}
                  min={1}
                  max={12}
                  step={1}
                  onValueChange={(value) => setConfig({...config, cycles: value[0]})}
                  disabled={isRunning}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
              <p className="text-sm font-medium">Tempos Totais:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Tempo de Esforço: <span className="font-medium">{(config.workTime * config.cycles) / 60} min</span></div>
                <div>Tempo de Descanso: <span className="font-medium">{(config.restTime * config.cycles) / 60} min</span></div>
                <div className="col-span-2">
                  Duração Total: <span className="font-medium">{(config.workTime * config.cycles + config.restTime * config.cycles) / 60} min</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center space-y-6">
            <TimerDisplay 
              seconds={timer} 
              isRestPhase={isRestPhase} 
              totalSeconds={totalSeconds}
            />
            
            <CycleIndicator 
              currentCycle={currentCycle} 
              totalCycles={config.cycles} 
            />
            
            <div className="flex gap-3 mt-4">
              <Button
                variant={isRunning ? "outline" : "default"}
                size="lg"
                onClick={toggleTimer}
                className="w-24"
              >
                {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isRunning ? "Pausar" : "Iniciar"}
              </Button>
              <Button
                variant="destructive"
                size="lg"
                onClick={resetTimer}
                disabled={!isRunning && timer === config.workTime && currentCycle === 1}
                className="w-24"
              >
                <Square className="mr-2 h-4 w-4" />
                Parar
              </Button>
            </div>
          </div>
        </div>
        
        {/* Modal para salvar preset */}
        <Dialog open={savePresetDialogOpen} onOpenChange={setSavePresetDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Salvar Preset</DialogTitle>
              <DialogDescription>
                Dê um nome para a configuração atual para salvá-la como preset.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="preset-name" className="text-right">
                Nome do Preset
              </Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="mt-2"
                autoFocus
                placeholder="Ex: HIIT 20/10"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSavePresetDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TabataTimer;