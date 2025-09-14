import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Play, Pause, Square, Save, Trash2, Check, Volume2, Volume1, VolumeX,
  Cast, Share2, Monitor
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
import { useRolaTimer } from '@/hooks/use-timers';

const TimerDisplay = ({ seconds, isRestPhase, totalSeconds, fullscreen }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  // Tamanhos baseados no modo de exibição
  const fontSize = fullscreen ? "text-[120px]" : "text-6xl";
  const progressHeight = fullscreen ? "h-8" : "h-4";
  const progressTextSize = fullscreen ? "text-xl" : "text-xs";

  return (
    <div className={`w-full ${fullscreen ? 'max-w-3xl' : 'max-w-md'} mx-auto text-center`}>
      <div className="relative">
        <Progress 
          value={progress} 
          className={`${progressHeight} ${isRestPhase ? 'bg-blue-200' : 'bg-red-200'}`} 
        />
        <div 
          className={`absolute inset-0 flex items-center justify-center ${progressTextSize} font-medium ${isRestPhase ? 'text-blue-800' : 'text-red-800'}`}
        >
          {isRestPhase ? 'DESCANSO' : 'ROLA'}
        </div>
      </div>
      <div className={`${fontSize} font-bold mt-4 ${isRestPhase ? 'text-blue-600' : 'text-red-600'}`}>
        {minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

const RoundIndicator = ({ currentRound, totalRounds, fullscreen }) => {
  const fontSize = fullscreen ? "text-4xl" : "text-2xl";
  const labelSize = fullscreen ? "text-xl" : "text-sm";

  return (
    <div className="mt-4 text-center">
      <p className={`${labelSize} text-muted-foreground`}>Round</p>
      <div className={`${fontSize} font-bold`}>
        {currentRound} / {totalRounds}
      </div>
    </div>
  );
};

// Componente para exibição em tela cheia
const FullscreenDisplay = ({ 
  seconds, 
  isRestPhase, 
  totalSeconds, 
  currentRound, 
  totalRounds, 
  isRunning, 
  onToggleTimer, 
  onResetTimer, 
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 p-6">
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
        <TimerDisplay 
          seconds={seconds} 
          isRestPhase={isRestPhase} 
          totalSeconds={totalSeconds}
          fullscreen={true}
        />
        
        <RoundIndicator 
          currentRound={currentRound} 
          totalRounds={totalRounds} 
          fullscreen={true}
        />
        
        <div className="flex gap-6 mt-12">
          <Button
            variant={isRunning ? "outline" : "default"}
            size="lg"
            onClick={onToggleTimer}
            className="h-16 w-36 text-lg"
          >
            {isRunning ? <Pause className="mr-3 h-6 w-6" /> : <Play className="mr-3 h-6 w-6" />}
            {isRunning ? "Pausar" : "Iniciar"}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onClick={onResetTimer}
            className="h-16 w-36 text-lg"
          >
            <Square className="mr-3 h-6 w-6" />
            Parar
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="mt-10"
          onClick={onClose}
        >
          Sair do Modo Tela Cheia
        </Button>
      </div>
    </div>
  );
};

const RolaTimer = () => {
  const { 
    config, 
    setConfig, 
    presets, 
    addPreset, 
    removePreset, 
    loadPreset 
  } = useRolaTimer();
  
  const [timer, setTimer] = useState(config.rollTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isRestPhase, setIsRestPhase] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [savePresetDialogOpen, setSavePresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs para os áudios
  const startSoundRef = useRef(null);
  const restSoundRef = useRef(null);
  const endSoundRef = useRef(null);
  const countdownSoundRef = useRef(null);
  
  // Temporizador
  const intervalRef = useRef(null);
  
  // Calcular o total de segundos do timer atual
  const totalSeconds = isRestPhase ? config.restTime : config.rollTime;
  
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
      
      // Tocar som de início se estiver no início de um round (não for descanso e estiver na fase de rola)
      if (!isRestPhase && timer === config.rollTime) {
        playSound(startSoundRef);
      }
      
      intervalRef.current = setInterval(() => {
        setTimer(prevTime => {
          if (prevTime === 1) {
            // Quando o timer chega a 0, decidir o que fazer a seguir
            if (isRestPhase) {
              // Fim do descanso
              if (currentRound >= config.rounds) {
                // Fim de todos os rounds
                clearInterval(intervalRef.current);
                playSound(endSoundRef);
                setIsRunning(false);
                return 0;
              } else {
                // Próximo round
                setCurrentRound(prev => prev + 1);
                setIsRestPhase(false);
                playSound(startSoundRef);
                return config.rollTime;
              }
            } else {
              // Fim do rola, iniciar descanso
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
    setCurrentRound(1);
    setTimer(config.rollTime);
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
  
  // Função para entrar no modo tela cheia
  const enterFullscreen = () => {
    setIsFullscreen(true);
  };
  
  // Função para sair do modo tela cheia
  const exitFullscreen = () => {
    setIsFullscreen(false);
  };
  
  // Atualizar o timer quando as configurações mudarem
  useEffect(() => {
    if (!isRunning) {
      setTimer(config.rollTime);
    }
  }, [config.rollTime, isRunning]);
  
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
  
  // Modo tela cheia
  if (isFullscreen) {
    return (
      <FullscreenDisplay 
        seconds={timer}
        isRestPhase={isRestPhase}
        totalSeconds={totalSeconds}
        currentRound={currentRound}
        totalRounds={config.rounds}
        isRunning={isRunning}
        onToggleTimer={toggleTimer}
        onResetTimer={resetTimer}
        onClose={exitFullscreen}
      />
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Timer de Rola em Equipe</CardTitle>
            <CardDescription>
              Cronômetro centralizado para toda a turma
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
            
            <Button
              variant="outline"
              size="icon"
              onClick={enterFullscreen}
              title="Modo Tela Cheia"
            >
              <Monitor className="h-5 w-5" />
            </Button>
            
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
              <Label htmlFor="roll-time">Tempo de Rola (minutos)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="roll-time"
                  type="number"
                  min={1}
                  max={30}
                  value={Math.floor(config.rollTime / 60)}
                  onChange={(e) => setConfig({...config, rollTime: Number(e.target.value) * 60})}
                  disabled={isRunning}
                  className="w-24"
                />
                <Slider
                  value={[Math.floor(config.rollTime / 60)]}
                  min={1}
                  max={15}
                  step={1}
                  onValueChange={(value) => setConfig({...config, rollTime: value[0] * 60})}
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
                  min={10}
                  max={300}
                  value={config.restTime}
                  onChange={(e) => setConfig({...config, restTime: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-24"
                />
                <Slider
                  value={[config.restTime]}
                  min={10}
                  max={180}
                  step={10}
                  onValueChange={(value) => setConfig({...config, restTime: value[0]})}
                  disabled={isRunning}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="rounds">Número de Rounds</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="rounds"
                  type="number"
                  min={1}
                  max={20}
                  value={config.rounds}
                  onChange={(e) => setConfig({...config, rounds: Number(e.target.value)})}
                  disabled={isRunning}
                  className="w-24"
                />
                <Slider
                  value={[config.rounds]}
                  min={1}
                  max={12}
                  step={1}
                  onValueChange={(value) => setConfig({...config, rounds: value[0]})}
                  disabled={isRunning}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
              <p className="text-sm font-medium">Tempos Totais:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Tempo de Rola: <span className="font-medium">{Math.floor(config.rollTime / 60) * config.rounds} min</span></div>
                <div>Tempo de Descanso: <span className="font-medium">{Math.floor(config.restTime * config.rounds / 60)} min {(config.restTime * config.rounds) % 60} s</span></div>
                <div className="col-span-2">
                  Duração Total: <span className="font-medium">
                    {Math.floor((config.rollTime * config.rounds + config.restTime * config.rounds) / 60)} min {(config.rollTime * config.rounds + config.restTime * config.rounds) % 60} s
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Dicas:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <Monitor className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Use o modo de tela cheia para projetar em TVs ou monitores</span>
                </li>
                <li className="flex items-start gap-2">
                  <Volume2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Aumente o volume para que todos os alunos possam ouvir</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center space-y-6">
            <TimerDisplay 
              seconds={timer} 
              isRestPhase={isRestPhase} 
              totalSeconds={totalSeconds}
              fullscreen={false}
            />
            
            <RoundIndicator 
              currentRound={currentRound} 
              totalRounds={config.rounds} 
              fullscreen={false}
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
                disabled={!isRunning && timer === config.rollTime && currentRound === 1}
                className="w-24"
              >
                <Square className="mr-2 h-4 w-4" />
                Parar
              </Button>
            </div>
            
            <Button
              variant="outline"
              className="mt-4"
              onClick={enterFullscreen}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Modo Tela Cheia
            </Button>
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
                placeholder="Ex: 6x5 com 1 min"
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

export default RolaTimer;