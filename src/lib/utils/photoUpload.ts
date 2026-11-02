type PhotoUpload = { name: string; file: File; error?: never } | { error: string };

/** Read the DOM values at submission time (including browser autofill). */
export function readPhotoUpload(formData: FormData): PhotoUpload {
	const value = formData.get('name');
	const name = typeof value === 'string' ? value.trim() : '';
	if (!name) {
		return { error: 'Veuillez saisir un nom avant d’envoyer la photo.' };
	}
	if (name.length > 255) {
		return { error: 'Le nom ne doit pas dépasser 255 caractères.' };
	}

	const file = formData.get('photo');
	if (!(file instanceof File) || !file.name) {
		return { error: 'Veuillez sélectionner un fichier JPEG.' };
	}
	if (file.size === 0) {
		return { error: 'Le fichier sélectionné est vide. Veuillez choisir une autre photo.' };
	}
	if (file.size > 20_000_000) {
		return { error: 'La photo ne doit pas dépasser 20 Mo.' };
	}
	if (file.type !== 'image/jpeg') {
		return { error: 'Veuillez sélectionner une photo au format JPEG.' };
	}

	return { name, file };
}
