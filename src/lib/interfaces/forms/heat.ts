import type { SignatureOwner } from '$lib/firebase/signatures';
import type { Timestamp } from 'firebase/firestore';
import type { EValuationTypesDisplayName } from './common';

export enum EValuationOptions {
	INDIVIDUAL = 'Individual',
	AMBIENTAL = 'Ambiental'
}

export enum EMethodologyOptions {
	NR15 = 'NR-15',
	NHO06 = 'NHO-06'
}

export enum EClimaticConditions {
	SUN = 'Sol',
	RAIN = 'Chuva',
	CLOUDY = 'Nublado'
}

export enum EEnviromentOptions {
	OPEN = 'Aberto',
	CLOSED = 'Fechado'
}

export enum EVentilationOptions {
	NATURAL = 'Natural',
	FORCED = 'Forçada'
}

export enum EEnviromentSolarIncidenceOptions {
	INTERNAL_OR_EXTERNAL = 'Interno ou externo sem carga solar',
	EXTERNAL = 'Externo com carga solar'
}

export enum ERestOptions {
	INLOCO = 'No mesmo local',
	OUTSIDE = 'Outro ambiente'
}

export enum EActivitiesOptions {
	LIGHT = 'Leve',
	MODERATE = 'Moderada',
	HEAVY = 'Pesada'
}

export interface IHeatForm {
	signatures: { [key in SignatureOwner]: string };
	type: keyof typeof EValuationTypesDisplayName;
	company: string;
	date: Timestamp;
	sampleNumber: string;
	valuation: EValuationOptions;
	methodology: EMethodologyOptions;
	name: string;
	function: string;
	sector: string;
	ghe: string;
	epi: string;
	epc: string;
	brand: string;
	model: string;
	serialNumber: string;
	climaticConditions: EClimaticConditions;
	environment: EEnviromentOptions;
	ventilation: EVentilationOptions;
	enviromentSolarIncidence: EEnviromentSolarIncidenceOptions | '';
	heatSource: string;
	rest: ERestOptions;
	activities: EActivitiesOptions;
	temperature?: string;
	humidity?: string;
	wind?: string;
	startingTime: string;
	endingTime: string;
	totalTime: string;
}

export type THeatValuationPDFSections = {
	[key: string]: Array<keyof IHeatForm>;
};

export const heatSections: THeatValuationPDFSections = {
	header: ['company', 'date', 'sampleNumber', 'valuation', 'methodology'],
	'Dados do Colaborador': ['name', 'function', 'sector', 'ghe', 'epi', 'epc'],
	'Características dos Equipamentos de Trabalho': ['brand', 'model', 'serialNumber'],
	'Dados da Amostragem': [
		'climaticConditions',
		'environment',
		'ventilation',
		'enviromentSolarIncidence',
		'heatSource',
		'rest',
		'activities',
		'temperature',
		'humidity',
		'wind',
		'startingTime',
		'endingTime',
		'totalTime'
	]
};

type THeatLabels = {
	[key in keyof IHeatForm]: string;
};

export const heatLabels: Omit<THeatLabels, 'signatures' | 'type'> = {
	company: 'Empresa',
	date: 'Data',
	sampleNumber: 'Número da Amostragem',
	valuation: 'Avaliação',
	methodology: 'Metodologia',
	name: 'Nome',
	function: 'Função',
	sector: 'Setor',
	ghe: 'GHE',
	epi: 'EPI',
	epc: 'EPC',
	brand: 'Marca',
	model: 'Modelo',
	serialNumber: 'Número de Série',
	climaticConditions: 'Condições Climáticas',
	environment: 'Ambiente',
	ventilation: 'Ventilação',
	enviromentSolarIncidence: 'Ambiente',
	heatSource: 'Fonte de Calor',
	rest: 'Descanso',
	activities: 'Atividade',
	temperature: 'Temperatura',
	humidity: 'Umidade',
	wind: 'Vento',
	startingTime: 'Hora Inicial',
	endingTime: 'Hora Final',
	totalTime: 'Tempo total'
};
