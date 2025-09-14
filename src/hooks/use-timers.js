/**
 * Hook personalizado para gerenciar as configurações dos timers
 * Usa cookies para persistir as configurações entre sessões
 */

import { useState, useEffect } from 'react';
import { setCookie, getCookie, hasCookie } from '@/services/cookies/cookies';

// Nome dos cookies para cada tipo de timer
const COOKIE_NAMES = {
  TABATA: 'bjj_timer_tabata_config',
  CIRCUIT: 'bjj_timer_circuit_config',
  ROLA: 'bjj_timer_rola_config',
  COMPETITION: 'bjj_timer_competition_config',
  PRESETS: {
    TABATA: 'bjj_timer_tabata_presets',
    CIRCUIT: 'bjj_timer_circuit_presets',
    ROLA: 'bjj_timer_rola_presets',
    COMPETITION: 'bjj_timer_competition_presets'
  }
};

// Configurações padrão para cada tipo de timer
const DEFAULT_CONFIGS = {
  TABATA: {
    workTime: 20, // segundos
    restTime: 10, // segundos
    cycles: 8,
    startSound: 'gongo.mp3',
    restSound: 'apito.mp3',
    endSound: 'gongo.mp3',
    countdownSound: 'regressivo.mp3'
  },
  CIRCUIT: {
    stations: [
      { name: 'Corda', time: 60 },
      { name: 'Abdominal', time: 30 },
      { name: 'Drill de Passagem', time: 60 }
    ],
    changeSound: 'apito.mp3',
    endSound: 'gongo.mp3',
    countdownSound: 'regressivo.mp3'
  },
  ROLA: {
    rollTime: 300, // 5 minutos em segundos
    restTime: 60, // 1 minuto em segundos
    rounds: 6,
    startSound: 'gongo.mp3',
    restSound: 'apito.mp3',
    endSound: 'gongo.mp3',
    countdownSound: 'regressivo.mp3'
  },
  COMPETITION: {
    time: 300, // 5 minutos em segundos
    category: 'Adulto Faixa Azul',
    startSound: 'gongo.mp3',
    endSound: 'gongo.mp3',
    countdownSound: 'regressivo.mp3'
  }
};

// Categorias de competição IBJJF
export const COMPETITION_CATEGORIES = [
  { value: 'Adulto Faixa Branca', label: 'Adulto Faixa Branca', time: 300 },
  { value: 'Adulto Faixa Azul', label: 'Adulto Faixa Azul', time: 300 },
  { value: 'Adulto Faixa Roxa', label: 'Adulto Faixa Roxa', time: 420 },
  { value: 'Adulto Faixa Marrom', label: 'Adulto Faixa Marrom', time: 420 },
  { value: 'Adulto Faixa Preta', label: 'Adulto Faixa Preta', time: 600 },
  { value: 'Master Faixa Branca', label: 'Master Faixa Branca', time: 300 },
  { value: 'Master Faixa Azul', label: 'Master Faixa Azul', time: 300 },
  { value: 'Master Faixa Roxa', label: 'Master Faixa Roxa', time: 300 },
  { value: 'Master Faixa Marrom', label: 'Master Faixa Marrom', time: 300 },
  { value: 'Master Faixa Preta', label: 'Master Faixa Preta', time: 300 }
];

/**
 * Hook para gerenciar configurações do timer Tabata
 */
export function useTabataTimer() {
  const [config, setConfig] = useState(DEFAULT_CONFIGS.TABATA);
  const [presets, setPresets] = useState([]);

  // Carregar configurações do cookie ao montar o componente
  useEffect(() => {
    if (hasCookie(COOKIE_NAMES.TABATA)) {
      try {
        const savedConfig = JSON.parse(getCookie(COOKIE_NAMES.TABATA));
        setConfig(savedConfig);
      } catch (error) {
        console.error('Erro ao carregar configurações do Tabata:', error);
      }
    }

    if (hasCookie(COOKIE_NAMES.PRESETS.TABATA)) {
      try {
        const savedPresets = JSON.parse(getCookie(COOKIE_NAMES.PRESETS.TABATA));
        setPresets(savedPresets);
      } catch (error) {
        console.error('Erro ao carregar presets do Tabata:', error);
      }
    }
  }, []);

  // Salvar configurações no cookie quando elas mudarem
  useEffect(() => {
    setCookie(COOKIE_NAMES.TABATA, JSON.stringify(config), { days: 365 });
  }, [config]);

  // Salvar presets no cookie quando eles mudarem
  useEffect(() => {
    setCookie(COOKIE_NAMES.PRESETS.TABATA, JSON.stringify(presets), { days: 365 });
  }, [presets]);

  // Função para adicionar um preset
  const addPreset = (name, configToSave) => {
    const newPreset = {
      id: Date.now(),
      name,
      config: configToSave || config
    };
    setPresets([...presets, newPreset]);
  };

  // Função para remover um preset
  const removePreset = (id) => {
    setPresets(presets.filter(preset => preset.id !== id));
  };

  // Função para carregar um preset
  const loadPreset = (id) => {
    const preset = presets.find(p => p.id === id);
    if (preset) {
      setConfig(preset.config);
    }
  };

  return {
    config,
    setConfig,
    presets,
    addPreset,
    removePreset,
    loadPreset
  };
}

/**
 * Hook para gerenciar configurações do timer de Circuito
 */
export function useCircuitTimer() {
  const [config, setConfig] = useState(DEFAULT_CONFIGS.CIRCUIT);
  const [presets, setPresets] = useState([]);

  // Carregar configurações do cookie ao montar o componente
  useEffect(() => {
    if (hasCookie(COOKIE_NAMES.CIRCUIT)) {
      try {
        const savedConfig = JSON.parse(getCookie(COOKIE_NAMES.CIRCUIT));
        setConfig(savedConfig);
      } catch (error) {
        console.error('Erro ao carregar configurações do Circuito:', error);
      }
    }

    if (hasCookie(COOKIE_NAMES.PRESETS.CIRCUIT)) {
      try {
        const savedPresets = JSON.parse(getCookie(COOKIE_NAMES.PRESETS.CIRCUIT));
        setPresets(savedPresets);
      } catch (error) {
        console.error('Erro ao carregar presets do Circuito:', error);
      }
    }
  }, []);

  // Salvar configurações no cookie quando elas mudarem
  useEffect(() => {
    setCookie(COOKIE_NAMES.CIRCUIT, JSON.stringify(config), { days: 365 });
  }, [config]);

  // Salvar presets no cookie quando eles mudarem
  useEffect(() => {
    setCookie(COOKIE_NAMES.PRESETS.CIRCUIT, JSON.stringify(presets), { days: 365 });
  }, [presets]);

  // Função para adicionar uma estação
  const addStation = (station = { name: 'Nova Estação', time: 60 }) => {
    setConfig({
      ...config,
      stations: [...config.stations, station]
    });
  };

  // Função para remover uma estação
  const removeStation = (index) => {
    const newStations = [...config.stations];
    newStations.splice(index, 1);
    setConfig({
      ...config,
      stations: newStations
    });
  };

  // Função para atualizar uma estação
  const updateStation = (index, updatedStation) => {
    const newStations = [...config.stations];
    newStations[index] = updatedStation;
    setConfig({
      ...config,
      stations: newStations
    });
  };

  // Função para adicionar um preset
  const addPreset = (name, configToSave) => {
    const newPreset = {
      id: Date.now(),
      name,
      config: configToSave || config
    };
    setPresets([...presets, newPreset]);
  };

  // Função para remover um preset
  const removePreset = (id) => {
    setPresets(presets.filter(preset => preset.id !== id));
  };

  // Função para carregar um preset
  const loadPreset = (id) => {
    const preset = presets.find(p => p.id === id);
    if (preset) {
      setConfig(preset.config);
    }
  };

  return {
    config,
    setConfig,
    presets,
    addStation,
    removeStation,
    updateStation,
    addPreset,
    removePreset,
    loadPreset
  };
}

/**
 * Hook para gerenciar configurações do timer de Rola em Equipe
 */
export function useRolaTimer() {
  const [config, setConfig] = useState(DEFAULT_CONFIGS.ROLA);
  const [presets, setPresets] = useState([]);

  // Carregar configurações do cookie ao montar o componente
  useEffect(() => {
    if (hasCookie(COOKIE_NAMES.ROLA)) {
      try {
        const savedConfig = JSON.parse(getCookie(COOKIE_NAMES.ROLA));
        setConfig(savedConfig);
      } catch (error) {
        console.error('Erro ao carregar configurações do Rola em Equipe:', error);
      }
    }

    if (hasCookie(COOKIE_NAMES.PRESETS.ROLA)) {
      try {
        const savedPresets = JSON.parse(getCookie(COOKIE_NAMES.PRESETS.ROLA));
        setPresets(savedPresets);
      } catch (error) {
        console.error('Erro ao carregar presets do Rola em Equipe:', error);
      }
    }
  }, []);

  // Salvar configurações no cookie quando elas mudarem
  useEffect(() => {
    setCookie(COOKIE_NAMES.ROLA, JSON.stringify(config), { days: 365 });
  }, [config]);

  // Salvar presets no cookie quando eles mudarem
  useEffect(() => {
    setCookie(COOKIE_NAMES.PRESETS.ROLA, JSON.stringify(presets), { days: 365 });
  }, [presets]);

  // Função para adicionar um preset
  const addPreset = (name, configToSave) => {
    const newPreset = {
      id: Date.now(),
      name,
      config: configToSave || config
    };
    setPresets([...presets, newPreset]);
  };

  // Função para remover um preset
  const removePreset = (id) => {
    setPresets(presets.filter(preset => preset.id !== id));
  };

  // Função para carregar um preset
  const loadPreset = (id) => {
    const preset = presets.find(p => p.id === id);
    if (preset) {
      setConfig(preset.config);
    }
  };

  return {
    config,
    setConfig,
    presets,
    addPreset,
    removePreset,
    loadPreset
  };
}

/**
 * Hook para gerenciar configurações do timer de Competição
 */
export function useCompetitionTimer() {
  const [config, setConfig] = useState(DEFAULT_CONFIGS.COMPETITION);
  const [presets, setPresets] = useState([]);

  // Carregar configurações do cookie ao montar o componente
  useEffect(() => {
    if (hasCookie(COOKIE_NAMES.COMPETITION)) {
      try {
        const savedConfig = JSON.parse(getCookie(COOKIE_NAMES.COMPETITION));
        setConfig(savedConfig);
      } catch (error) {
        console.error('Erro ao carregar configurações do timer de Competição:', error);
      }
    }

    if (hasCookie(COOKIE_NAMES.PRESETS.COMPETITION)) {
      try {
        const savedPresets = JSON.parse(getCookie(COOKIE_NAMES.PRESETS.COMPETITION));
        setPresets(savedPresets);
      } catch (error) {
        console.error('Erro ao carregar presets do timer de Competição:', error);
      }
    }
  }, []);

  // Salvar configurações no cookie quando elas mudarem
  useEffect(() => {
    setCookie(COOKIE_NAMES.COMPETITION, JSON.stringify(config), { days: 365 });
  }, [config]);

  // Salvar presets no cookie quando eles mudarem
  useEffect(() => {
    setCookie(COOKIE_NAMES.PRESETS.COMPETITION, JSON.stringify(presets), { days: 365 });
  }, [presets]);

  // Função para selecionar uma categoria
  const selectCategory = (categoryValue) => {
    const category = COMPETITION_CATEGORIES.find(cat => cat.value === categoryValue);
    if (category) {
      setConfig({
        ...config,
        category: category.value,
        time: category.time
      });
    }
  };

  // Função para adicionar um preset
  const addPreset = (name, configToSave) => {
    const newPreset = {
      id: Date.now(),
      name,
      config: configToSave || config
    };
    setPresets([...presets, newPreset]);
  };

  // Função para remover um preset
  const removePreset = (id) => {
    setPresets(presets.filter(preset => preset.id !== id));
  };

  // Função para carregar um preset
  const loadPreset = (id) => {
    const preset = presets.find(p => p.id === id);
    if (preset) {
      setConfig(preset.config);
    }
  };

  return {
    config,
    setConfig,
    presets,
    selectCategory,
    addPreset,
    removePreset,
    loadPreset,
    categories: COMPETITION_CATEGORIES
  };
}