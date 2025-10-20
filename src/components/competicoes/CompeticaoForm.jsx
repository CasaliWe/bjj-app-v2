import React, { useState, useEffect } from 'react';
import { X, Plus, Trash, Upload, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { OPCOES_COLOCACAO } from '../../services/competicoes/competicoesService';

// Categorias IBJJF organizadas
const CATEGORIAS_IBJJF = [
  // MASCULINO
  { label: "---------------- MASCULINO ----------------", value: "__MASCULINO_SEPARATOR__", disabled: true },
  
  // KIDS MASCULINO
  { label: "---------- KIDS ----------", value: "__KIDS_MASCULINO_SEPARATOR__", disabled: true },
  
  // Kids 1 (4-5 anos)
  { label: "Masculino Kids 1 Branca até 20kg", value: "M Kids 1 Branca até 20kg" },
  { label: "Masculino Kids 1 Branca até 25kg", value: "M Kids 1 Branca até 25kg" },
  { label: "Masculino Kids 1 Branca acima de 25kg", value: "M Kids 1 Branca 25kg+" },
  
  // Kids 2 (6-7 anos)
  { label: "Masculino Kids 2 Branca até 25kg", value: "M Kids 2 Branca até 25kg" },
  { label: "Masculino Kids 2 Branca até 30kg", value: "M Kids 2 Branca até 30kg" },
  { label: "Masculino Kids 2 Branca acima de 30kg", value: "M Kids 2 Branca 30kg+" },
  
  // Kids 3 (8-9 anos)
  { label: "Masculino Kids 3 Branca até 30kg", value: "M Kids 3 Branca até 30kg" },
  { label: "Masculino Kids 3 Branca até 35kg", value: "M Kids 3 Branca até 35kg" },
  { label: "Masculino Kids 3 Branca até 40kg", value: "M Kids 3 Branca até 40kg" },
  { label: "Masculino Kids 3 Branca acima de 40kg", value: "M Kids 3 Branca 40kg+" },
  { label: "Masculino Kids 3 Cinza até 30kg", value: "M Kids 3 Cinza até 30kg" },
  { label: "Masculino Kids 3 Cinza até 35kg", value: "M Kids 3 Cinza até 35kg" },
  { label: "Masculino Kids 3 Cinza até 40kg", value: "M Kids 3 Cinza até 40kg" },
  { label: "Masculino Kids 3 Cinza acima de 40kg", value: "M Kids 3 Cinza 40kg+" },
  
  // Kids 4 (10-11 anos)
  { label: "Masculino Kids 4 Branca até 35kg", value: "M Kids 4 Branca até 35kg" },
  { label: "Masculino Kids 4 Branca até 40kg", value: "M Kids 4 Branca até 40kg" },
  { label: "Masculino Kids 4 Branca até 45kg", value: "M Kids 4 Branca até 45kg" },
  { label: "Masculino Kids 4 Branca até 50kg", value: "M Kids 4 Branca até 50kg" },
  { label: "Masculino Kids 4 Branca acima de 50kg", value: "M Kids 4 Branca 50kg+" },
  { label: "Masculino Kids 4 Cinza até 35kg", value: "M Kids 4 Cinza até 35kg" },
  { label: "Masculino Kids 4 Cinza até 40kg", value: "M Kids 4 Cinza até 40kg" },
  { label: "Masculino Kids 4 Cinza até 45kg", value: "M Kids 4 Cinza até 45kg" },
  { label: "Masculino Kids 4 Cinza acima de 45kg", value: "M Kids 4 Cinza 45kg+" },
  
  // Kids 5 (12-13 anos)
  { label: "Masculino Kids 5 Branca até 40kg", value: "M Kids 5 Branca até 40kg" },
  { label: "Masculino Kids 5 Branca até 45kg", value: "M Kids 5 Branca até 45kg" },
  { label: "Masculino Kids 5 Branca até 50kg", value: "M Kids 5 Branca até 50kg" },
  { label: "Masculino Kids 5 Branca até 55kg", value: "M Kids 5 Branca até 55kg" },
  { label: "Masculino Kids 5 Branca acima de 55kg", value: "M Kids 5 Branca 55kg+" },
  { label: "Masculino Kids 5 Amarela até 40kg", value: "M Kids 5 Amarela até 40kg" },
  { label: "Masculino Kids 5 Amarela até 45kg", value: "M Kids 5 Amarela até 45kg" },
  { label: "Masculino Kids 5 Amarela até 50kg", value: "M Kids 5 Amarela até 50kg" },
  { label: "Masculino Kids 5 Amarela até 55kg", value: "M Kids 5 Amarela até 55kg" },
  { label: "Masculino Kids 5 Amarela acima de 55kg", value: "M Kids 5 Amarela 55kg+" },
  
  // JUVENIL MASCULINO
  { label: "---------- JUVENIL ----------", value: "__JUVENIL_MASCULINO_SEPARATOR__", disabled: true },
  
  // Juvenil 1 (14 anos)
  { label: "Masculino Juvenil 1 Branca até 46kg", value: "M Juvenil 1 Branca até 46kg" },
  { label: "Masculino Juvenil 1 Branca até 52kg", value: "M Juvenil 1 Branca até 52kg" },
  { label: "Masculino Juvenil 1 Branca até 57kg", value: "M Juvenil 1 Branca até 57kg" },
  { label: "Masculino Juvenil 1 Branca até 63kg", value: "M Juvenil 1 Branca até 63kg" },
  { label: "Masculino Juvenil 1 Branca até 69kg", value: "M Juvenil 1 Branca até 69kg" },
  { label: "Masculino Juvenil 1 Branca acima de 69kg", value: "M Juvenil 1 Branca 69kg+" },
  { label: "Masculino Juvenil 1 Azul até 46kg", value: "M Juvenil 1 Azul até 46kg" },
  { label: "Masculino Juvenil 1 Azul até 52kg", value: "M Juvenil 1 Azul até 52kg" },
  { label: "Masculino Juvenil 1 Azul até 57kg", value: "M Juvenil 1 Azul até 57kg" },
  { label: "Masculino Juvenil 1 Azul até 63kg", value: "M Juvenil 1 Azul até 63kg" },
  { label: "Masculino Juvenil 1 Azul até 69kg", value: "M Juvenil 1 Azul até 69kg" },
  { label: "Masculino Juvenil 1 Azul acima de 69kg", value: "M Juvenil 1 Azul 69kg+" },
  
  // Juvenil 2 (15 anos)
  { label: "Masculino Juvenil 2 Branca até 49kg", value: "M Juvenil 2 Branca até 49kg" },
  { label: "Masculino Juvenil 2 Branca até 55kg", value: "M Juvenil 2 Branca até 55kg" },
  { label: "Masculino Juvenil 2 Branca até 61kg", value: "M Juvenil 2 Branca até 61kg" },
  { label: "Masculino Juvenil 2 Branca até 67kg", value: "M Juvenil 2 Branca até 67kg" },
  { label: "Masculino Juvenil 2 Branca até 73kg", value: "M Juvenil 2 Branca até 73kg" },
  { label: "Masculino Juvenil 2 Branca acima de 73kg", value: "M Juvenil 2 Branca 73kg+" },
  { label: "Masculino Juvenil 2 Azul até 49kg", value: "M Juvenil 2 Azul até 49kg" },
  { label: "Masculino Juvenil 2 Azul até 55kg", value: "M Juvenil 2 Azul até 55kg" },
  { label: "Masculino Juvenil 2 Azul até 61kg", value: "M Juvenil 2 Azul até 61kg" },
  { label: "Masculino Juvenil 2 Azul até 67kg", value: "M Juvenil 2 Azul até 67kg" },
  { label: "Masculino Juvenil 2 Azul até 73kg", value: "M Juvenil 2 Azul até 73kg" },
  { label: "Masculino Juvenil 2 Azul acima de 73kg", value: "M Juvenil 2 Azul 73kg+" },
  
  // Juvenil 3 (16 anos)
  { label: "Masculino Juvenil 3 Branca até 52kg", value: "M Juvenil 3 Branca até 52kg" },
  { label: "Masculino Juvenil 3 Branca até 58kg", value: "M Juvenil 3 Branca até 58kg" },
  { label: "Masculino Juvenil 3 Branca até 64kg", value: "M Juvenil 3 Branca até 64kg" },
  { label: "Masculino Juvenil 3 Branca até 70kg", value: "M Juvenil 3 Branca até 70kg" },
  { label: "Masculino Juvenil 3 Branca até 76kg", value: "M Juvenil 3 Branca até 76kg" },
  { label: "Masculino Juvenil 3 Branca acima de 76kg", value: "M Juvenil 3 Branca 76kg+" },
  { label: "Masculino Juvenil 3 Azul até 52kg", value: "M Juvenil 3 Azul até 52kg" },
  { label: "Masculino Juvenil 3 Azul até 58kg", value: "M Juvenil 3 Azul até 58kg" },
  { label: "Masculino Juvenil 3 Azul até 64kg", value: "M Juvenil 3 Azul até 64kg" },
  { label: "Masculino Juvenil 3 Azul até 70kg", value: "M Juvenil 3 Azul até 70kg" },
  { label: "Masculino Juvenil 3 Azul até 76kg", value: "M Juvenil 3 Azul até 76kg" },
  { label: "Masculino Juvenil 3 Azul acima de 76kg", value: "M Juvenil 3 Azul 76kg+" },
  
  // Juvenil 4 (17 anos)
  { label: "Masculino Juvenil 4 Branca até 55kg", value: "M Juvenil 4 Branca até 55kg" },
  { label: "Masculino Juvenil 4 Branca até 61kg", value: "M Juvenil 4 Branca até 61kg" },
  { label: "Masculino Juvenil 4 Branca até 67kg", value: "M Juvenil 4 Branca até 67kg" },
  { label: "Masculino Juvenil 4 Branca até 73kg", value: "M Juvenil 4 Branca até 73kg" },
  { label: "Masculino Juvenil 4 Branca até 79kg", value: "M Juvenil 4 Branca até 79kg" },
  { label: "Masculino Juvenil 4 Branca acima de 79kg", value: "M Juvenil 4 Branca 79kg+" },
  { label: "Masculino Juvenil 4 Azul até 55kg", value: "M Juvenil 4 Azul até 55kg" },
  { label: "Masculino Juvenil 4 Azul até 61kg", value: "M Juvenil 4 Azul até 61kg" },
  { label: "Masculino Juvenil 4 Azul até 67kg", value: "M Juvenil 4 Azul até 67kg" },
  { label: "Masculino Juvenil 4 Azul até 73kg", value: "M Juvenil 4 Azul até 73kg" },
  { label: "Masculino Juvenil 4 Azul até 79kg", value: "M Juvenil 4 Azul até 79kg" },
  { label: "Masculino Juvenil 4 Azul acima de 79kg", value: "M Juvenil 4 Azul 79kg+" },
  
  // ADULTO MASCULINO
  { label: "---------- ADULTO ----------", value: "__ADULTO_MASCULINO_SEPARATOR__", disabled: true },
  
  // Adulto (18-29 anos) - Todas as faixas
  { label: "Masculino Adulto Branca Rooster (até 57,5kg)", value: "M Adulto Branca Galo" },
  { label: "Masculino Adulto Branca Light Feather (até 64kg)", value: "M Adulto Branca Pluma Leve" },
  { label: "Masculino Adulto Branca Feather (até 70kg)", value: "M Adulto Branca Pluma" },
  { label: "Masculino Adulto Branca Light (até 76kg)", value: "M Adulto Branca Leve" },
  { label: "Masculino Adulto Branca Middle (até 82,3kg)", value: "M Adulto Branca Médio" },
  { label: "Masculino Adulto Branca Medium Heavy (até 88,3kg)", value: "M Adulto Branca Meio Pesado" },
  { label: "Masculino Adulto Branca Heavy (até 94,3kg)", value: "M Adulto Branca Pesado" },
  { label: "Masculino Adulto Branca Super Heavy (até 100,5kg)", value: "M Adulto Branca Super Pesado" },
  { label: "Masculino Adulto Branca Ultra Heavy (acima de 100,5kg)", value: "M Adulto Branca Pesadíssimo" },
  
  { label: "Masculino Adulto Azul Rooster (até 57,5kg)", value: "M Adulto Azul Galo" },
  { label: "Masculino Adulto Azul Light Feather (até 64kg)", value: "M Adulto Azul Pluma Leve" },
  { label: "Masculino Adulto Azul Feather (até 70kg)", value: "M Adulto Azul Pluma" },
  { label: "Masculino Adulto Azul Light (até 76kg)", value: "M Adulto Azul Leve" },
  { label: "Masculino Adulto Azul Middle (até 82,3kg)", value: "M Adulto Azul Médio" },
  { label: "Masculino Adulto Azul Medium Heavy (até 88,3kg)", value: "M Adulto Azul Meio Pesado" },
  { label: "Masculino Adulto Azul Heavy (até 94,3kg)", value: "M Adulto Azul Pesado" },
  { label: "Masculino Adulto Azul Super Heavy (até 100,5kg)", value: "M Adulto Azul Super Pesado" },
  { label: "Masculino Adulto Azul Ultra Heavy (acima de 100,5kg)", value: "M Adulto Azul Pesadíssimo" },
  
  { label: "Masculino Adulto Roxa Rooster (até 57,5kg)", value: "M Adulto Roxa Galo" },
  { label: "Masculino Adulto Roxa Light Feather (até 64kg)", value: "M Adulto Roxa Pluma Leve" },
  { label: "Masculino Adulto Roxa Feather (até 70kg)", value: "M Adulto Roxa Pluma" },
  { label: "Masculino Adulto Roxa Light (até 76kg)", value: "M Adulto Roxa Leve" },
  { label: "Masculino Adulto Roxa Middle (até 82,3kg)", value: "M Adulto Roxa Médio" },
  { label: "Masculino Adulto Roxa Medium Heavy (até 88,3kg)", value: "M Adulto Roxa Meio Pesado" },
  { label: "Masculino Adulto Roxa Heavy (até 94,3kg)", value: "M Adulto Roxa Pesado" },
  { label: "Masculino Adulto Roxa Super Heavy (até 100,5kg)", value: "M Adulto Roxa Super Pesado" },
  { label: "Masculino Adulto Roxa Ultra Heavy (acima de 100,5kg)", value: "M Adulto Roxa Pesadíssimo" },
  
  { label: "Masculino Adulto Marrom Rooster (até 57,5kg)", value: "M Adulto Marrom Galo" },
  { label: "Masculino Adulto Marrom Light Feather (até 64kg)", value: "M Adulto Marrom Pluma Leve" },
  { label: "Masculino Adulto Marrom Feather (até 70kg)", value: "M Adulto Marrom Pluma" },
  { label: "Masculino Adulto Marrom Light (até 76kg)", value: "M Adulto Marrom Leve" },
  { label: "Masculino Adulto Marrom Middle (até 82,3kg)", value: "M Adulto Marrom Médio" },
  { label: "Masculino Adulto Marrom Medium Heavy (até 88,3kg)", value: "M Adulto Marrom Meio Pesado" },
  { label: "Masculino Adulto Marrom Heavy (até 94,3kg)", value: "M Adulto Marrom Pesado" },
  { label: "Masculino Adulto Marrom Super Heavy (até 100,5kg)", value: "M Adulto Marrom Super Pesado" },
  { label: "Masculino Adulto Marrom Ultra Heavy (acima de 100,5kg)", value: "M Adulto Marrom Pesadíssimo" },
  
  { label: "Masculino Adulto Preta Rooster (até 57,5kg)", value: "M Adulto Preta Galo" },
  { label: "Masculino Adulto Preta Light Feather (até 64kg)", value: "M Adulto Preta Pluma Leve" },
  { label: "Masculino Adulto Preta Feather (até 70kg)", value: "M Adulto Preta Pluma" },
  { label: "Masculino Adulto Preta Light (até 76kg)", value: "M Adulto Preta Leve" },
  { label: "Masculino Adulto Preta Middle (até 82,3kg)", value: "M Adulto Preta Médio" },
  { label: "Masculino Adulto Preta Medium Heavy (até 88,3kg)", value: "M Adulto Preta Meio Pesado" },
  { label: "Masculino Adulto Preta Heavy (até 94,3kg)", value: "M Adulto Preta Pesado" },
  { label: "Masculino Adulto Preta Super Heavy (até 100,5kg)", value: "M Adulto Preta Super Pesado" },
  { label: "Masculino Adulto Preta Ultra Heavy (acima de 100,5kg)", value: "M Adulto Preta Pesadíssimo" },
  
  // MASTER MASCULINO
  { label: "---------- MASTER ----------", value: "__MASTER_MASCULINO_SEPARATOR__", disabled: true },
  
  // Master 1-5 - Mesmas categorias de peso do adulto para cada faixa
  ...Array.from({ length: 5 }, (_, i) => {
    const masterNum = i + 1;
    const faixas = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];
    const pesos = [
      { nome: 'Galo', original: 'Rooster (até 57,5kg)' },
      { nome: 'Pluma Leve', original: 'Light Feather (até 64kg)' },
      { nome: 'Pluma', original: 'Feather (até 70kg)' },
      { nome: 'Leve', original: 'Light (até 76kg)' },
      { nome: 'Médio', original: 'Middle (até 82,3kg)' },
      { nome: 'Meio Pesado', original: 'Medium Heavy (até 88,3kg)' },
      { nome: 'Pesado', original: 'Heavy (até 94,3kg)' },
      { nome: 'Super Pesado', original: 'Super Heavy (até 100,5kg)' },
      { nome: 'Pesadíssimo', original: 'Ultra Heavy (acima de 100,5kg)' }
    ];
    
    return faixas.flatMap(faixa => 
      pesos.map(peso => ({
        label: `Masculino Master ${masterNum} ${faixa} ${peso.original}`,
        value: `M Master ${masterNum} ${faixa} ${peso.nome}`
      }))
    );
  }).flat(),
  
  // ABSOLUTO ADULTO MASCULINO
  { label: "---------- ABSOLUTO ADULTO ----------", value: "__ABSOLUTO_MASCULINO_SEPARATOR__", disabled: true },
  
  { label: "Masculino Absoluto Adulto Branca", value: "M Absoluto Adulto Branca" },
  { label: "Masculino Absoluto Adulto Azul", value: "M Absoluto Adulto Azul" },
  { label: "Masculino Absoluto Adulto Roxa", value: "M Absoluto Adulto Roxa" },
  { label: "Masculino Absoluto Adulto Marrom", value: "M Absoluto Adulto Marrom" },
  { label: "Masculino Absoluto Adulto Preta", value: "M Absoluto Adulto Preta" },
  
  // FEMININO
  { label: "---------------- FEMININO ----------------", value: "__FEMININO_SEPARATOR__", disabled: true },
  
  // KIDS FEMININO
  { label: "---------- KIDS ----------", value: "__KIDS_FEMININO_SEPARATOR__", disabled: true },
  
  // Kids 1 (4-5 anos)
  { label: "Feminino Kids 1 Branca até 20kg", value: "F_Kids 1 Branca até 20kg" },
  { label: "Feminino Kids 1 Branca até 25kg", value: "F_Kids 1 Branca até 25kg" },
  { label: "Feminino Kids 1 Branca acima de 25kg", value: "F_Kids 1 Branca 25kg+" },
  
  // Kids 2 (6-7 anos)
  { label: "Feminino Kids 2 Branca até 25kg", value: "Kids 2 Branca até 25kg" },
  { label: "Feminino Kids 2 Branca até 30kg", value: "Kids 2 Branca até 30kg" },
  { label: "Feminino Kids 2 Branca acima de 30kg", value: "Kids 2 Branca 30kg+" },
  
  // Kids 3 (8-9 anos)
  { label: "Feminino Kids 3 Branca até 30kg", value: "Kids 3 Branca até 30kg" },
  { label: "Feminino Kids 3 Branca até 35kg", value: "Kids 3 Branca até 35kg" },
  { label: "Feminino Kids 3 Branca até 40kg", value: "Kids 3 Branca até 40kg" },
  { label: "Feminino Kids 3 Branca acima de 40kg", value: "Kids 3 Branca 40kg+" },
  { label: "Feminino Kids 3 Cinza até 30kg", value: "Kids 3 Cinza até 30kg" },
  { label: "Feminino Kids 3 Cinza até 35kg", value: "Kids 3 Cinza até 35kg" },
  { label: "Feminino Kids 3 Cinza até 40kg", value: "Kids 3 Cinza até 40kg" },
  { label: "Feminino Kids 3 Cinza acima de 40kg", value: "Kids 3 Cinza 40kg+" },
  
  // Kids 4 (10-11 anos)
  { label: "Feminino Kids 4 Branca até 35kg", value: "Kids 4 Branca até 35kg" },
  { label: "Feminino Kids 4 Branca até 40kg", value: "Kids 4 Branca até 40kg" },
  { label: "Feminino Kids 4 Branca até 45kg", value: "Kids 4 Branca até 45kg" },
  { label: "Feminino Kids 4 Branca até 50kg", value: "Kids 4 Branca até 50kg" },
  { label: "Feminino Kids 4 Branca acima de 50kg", value: "Kids 4 Branca 50kg+" },
  { label: "Feminino Kids 4 Cinza até 35kg", value: "Kids 4 Cinza até 35kg" },
  { label: "Feminino Kids 4 Cinza até 40kg", value: "Kids 4 Cinza até 40kg" },
  { label: "Feminino Kids 4 Cinza até 45kg", value: "Kids 4 Cinza até 45kg" },
  { label: "Feminino Kids 4 Cinza acima de 45kg", value: "Kids 4 Cinza 45kg+" },
  
  // Kids 5 (12-13 anos)
  { label: "Feminino Kids 5 Branca até 40kg", value: "Kids 5 Branca até 40kg" },
  { label: "Feminino Kids 5 Branca até 45kg", value: "Kids 5 Branca até 45kg" },
  { label: "Feminino Kids 5 Branca até 50kg", value: "Kids 5 Branca até 50kg" },
  { label: "Feminino Kids 5 Branca até 55kg", value: "Kids 5 Branca até 55kg" },
  { label: "Feminino Kids 5 Branca acima de 55kg", value: "Kids 5 Branca 55kg+" },
  { label: "Feminino Kids 5 Amarela até 40kg", value: "Kids 5 Amarela até 40kg" },
  { label: "Feminino Kids 5 Amarela até 45kg", value: "Kids 5 Amarela até 45kg" },
  { label: "Feminino Kids 5 Amarela até 50kg", value: "Kids 5 Amarela até 50kg" },
  { label: "Feminino Kids 5 Amarela até 55kg", value: "Kids 5 Amarela até 55kg" },
  { label: "Feminino Kids 5 Amarela acima de 55kg", value: "Kids 5 Amarela 55kg+" },
  
  // JUVENIL FEMININO
  { label: "---------- JUVENIL ----------", value: "__JUVENIL_FEMININO_SEPARATOR__", disabled: true },
  
  // Juvenil 1 (14 anos)
  { label: "Feminino Juvenil 1 Branca até 41kg", value: "Juvenil 1 Branca até 41kg" },
  { label: "Feminino Juvenil 1 Branca até 46kg", value: "Juvenil 1 Branca até 46kg" },
  { label: "Feminino Juvenil 1 Branca até 51kg", value: "Juvenil 1 Branca até 51kg" },
  { label: "Feminino Juvenil 1 Branca até 56kg", value: "Juvenil 1 Branca até 56kg" },
  { label: "Feminino Juvenil 1 Branca acima de 56kg", value: "Juvenil 1 Branca 56kg+" },
  { label: "Feminino Juvenil 1 Azul até 41kg", value: "Juvenil 1 Azul até 41kg" },
  { label: "Feminino Juvenil 1 Azul até 46kg", value: "Juvenil 1 Azul até 46kg" },
  { label: "Feminino Juvenil 1 Azul até 51kg", value: "Juvenil 1 Azul até 51kg" },
  { label: "Feminino Juvenil 1 Azul até 56kg", value: "Juvenil 1 Azul até 56kg" },
  { label: "Feminino Juvenil 1 Azul acima de 56kg", value: "Juvenil 1 Azul 56kg+" },
  
  // Juvenil 2 (15 anos)
  { label: "Feminino Juvenil 2 Branca até 44kg", value: "Juvenil 2 Branca até 44kg" },
  { label: "Feminino Juvenil 2 Branca até 49kg", value: "Juvenil 2 Branca até 49kg" },
  { label: "Feminino Juvenil 2 Branca até 54kg", value: "Juvenil 2 Branca até 54kg" },
  { label: "Feminino Juvenil 2 Branca até 59kg", value: "Juvenil 2 Branca até 59kg" },
  { label: "Feminino Juvenil 2 Branca acima de 59kg", value: "Juvenil 2 Branca 59kg+" },
  { label: "Feminino Juvenil 2 Azul até 44kg", value: "Juvenil 2 Azul até 44kg" },
  { label: "Feminino Juvenil 2 Azul até 49kg", value: "Juvenil 2 Azul até 49kg" },
  { label: "Feminino Juvenil 2 Azul até 54kg", value: "Juvenil 2 Azul até 54kg" },
  { label: "Feminino Juvenil 2 Azul até 59kg", value: "Juvenil 2 Azul até 59kg" },
  { label: "Feminino Juvenil 2 Azul acima de 59kg", value: "Juvenil 2 Azul 59kg+" },
  
  // Juvenil 3 (16 anos)
  { label: "Feminino Juvenil 3 Branca até 47kg", value: "Juvenil 3 Branca até 47kg" },
  { label: "Feminino Juvenil 3 Branca até 52kg", value: "Juvenil 3 Branca até 52kg" },
  { label: "Feminino Juvenil 3 Branca até 57kg", value: "Juvenil 3 Branca até 57kg" },
  { label: "Feminino Juvenil 3 Branca até 62kg", value: "Juvenil 3 Branca até 62kg" },
  { label: "Feminino Juvenil 3 Branca acima de 62kg", value: "Juvenil 3 Branca 62kg+" },
  { label: "Feminino Juvenil 3 Azul até 47kg", value: "Juvenil 3 Azul até 47kg" },
  { label: "Feminino Juvenil 3 Azul até 52kg", value: "Juvenil 3 Azul até 52kg" },
  { label: "Feminino Juvenil 3 Azul até 57kg", value: "Juvenil 3 Azul até 57kg" },
  { label: "Feminino Juvenil 3 Azul até 62kg", value: "Juvenil 3 Azul até 62kg" },
  { label: "Feminino Juvenil 3 Azul acima de 62kg", value: "Juvenil 3 Azul 62kg+" },
  
  // Juvenil 4 (17 anos)
  { label: "Feminino Juvenil 4 Branca até 50kg", value: "Juvenil 4 Branca até 50kg" },
  { label: "Feminino Juvenil 4 Branca até 55kg", value: "Juvenil 4 Branca até 55kg" },
  { label: "Feminino Juvenil 4 Branca até 60kg", value: "Juvenil 4 Branca até 60kg" },
  { label: "Feminino Juvenil 4 Branca até 65kg", value: "Juvenil 4 Branca até 65kg" },
  { label: "Feminino Juvenil 4 Branca acima de 65kg", value: "Juvenil 4 Branca 65kg+" },
  { label: "Feminino Juvenil 4 Azul até 50kg", value: "Juvenil 4 Azul até 50kg" },
  { label: "Feminino Juvenil 4 Azul até 55kg", value: "Juvenil 4 Azul até 55kg" },
  { label: "Feminino Juvenil 4 Azul até 60kg", value: "Juvenil 4 Azul até 60kg" },
  { label: "Feminino Juvenil 4 Azul até 65kg", value: "Juvenil 4 Azul até 65kg" },
  { label: "Feminino Juvenil 4 Azul acima de 65kg", value: "Juvenil 4 Azul 65kg+" },
  
  // ADULTO FEMININO
  { label: "---------- ADULTO ----------", value: "__ADULTO_FEMININO_SEPARATOR__", disabled: true },
  
  // Adulto (18-29 anos) - Todas as faixas
  { label: "Feminino Adulto Branca Light Feather (até 48,5kg)", value: "Adulto Branca Pluma Leve" },
  { label: "Feminino Adulto Branca Feather (até 53,5kg)", value: "Adulto Branca Pluma" },
  { label: "Feminino Adulto Branca Light (até 58,5kg)", value: "Adulto Branca Leve" },
  { label: "Feminino Adulto Branca Middle (até 64kg)", value: "Adulto Branca Médio" },
  { label: "Feminino Adulto Branca Medium Heavy (até 69kg)", value: "Adulto Branca Meio Pesado" },
  { label: "Feminino Adulto Branca Heavy (acima de 69kg)", value: "Adulto Branca Pesado" },
  
  { label: "Feminino Adulto Azul Light Feather (até 48,5kg)", value: "Adulto Azul Pluma Leve" },
  { label: "Feminino Adulto Azul Feather (até 53,5kg)", value: "Adulto Azul Pluma" },
  { label: "Feminino Adulto Azul Light (até 58,5kg)", value: "Adulto Azul Leve" },
  { label: "Feminino Adulto Azul Middle (até 64kg)", value: "Adulto Azul Médio" },
  { label: "Feminino Adulto Azul Medium Heavy (até 69kg)", value: "Adulto Azul Meio Pesado" },
  { label: "Feminino Adulto Azul Heavy (acima de 69kg)", value: "Adulto Azul Pesado" },
  
  { label: "Feminino Adulto Roxa Light Feather (até 48,5kg)", value: "Adulto Roxa Pluma Leve" },
  { label: "Feminino Adulto Roxa Feather (até 53,5kg)", value: "Adulto Roxa Pluma" },
  { label: "Feminino Adulto Roxa Light (até 58,5kg)", value: "Adulto Roxa Leve" },
  { label: "Feminino Adulto Roxa Middle (até 64kg)", value: "Adulto Roxa Médio" },
  { label: "Feminino Adulto Roxa Medium Heavy (até 69kg)", value: "Adulto Roxa Meio Pesado" },
  { label: "Feminino Adulto Roxa Heavy (acima de 69kg)", value: "Adulto Roxa Pesado" },
  
  { label: "Feminino Adulto Marrom Light Feather (até 48,5kg)", value: "Adulto Marrom Pluma Leve" },
  { label: "Feminino Adulto Marrom Feather (até 53,5kg)", value: "Adulto Marrom Pluma" },
  { label: "Feminino Adulto Marrom Light (até 58,5kg)", value: "Adulto Marrom Leve" },
  { label: "Feminino Adulto Marrom Middle (até 64kg)", value: "Adulto Marrom Médio" },
  { label: "Feminino Adulto Marrom Medium Heavy (até 69kg)", value: "Adulto Marrom Meio Pesado" },
  { label: "Feminino Adulto Marrom Heavy (acima de 69kg)", value: "Adulto Marrom Pesado" },
  
  { label: "Feminino Adulto Preta Light Feather (até 48,5kg)", value: "Adulto Preta Pluma Leve" },
  { label: "Feminino Adulto Preta Feather (até 53,5kg)", value: "Adulto Preta Pluma" },
  { label: "Feminino Adulto Preta Light (até 58,5kg)", value: "Adulto Preta Leve" },
  { label: "Feminino Adulto Preta Middle (até 64kg)", value: "Adulto Preta Médio" },
  { label: "Feminino Adulto Preta Medium Heavy (até 69kg)", value: "Adulto Preta Meio Pesado" },
  { label: "Feminino Adulto Preta Heavy (acima de 69kg)", value: "Adulto Preta Pesado" },
  
  // MASTER FEMININO
  { label: "---------- MASTER ----------", value: "__MASTER_FEMININO_SEPARATOR__", disabled: true },
  
  // Master 1-5 - Mesmas categorias de peso do adulto para cada faixa
  ...Array.from({ length: 5 }, (_, i) => {
    const masterNum = i + 1;
    const faixas = ['Branca', 'Azul', 'Roxa', 'Marrom', 'Preta'];
    const pesos = [
      { nome: 'Pluma Leve', original: 'Light Feather (até 48,5kg)' },
      { nome: 'Pluma', original: 'Feather (até 53,5kg)' },
      { nome: 'Leve', original: 'Light (até 58,5kg)' },
      { nome: 'Médio', original: 'Middle (até 64kg)' },
      { nome: 'Meio Pesado', original: 'Medium Heavy (até 69kg)' },
      { nome: 'Pesado', original: 'Heavy (acima de 69kg)' }
    ];
    
    return faixas.flatMap(faixa => 
      pesos.map(peso => ({
        label: `Feminino Master ${masterNum} ${faixa} ${peso.original}`,
        value: `Master ${masterNum} ${faixa} ${peso.nome}`
      }))
    );
  }).flat(),
  
  // ABSOLUTO ADULTO FEMININO
  { label: "---------- ABSOLUTO ADULTO ----------", value: "__ABSOLUTO_FEMININO_SEPARATOR__", disabled: true },
  
  { label: "Feminino Absoluto Adulto Branca", value: "Absoluto Adulto Branca" },
  { label: "Feminino Absoluto Adulto Azul", value: "Absoluto Adulto Azul" },
  { label: "Feminino Absoluto Adulto Roxa", value: "Absoluto Adulto Roxa" },
  { label: "Feminino Absoluto Adulto Marrom", value: "Absoluto Adulto Marrom" },
  { label: "Feminino Absoluto Adulto Preta", value: "Absoluto Adulto Preta" },
];

/**
 * Componente de formulário para adicionar/editar competições
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.isOpen - Se o modal está aberto
 * @param {Function} props.onClose - Função para fechar o modal
 * @param {Function} props.onSave - Função para salvar a competição
 * @param {Object} props.competicaoAtual - Competição a ser editada (ou null para nova)
 */
const CompeticaoForm = ({ isOpen, onClose, onSave, competicaoAtual = null }) => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    nomeEvento: '',
    cidade: '',
    data: '',
    modalidade: 'gi',
    colocacao: '1º lugar',
    categoria: '',
    numeroLutas: 0,
    numeroVitorias: 0,
    numeroDerrotas: 0,
    numeroFinalizacoes: 0,
    observacoes: '',
    imagens: [],
    isPublico: false
  });

  // Estado para arquivos temporários (ainda não carregados)
  const [arquivosTemp, setArquivosTemp] = useState([]);
  
  // Estado para IDs de imagens existentes (para atualização)
  const [imagensExistentes, setImagensExistentes] = useState([]);

  // Preencher o formulário quando estiver editando
  useEffect(() => {
    if (competicaoAtual) {
      // Formatação da data para o formato do input (YYYY-MM-DD)
      const formatarDataParaInput = (dataString) => {
        if (!dataString) return '';
        const data = new Date(dataString);
        return data.toISOString().split('T')[0];
      };

      setFormData({
        ...competicaoAtual,
        nomeEvento: competicaoAtual.nomeEvento || competicaoAtual.nome || '',
        data: formatarDataParaInput(competicaoAtual.data),
        categoria: competicaoAtual.categoria || '',
        colocacao: competicaoAtual.colocacao || competicaoAtual.resultado || '1º lugar'
      });
      
      // Guardar IDs das imagens existentes
      if (competicaoAtual.imagens && competicaoAtual.imagens.length > 0) {
        // Assumindo que cada imagem tem um ID e uma URL
        const imagensIds = competicaoAtual.imagens.map(imagem => 
          typeof imagem === 'object' ? imagem.id : null
        ).filter(id => id !== null);
        
        setImagensExistentes(imagensIds);
      } else {
        setImagensExistentes([]);
      }
    } else {
      // Reset do formulário para nova competição
      setFormData({
        nomeEvento: '',
        cidade: '',
        data: '',
        modalidade: 'gi',
        colocacao: '1º lugar',
        categoria: '',
        numeroLutas: 0,
        numeroVitorias: 0,
        numeroDerrotas: 0,
        numeroFinalizacoes: 0,
        observacoes: '',
        imagens: [],
        isPublico: false
      });
      
      setImagensExistentes([]);
    }
    
    // Limpar arquivos temporários
    setArquivosTemp([]);
  }, [competicaoAtual, isOpen]);

  // Manipulador de alterações no formulário
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Converter para número quando for um campo numérico
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Manipulador para alteração de select
  const handleSelectChange = (field, value) => {
    // Não permitir seleção de separadores
    if (value.includes('__SEPARATOR__')) {
      return;
    }
    
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Manipulador para alteração de switch
  const handleSwitchChange = (field, checked) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  // Adicionar imagem
  const handleAddImagem = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Criar URLs temporárias para as imagens selecionadas
    const novasImagens = Array.from(files).map(file => {
      const url = URL.createObjectURL(file);
      return { file, url };
    });

    setArquivosTemp([...arquivosTemp, ...novasImagens]);
  };

  // Remover imagem temporária
  const handleRemoverImagemTemp = (index) => {
    const novoArquivosTemp = [...arquivosTemp];
    
    // Liberar URL para evitar vazamento de memória
    URL.revokeObjectURL(novoArquivosTemp[index].url);
    
    novoArquivosTemp.splice(index, 1);
    setArquivosTemp(novoArquivosTemp);
  };

  // Remover imagem existente
  const handleRemoverImagem = (index) => {
    const novasImagens = [...formData.imagens];
    
    // Remover também o ID da lista de imagens existentes
    if (imagensExistentes.length > 0 && index < imagensExistentes.length) {
      const novasImagensExistentes = [...imagensExistentes];
      novasImagensExistentes.splice(index, 1);
      setImagensExistentes(novasImagensExistentes);
    }
    
    novasImagens.splice(index, 1);
    setFormData({
      ...formData,
      imagens: novasImagens
    });
  };

  // Salvar competição
  const handleSave = () => {
    // Preparar arquivos de imagem para envio
    const arquivosImagem = arquivosTemp.map(arquivo => arquivo.file);
    
    // Preparar dados para salvar
    const dadosParaSalvar = {
      ...formData,
      arquivosImagem,
      imagensExistentes
    };
    
    onSave(dadosParaSalvar);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {competicaoAtual ? 'Editar Competição' : 'Nova Competição'}
          </DialogTitle>
          <DialogDescription>
            {competicaoAtual
              ? 'Atualize os detalhes da sua competição'
              : 'Registre os detalhes da competição que você participou'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nomeEvento">Nome do Evento</Label>
              <Input
                id="nomeEvento"
                name="nomeEvento"
                value={formData.nomeEvento}
                onChange={handleChange}
                placeholder="Ex: Campeonato Brasileiro de Jiu-Jitsu"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade/Estado</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Detalhes da Participação */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modalidade">Modalidade</Label>
              <Select
                value={formData.modalidade}
                onValueChange={(value) => handleSelectChange('modalidade', value)}
              >
                <SelectTrigger id="modalidade">
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gi">Gi (Kimono)</SelectItem>
                  <SelectItem value="nogi">No-Gi (Sem Kimono)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colocacao">Colocação</Label>
              <Select
                value={formData.colocacao}
                onValueChange={(value) => handleSelectChange('colocacao', value)}
              >
                <SelectTrigger id="colocacao">
                  <SelectValue placeholder="Selecione a colocação" />
                </SelectTrigger>
                <SelectContent>
                  {OPCOES_COLOCACAO.map((opcao) => (
                    <SelectItem key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-sm">Categoria</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => handleSelectChange('categoria', value)}
            >
              <SelectTrigger id="categoria" className="w-full text-xs sm:text-sm">
                <SelectValue placeholder="Selecione a categoria" className="text-xs sm:text-sm" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] sm:max-h-[400px] overflow-y-auto w-[90vw] sm:w-auto">
                {CATEGORIAS_IBJJF.map((categoria, index) => (
                  <SelectItem 
                    key={index} 
                    value={categoria.value}
                    disabled={categoria.disabled}
                    className={categoria.disabled 
                      ? "font-semibold text-center bg-muted/50 cursor-default pointer-events-none text-xs sm:text-sm py-3" 
                      : "text-xs sm:text-sm leading-tight py-3 sm:py-2 min-h-[44px] sm:min-h-auto"
                    }
                  >
                    <span className="block truncate">{categoria.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroLutas">Número de Lutas</Label>
              <Input
                id="numeroLutas"
                name="numeroLutas"
                type="number"
                min="0"
                value={formData.numeroLutas}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroVitorias">Número de Vitórias</Label>
              <Input
                id="numeroVitorias"
                name="numeroVitorias"
                type="number"
                min="0"
                max={formData.numeroLutas}
                value={formData.numeroVitorias}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numeroDerrotas">Número de Derrotas</Label>
              <Input
                id="numeroDerrotas"
                name="numeroDerrotas"
                type="number"
                min="0"
                max={formData.numeroLutas}
                value={formData.numeroDerrotas}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroFinalizacoes">Finalizações</Label>
              <Input
                id="numeroFinalizacoes"
                name="numeroFinalizacoes"
                type="number"
                min="0"
                max={formData.numeroVitorias}
                value={formData.numeroFinalizacoes}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              placeholder="Descreva suas impressões, técnicas usadas, desafios enfrentados..."
              rows={4}
            />
          </div>

          {/* Upload de Imagens */}
          <div className="space-y-2">
            <Label>Imagens</Label>
            
            {/* Exibição de imagens existentes */}
            {formData.imagens && formData.imagens.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {formData.imagens.map((imagem, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={typeof imagem === 'object' ? imagem.url : imagem}
                      alt={`Competição ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoverImagem(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Exibição de imagens temporárias */}
            {arquivosTemp.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {arquivosTemp.map((arquivo, index) => (
                  <div key={`temp-${index}`} className="relative group">
                    <img
                      src={arquivo.url}
                      alt={`Nova imagem ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoverImagemTemp(index)}
                      className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Botão de upload */}
            <div className="flex items-center justify-center border-2 border-dashed border-border rounded-md p-4">
              <label htmlFor="upload-image" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm">Clique para adicionar imagens</span>
                <input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAddImagem}
                />
              </label>
            </div>
          </div>

          {/* Compartilhamento */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublico"
              checked={formData.isPublico}
              onCheckedChange={(checked) => handleSwitchChange('isPublico', checked)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="isPublico" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Compartilhar com a comunidade
              </Label>
              <p className="text-sm text-muted-foreground">
                Outros usuários poderão ver esta competição na aba Comunidade
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" /> Cancelar
          </Button>
          <Button className='mb-3' onClick={handleSave}>
            <Plus className="h-4 w-4 mr-2" /> 
            {competicaoAtual ? 'Atualizar Competição' : 'Adicionar Competição'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompeticaoForm;
