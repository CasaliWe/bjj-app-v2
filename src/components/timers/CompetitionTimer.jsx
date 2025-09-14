import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Play, Pause, Square, Save, Trash2, Check, Volume2, Volume1, VolumeX,
  Monitor, PlusCircle, MinusCircle, RotateCcw
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompetitionTimer } from '@/hooks/use-timers';

const TimerDisplay = ({ seconds, totalSeconds, isPaused, advantage1, advantage2, penalty1, penalty2, fullscreen }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  // Tamanhos baseados no modo de exibição
  const fontSize = fullscreen ? "text-[120px]" : "text-6xl";
  const progressHeight = fullscreen ? "h-8" : "h-4";
  const progressTextSize = fullscreen ? "text-xl" : "text-xs";
  const scoreSize = fullscreen ? "text-5xl" : "text-2xl";
  const advantagePenaltySize = fullscreen ? "text-2xl" : "text-sm";

  return (
    <div className={`w-full ${fullscreen ? 'max-w-3xl' : 'max-w-md'} mx-auto text-center`}>
      <div className="relative">
        <Progress 
          value={progress} 
          className={`${progressHeight} ${isPaused ? 'bg-amber-200' : 'bg-green-200'}`} 
        />
        <div 
          className={`absolute inset-0 flex items-center justify-center ${progressTextSize} font-medium ${isPaused ? 'text-amber-800' : 'text-green-800'}`}
        >
          {isPaused ? 'PAUSADO' : 'EM ANDAMENTO'}
        </div>
      </div>
      
      <div className={`${fontSize} font-bold mt-4 ${isPaused ? 'text-amber-600' : 'text-green-600'}`}>
        {minutes.toString().padStart(2, '0')}:{remainingSeconds.toString().padStart(2, '0')}
      </div>
      
      {/* Seção de pontuação (opcional para competição) */}
      <div className="mt-6 grid grid-cols-2 gap-8">
        <div className="text-center space-y-2">
          <div className={`${advantagePenaltySize} text-blue-600`}>
            <span className="mr-2">A:</span>{advantage1}
            <span className="ml-4 mr-2">P:</span>{penalty1}
          </div>
        </div>
        <div className="text-center space-y-2">
          <div className={`${advantagePenaltySize} text-red-600`}>
            <span className="mr-2">A:</span>{advantage2}
            <span className="ml-4 mr-2">P:</span>{penalty2}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para exibição em tela cheia
const FullscreenDisplay = ({ 
  seconds, 
  totalSeconds, 
  isPaused,
  advantage1,
  advantage2,
  penalty1,
  penalty2,
  onAdvantage1Change,
  onAdvantage2Change,
  onPenalty1Change,
  onPenalty2Change,
  isRunning, 
  onToggleTimer, 
  onResetTimer, 
  onPauseTimer,
  onResumeTimer,
  onClose 
}) => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 p-6">
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center">
        <TimerDisplay 
          seconds={seconds} 
          isPaused={isPaused}
          totalSeconds={totalSeconds}
          advantage1={advantage1}
          advantage2={advantage2}
          penalty1={penalty1}
          penalty2={penalty2}
          fullscreen={true}
        />
        
        <div className="grid grid-cols-2 gap-12 mt-10 w-full max-w-xl">
          {/* Lutador 1 (Azul) */}
          <div className="space-y-3">
            <div className="text-center text-xl font-medium text-blue-600">Lutador Azul</div>
            <div className="flex justify-around">
              <div className="text-center">
                <div className="mb-1 text-sm">Vantagens</div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onAdvantage1Change(advantage1 - 1)}
                    disabled={advantage1 <= 0}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-8">{advantage1}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onAdvantage1Change(advantage1 + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-sm">Punições</div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onPenalty1Change(penalty1 - 1)}
                    disabled={penalty1 <= 0}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-8">{penalty1}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onPenalty1Change(penalty1 + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lutador 2 (Vermelho) */}
          <div className="space-y-3">
            <div className="text-center text-xl font-medium text-red-600">Lutador Vermelho</div>
            <div className="flex justify-around">
              <div className="text-center">
                <div className="mb-1 text-sm">Vantagens</div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onAdvantage2Change(advantage2 - 1)}
                    disabled={advantage2 <= 0}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-8">{advantage2}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onAdvantage2Change(advantage2 + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-sm">Punições</div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onPenalty2Change(penalty2 - 1)}
                    disabled={penalty2 <= 0}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold w-8">{penalty2}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onPenalty2Change(penalty2 + 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-6 mt-12">
          {isRunning ? (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={onPauseTimer}
                className="h-16 w-36 text-lg"
              >
                <Pause className="mr-3 h-6 w-6" />
                Pausar
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
            </>
          ) : isPaused ? (
            <>
              <Button
                variant="default"
                size="lg"
                onClick={onResumeTimer}
                className="h-16 w-36 text-lg"
              >
                <Play className="mr-3 h-6 w-6" />
                Continuar
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
            </>
          ) : (
            <>
              <Button
                variant="default"
                size="lg"
                onClick={onToggleTimer}
                className="h-16 w-36 text-lg"
              >
                <Play className="mr-3 h-6 w-6" />
                Iniciar
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onResetTimer}
                disabled={seconds === totalSeconds}
                className="h-16 w-36 text-lg"
              >
                <RotateCcw className="mr-3 h-6 w-6" />
                Reiniciar
              </Button>
            </>
          )}
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

const CompetitionTimer = () => {
  const { 
    config, 
    setConfig, 
    presets, 
    selectCategory,
    addPreset, 
    removePreset, 
    loadPreset,
    categories
  } = useCompetitionTimer();
  
  const [timer, setTimer] = useState(config.time);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [savePresetDialogOpen, setSavePresetDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Estados para pontuação (opcional para competição)
  const [advantage1, setAdvantage1] = useState(0);
  const [advantage2, setAdvantage2] = useState(0);
  const [penalty1, setPenalty1] = useState(0);
  const [penalty2, setPenalty2] = useState(0);
  
  // Refs para os áudios
  const startSoundRef = useRef(null);
  const endSoundRef = useRef(null);
  const countdownSoundRef = useRef(null);
  
  // Temporizador
  const intervalRef = useRef(null);
  
  // Calcular o total de segundos do timer
  const totalSeconds = config.time;
  
  // Função para iniciar o timer
  const startTimer = () => {
    if (timer === 0) {
      resetTimer();
      return;
    }
    
    // Tocar som de início
    playSound(startSoundRef);
    
    intervalRef.current = setInterval(() => {
      setTimer(prevTime => {
        if (prevTime === 1) {
          // Quando o timer chega a 0
          clearInterval(intervalRef.current);
          playSound(endSoundRef);
          setIsRunning(false);
          return 0;
        } else if (prevTime <= 11 && prevTime > 0) {
          // Tocar som de contagem regressiva nos últimos 10 segundos
          playSound(countdownSoundRef);
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setIsRunning(true);
    setIsPaused(false);
  };
  
  // Função para pausar o timer
  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(true);
  };
  
  // Função para retomar o timer
  const resumeTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer(prevTime => {
        if (prevTime === 1) {
          // Quando o timer chega a 0
          clearInterval(intervalRef.current);
          playSound(endSoundRef);
          setIsRunning(false);
          return 0;
        } else if (prevTime <= 11 && prevTime > 0) {
          // Tocar som de contagem regressiva nos últimos 10 segundos
          playSound(countdownSoundRef);
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setIsRunning(true);
    setIsPaused(false);
  };
  
  // Função para reiniciar o timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setTimer(config.time);
    setAdvantage1(0);
    setAdvantage2(0);
    setPenalty1(0);
    setPenalty2(0);
  };
  
  // Função para alternar entre iniciar/pausar/retomar
  const toggleTimer = () => {
    if (isRunning) {
      pauseTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      startTimer();
    }
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
    if (!isRunning && !isPaused) {
      setTimer(config.time);
    }
  }, [config.time, isRunning, isPaused]);
  
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
    endSoundRef.current = new Audio(`/${config.endSound}`);
    countdownSoundRef.current = new Audio(`/${config.countdownSound}`);
    
    return () => {
      // Limpar recursos de áudio ao desmontar
      startSoundRef.current = null;
      endSoundRef.current = null;
      countdownSoundRef.current = null;
    };
  }, [config.startSound, config.endSound, config.countdownSound]);
  
  // Atualizar os arquivos de áudio quando o volume mudar
  useEffect(() => {
    const updateVolume = (audio) => {
      if (audio) {
        audio.volume = muted ? 0 : volume;
      }
    };
    
    updateVolume(startSoundRef.current);
    updateVolume(endSoundRef.current);
    updateVolume(countdownSoundRef.current);
  }, [volume, muted]);
  
  // Modo tela cheia
  if (isFullscreen) {
    return (
      <FullscreenDisplay 
        seconds={timer}
        totalSeconds={totalSeconds}
        isPaused={isPaused}
        advantage1={advantage1}
        advantage2={advantage2}
        penalty1={penalty1}
        penalty2={penalty2}
        onAdvantage1Change={setAdvantage1}
        onAdvantage2Change={setAdvantage2}
        onPenalty1Change={setPenalty1}
        onPenalty2Change={setPenalty2}
        isRunning={isRunning}
        onToggleTimer={startTimer}
        onPauseTimer={pauseTimer}
        onResumeTimer={resumeTimer}
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
            <CardTitle>Modo Competição (IBJJF)</CardTitle>
            <CardDescription>
              Simular condições reais de campeonato
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
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={config.category}
                onValueChange={(value) => selectCategory(value)}
                disabled={isRunning || isPaused}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label} - {Math.floor(cat.time / 60)}min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="time">Tempo de Luta (minutos)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="time"
                  type="number"
                  min={1}
                  max={30}
                  value={Math.floor(config.time / 60)}
                  onChange={(e) => setConfig({...config, time: Number(e.target.value) * 60})}
                  disabled={isRunning || isPaused}
                  className="w-24"
                />
                <Slider
                  value={[Math.floor(config.time / 60)]}
                  min={1}
                  max={15}
                  step={1}
                  onValueChange={(value) => setConfig({...config, time: value[0] * 60})}
                  disabled={isRunning || isPaused}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Lutador Azul</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="advantage1" className="text-xs">Vantagens</Label>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setAdvantage1(prev => Math.max(0, prev - 1))}
                        disabled={advantage1 <= 0}
                        className="h-7 w-7"
                      >
                        <MinusCircle className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 w-6 text-center">{advantage1}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setAdvantage1(prev => prev + 1)}
                        className="h-7 w-7"
                      >
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="penalty1" className="text-xs">Punições</Label>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setPenalty1(prev => Math.max(0, prev - 1))}
                        disabled={penalty1 <= 0}
                        className="h-7 w-7"
                      >
                        <MinusCircle className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 w-6 text-center">{penalty1}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setPenalty1(prev => prev + 1)}
                        className="h-7 w-7"
                      >
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Lutador Vermelho</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="advantage2" className="text-xs">Vantagens</Label>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setAdvantage2(prev => Math.max(0, prev - 1))}
                        disabled={advantage2 <= 0}
                        className="h-7 w-7"
                      >
                        <MinusCircle className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 w-6 text-center">{advantage2}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setAdvantage2(prev => prev + 1)}
                        className="h-7 w-7"
                      >
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="penalty2" className="text-xs">Punições</Label>
                    <div className="flex items-center mt-1">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setPenalty2(prev => Math.max(0, prev - 1))}
                        disabled={penalty2 <= 0}
                        className="h-7 w-7"
                      >
                        <MinusCircle className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 w-6 text-center">{penalty2}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setPenalty2(prev => prev + 1)}
                        className="h-7 w-7"
                      >
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Dicas:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <Monitor className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Use o modo de tela cheia para uma visualização clara como árbitro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Volume2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Os últimos 10 segundos têm contagem regressiva sonora</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col justify-center items-center space-y-6">
            <TimerDisplay 
              seconds={timer} 
              totalSeconds={totalSeconds}
              isPaused={isPaused}
              advantage1={advantage1}
              advantage2={advantage2}
              penalty1={penalty1}
              penalty2={penalty2}
              fullscreen={false}
            />
            
            <div className="flex gap-3 mt-4">
              {isRunning ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={pauseTimer}
                  className="w-24"
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pausar
                </Button>
              ) : isPaused ? (
                <Button
                  variant="default"
                  size="lg"
                  onClick={resumeTimer}
                  className="w-24"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Continuar
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  onClick={startTimer}
                  className="w-24"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
              )}
              
              <Button
                variant={timer === config.time ? "outline" : "destructive"}
                size="lg"
                onClick={resetTimer}
                disabled={!isRunning && !isPaused && timer === config.time}
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
                placeholder="Ex: Adulto Faixa Azul"
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

export default CompetitionTimer;