import { photosStore } from '$lib/store';
import { getDownloadURL, listAll, ref, uploadString } from 'firebase/storage';
import { storage } from './firebase';

export const uploadPhoto = async (base64: string, valuationId: string) => {
	const metadata = {
		contentType: 'image/jpeg'
	};

	const storageRef = ref(storage, `valuationPhotos/${valuationId}/`);
	const storageSize = (await listAll(storageRef)).items.length;

	if (storageSize > 4) {
		throw new Error('Max of 5 photos for each valuation');
	}

	const photoRef = ref(storage, `valuationPhotos/${valuationId}/${storageSize + 1}`);

	uploadString(photoRef, base64, 'base64', metadata);
};

export const downloadPhotos = async (valuationId: string) => {
	photosStore.update((curr) => ({ ...curr, loading: true }));

	const storageRef = ref(storage, `valuationPhotos/${valuationId}/`);

	listAll(storageRef)
		.then(async (res) => {
			const { items } = res;
			const urls = await Promise.all(items.map((item) => getDownloadURL(item)));

			photosStore.update(() => ({
				photosUrls: urls,
				loading: false
			}));
		})
		.catch((error) => {
			// Uh-oh, an error occurred!
		});
};
