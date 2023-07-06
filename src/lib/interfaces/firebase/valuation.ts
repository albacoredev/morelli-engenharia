import type { Timestamp } from '@firebase/firestore';
import type { ValuationTypesDisplayName } from '../forms/common';
import type IHeatForm from '../forms/heat';

interface Meta {
	createdAt: Timestamp;
	updatedAt: Timestamp;
	type: keyof typeof ValuationTypesDisplayName;
	createdBy: string;
}

export default interface IHeatValuationDoc {
	meta: Meta;
	data: IHeatForm;
}
