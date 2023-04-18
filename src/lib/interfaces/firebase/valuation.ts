import type { Timestamp } from '@firebase/firestore';
import type IHeatForm from '../forms/heat';

interface Meta {
	createdAt: Timestamp;
	updatedAt: Timestamp;
	type: 'heat';
	createdBy: string;
}

export default interface IHeatValuationDoc {
	meta: Meta;
	data: IHeatForm;
}
