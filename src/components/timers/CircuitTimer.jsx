import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Play, Pause, Square, Plus, Save, Trash2, ArrowUp, ArrowDown, 
  Check, Volume2, Volume1, VolumeX, Edit, ChevronRight
} from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCircuitTimer } from '@/hooks/use-timers';

const StationItem = ({ station, index, onUpdate, onRemove, onMoveUp, onMoveDown, isFirst, isLast, disabled }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(station.name);
  const [editedTime, setEditedTime] = useState(station.time);
  
  const handleSave = () => {
    onUpdate(index, { name: editedName, time: editedTime });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedName(station.name);
    setEditedTime(station.time);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <div className="flex items-center gap-2 py-1 border-b last:border-0">
        <div className="flex-1">
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Nome da estação"
            className="mb-1"
            disabled={disabled}
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={5}
              max={600}
              value={editedTime}
              onChange={(e) => setEditedTime(Number(e.target.value))}
              className="w-24"
              disabled={disabled}
            />
            <span className="text-sm text-muted-foreground">segundos</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={disabled}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            disabled={disabled}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 py-2 border-b last:border-0">
      <div className="flex-1">
        <div className="font-medium">{station.name}</div>
        <div className="text-sm text-muted-foreground">{station.time} segundos</div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
          disabled={disabled}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          disabled={disabled}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMoveUp(index)}
          disabled={isFirst || disabled}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMoveDown(index)}
          disabled={isLast || disabled}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const TimerDisplay = ({ seconds, totalSeconds, stationName, nextStationName }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="relative">
        <Progress 
          value={progress} 
          className="h-4 bg-green-200" 
        />
        <div 
          className="absolute inset-0 flex items-center justify-center text-xs font-medium text-green-800"
        >
          {stationName}
        </div>
      </div>
      <div className="text-6xl font-bold mt-4 text-green-600">
        {minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
      </div>
      {nextStationName && (
        <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
          <span>Próximo:</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium">{nextStationName}</span>
        </div>
      )}
    </div>
  );
};

const StationIndicator = ({ currentStation, totalStations }) => {
  return (
    <div className="mt-4 text-center">
      <p className="text-muted-foreground">Estação</p>
      <div className="text-2xl font-bold">
        {currentStation + 1} / {totalStations}
      </div>
    </div>
  );
};

const CircuitTimer = () => {
  const { 
    config, 
    setConfig, 
    presets, 
    addStation,
    removeStation,
    updateStation,
    addPreset, 
    removePreset, 
    loadPreset 
  } = useCircuitTimer();
  
  const [timer, setTimer] = useState(config.stations[0]?.time || 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [savePresetDialogOpen, setSavePresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [completedTime, setCompletedTime] = useState(0);
  
  // Refs para os áudios
  const changeSoundRef = useRef(null);
  const endSoundRef = useRef(null);
  const countdownSoundRef = useRef(null);
  
  // Temporizador
  const intervalRef = useRef(null);
  
  // Calcular o total de segundos do timer atual
  const currentStation = config.stations[currentStationIndex] || { name: 'Nenhuma estação', time: 60 };
  const nextStation = config.stations[currentStationIndex + 1];
  const totalSeconds = currentStation.time;
  
  // Mover estação para cima
  const moveStationUp = (index) => {
    if (index <= 0) return;
    
    const newStations = [...config.stations];
    const temp = newStations[index];
    newStations[index] = newStations[index - 1];
    newStations[index - 1] = temp;
    
    setConfig({
      ...config,
      stations: newStations
    });
  };
  
  // Mover estação para baixo
  const moveStationDown = (index) => {
    if (index >= config.stations.length - 1) return;
    
    const newStations = [...config.stations];
    const temp = newStations[index];
    newStations[index] = newStations[index + 1];
    newStations[index + 1] = temp;
    
    setConfig({
      ...config,
      stations: newStations
    });
  };
  
  // Função para iniciar/pausar o timer
  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      // Se o timer estiver em 0 ou não houver estações, reinicie-o
      if (timer === 0 || config.stations.length === 0) {
        resetTimer();
        return;
      }
      
      // Esconder o resumo ao reiniciar
      setShowSummary(false);
      
      intervalRef.current = setInterval(() => {
        setTimer(prevTime => {
          if (prevTime === 1) {
            // Quando o timer chega a 0
            if (currentStationIndex >= config.stations.length - 1) {
              // Fim de todas as estações
              clearInterval(intervalRef.current);
              playSound(endSoundRef);
              setIsRunning(false);
              
              // Calcular o tempo total
              const totalTime = config.stations.reduce((sum, station) => sum + station.time, 0);
              setCompletedTime(totalTime);
              setShowSummary(true);
              
              return 0;
            } else {
              // Próxima estação
              setCurrentStationIndex(prev => prev + 1);
              playSound(changeSoundRef);
              return config.stations[currentStationIndex + 1].time;
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
    setCurrentStationIndex(0);
    setTimer(config.stations[0]?.time || 60);
    setShowSummary(false);
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
      setTimer(config.stations[0]?.time || 60);
    }
  }, [config.stations, isRunning]);
  
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
    changeSoundRef.current = new Audio(`/${config.changeSound}`);
    endSoundRef.current = new Audio(`/${config.endSound}`);
    countdownSoundRef.current = new Audio(`/${config.countdownSound}`);
    
    return () => {
      // Limpar recursos de áudio ao desmontar
      changeSoundRef.current = null;
      endSoundRef.current = null;
      countdownSoundRef.current = null;
    };
  }, [config.changeSound, config.endSound, config.countdownSound]);
  
  // Atualizar os arquivos de áudio quando o volume mudar
  useEffect(() => {
    const updateVolume = (audio) => {
      if (audio) {
        audio.volume = muted ? 0 : volume;
      }
    };
    
    updateVolume(changeSoundRef.current);
    updateVolume(endSoundRef.current);
    updateVolume(countdownSoundRef.current);
  }, [volume, muted]);
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Timer de Circuito</CardTitle>
            <CardDescription>
              Organize várias estações de treino seguidas
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
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Estações do Circuito</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addStation()}
                  disabled={isRunning}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>
              
              <ScrollArea className="h-[300px] pr-4">
                {config.stations.length > 0 ? (
                  config.stations.map((station, index) => (
                    <StationItem
                      key={index}
                      station={station}
                      index={index}
                      onUpdate={updateStation}
                      onRemove={removeStation}
                      onMoveUp={moveStationUp}
                      onMoveDown={moveStationDown}
                      isFirst={index === 0}
                      isLast={index === config.stations.length - 1}
                      disabled={isRunning}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma estação adicionada</p>
                    <p className="text-sm mt-1">Clique em "Adicionar" para criar sua primeira estação</p>
                  </div>
                )}
              </ScrollArea>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
              <p className="text-sm font-medium">Resumo do Circuito:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Total de Estações: <span className="font-medium">{config.stations.length}</span></div>
                <div>
                  Duração Total: <span className="font-medium">
                    {Math.floor(config.stations.reduce((total, station) => total + station.time, 0) / 60)} min e {config.stations.reduce((total, station) => total + station.time, 0) % 60} s
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center space-y-6">
            {showSummary ? (
              <div className="text-center space-y-4 w-full max-w-md mx-auto">
                <h3 className="text-xl font-bold text-green-600">Circuito Concluído!</h3>
                <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                  <p className="font-medium">Resumo da Atividade:</p>
                  <div className="text-sm space-y-2">
                    <div>Estações: <span className="font-medium">{config.stations.length}</span></div>
                    <div>
                      Tempo Total: <span className="font-medium">
                        {Math.floor(completedTime / 60)} min e {completedTime % 60} s
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="default" 
                  onClick={resetTimer}
                  className="mt-4"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Reiniciar Circuito
                </Button>
              </div>
            ) : (
              <>
                <TimerDisplay 
                  seconds={timer} 
                  totalSeconds={totalSeconds}
                  stationName={currentStation.name}
                  nextStationName={nextStation?.name}
                />
                
                <StationIndicator 
                  currentStation={currentStationIndex} 
                  totalStations={config.stations.length} 
                />
                
                <div className="flex gap-3 mt-4">
                  <Button
                    variant={isRunning ? "outline" : "default"}
                    size="lg"
                    onClick={toggleTimer}
                    className="w-24"
                    disabled={config.stations.length === 0}
                  >
                    {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isRunning ? "Pausar" : "Iniciar"}
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={resetTimer}
                    disabled={!isRunning && timer === config.stations[0]?.time && currentStationIndex === 0}
                    className="w-24"
                  >
                    <Square className="mr-2 h-4 w-4" />
                    Parar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Modal para salvar preset */}
        <Dialog open={savePresetDialogOpen} onOpenChange={setSavePresetDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Salvar Preset</DialogTitle>
              <DialogDescription>
                Dê um nome para este circuito para salvá-lo como preset.
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
                placeholder="Ex: Circuito Cardio"
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

export default CircuitTimer;