import type { SignatureOwner } from '$lib/firebase/signatures';
import type { Timestamp } from 'firebase/firestore';
import type { EValuationTypesDisplayName } from './common';

export interface INoiseForm {
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
	errorMaring: string;
	startingTime: string;
	endingTime: string;
	totalTime: string;
	interval: string;
	activities: string;
}

export type TNoiseValuationPDFSections = {
	[key: string]: Array<keyof INoiseForm>;
};

export const heatSections: TNoiseValuationPDFSections = {
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
		'errorMaring'
	],
	'Dados da Amostragem': ['startingTime', 'endingTime', 'totalTime', 'interval', 'activities']
};

type TNoiseLabels = {
	[key in keyof INoiseForm]: string;
};

export const noiseLabels: Omit<TNoiseLabels, 'signatures' | 'type'> = {
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
	errorMaring: 'Desvio',
	startingTime: 'Hora Inicial',
	endingTime: 'Hora Final',
	totalTime: 'Tempo total',
	interval: 'Intervalo',
	activities: 'Tarefas Executadas'
};
