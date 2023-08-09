import type { SignatureOwner } from '$lib/firebase/signatures';
import type { Timestamp } from 'firebase/firestore';
import type { EValuationTypesDisplayName } from './common';

export enum EExpositionOptions {
	LOW = 'Baixa Exposição',
	MODERATE = 'Moderado',
	HIGH = 'Alta Exposição'
}

export enum EClimaticConditionsOptions {
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

export interface IChemicalAgentsForm {
	signatures: { [key in SignatureOwner]: string };
	type: keyof typeof EValuationTypesDisplayName;
	company: string;
	date: Timestamp;
	sampleNumber: string;
	name: string;
	function: string;
	sector: string;
	ghe: string;
	epi: string;
	epc: string;
	deviceBrand: string;
	deviceModel: string;
	deviceSerialNumber: string;
	calibrationBrand: string;
	calibrationModel: string;
	calibrationSerialNumber: string;
	startingCalibration: string;
	endingCalibration: string;
	flowRate: string;
	agent: string;
	sample: string;
	fieldWhite: string;
	exposition: EExpositionOptions;
	climaticConditions: EClimaticConditionsOptions;
	enviroment: EEnviromentOptions;
	ventilation: EVentilationOptions;
	startingTime: string;
	endingTime: string;
	totalTime: string;
	interval: string;
	activities: string;
}

export type TChemicalAgentsValuationPDFSections = {
	[key: string]: Array<keyof IChemicalAgentsForm>;
};

export const chemicalAgentsSections: TChemicalAgentsValuationPDFSections = {
	header: ['company', 'date', 'sampleNumber'],
	'Dados do Colaborador': ['name', 'function', 'sector', 'ghe', 'epi', 'epc'],
	'Dados do Aparelho e Calibração': [
		'deviceBrand',
		'deviceModel',
		'deviceSerialNumber',
		'calibrationBrand',
		'calibrationModel',
		'calibrationSerialNumber',
		'startingCalibration',
		'endingCalibration',
		'flowRate'
	],
	'Dados da Amostragem': [
		'agent',
		'sample',
		'fieldWhite',
		'exposition',
		'climaticConditions',
		'enviroment',
		'ventilation',
		'startingTime',
		'endingTime',
		'totalTime',
		'interval',
		'activities'
	]
};

type TChemicalAgentsLabels = {
	[key in keyof IChemicalAgentsForm]: string;
};

export const chemicalAgentsLabels: Omit<TChemicalAgentsLabels, 'signatures' | 'type'> = {
	company: 'Empresa',
	date: 'Data',
	sampleNumber: 'Número da Amostragem',
	name: 'Nome',
	function: 'Função',
	sector: 'Setor',
	ghe: 'GHE',
	epi: 'EPI',
	epc: 'EPC',
	deviceBrand: 'Marca do Aparelho',
	deviceModel: 'Modelo do Aparelho',
	deviceSerialNumber: 'Número de Série do Aparelho',
	calibrationBrand: 'Marca da Calibração',
	calibrationModel: 'Modelo da Calibração',
	calibrationSerialNumber: 'Número de Série da Calibração',
	startingCalibration: 'Calibração Inicial',
	endingCalibration: 'Calibração Final',
	flowRate: 'Desvio',
	agent: 'Agente',
	sample: 'Amostra',
	fieldWhite: 'Branco de Campo',
	exposition: 'Classificação da Exposição',
	climaticConditions: 'Condições Climáticas',
	enviroment: 'Ambiente',
	ventilation: 'Ventilação',
	startingTime: 'Hora Inicial',
	endingTime: 'Hora Final',
	totalTime: 'Tempo total',
	interval: 'Intervalo',
	activities: 'Tarefas Executadas'
};
