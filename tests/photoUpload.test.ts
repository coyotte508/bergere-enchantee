// Run with Node >= 22.18: node --test tests/photoUpload.test.ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readPhotoUpload } from '../src/lib/utils/photoUpload.ts';

function form(
	name = 'Fauteuil fleuri',
	file = new File(['jpeg'], 'photo.jpg', { type: 'image/jpeg' })
) {
	const data = new FormData();
	data.set('name', name);
	data.set('photo', file);
	return data;
}

test('uses the current submitted name, trimmed, and the selected file', () => {
	const data = form('Ancien nom');
	data.set('name', '  Nom saisi ou rempli automatiquement  ');
	const result = readPhotoUpload(data);
	assert.equal(result.error, undefined);
	assert.equal(result.name, 'Nom saisi ou rempli automatiquement');
	assert.equal(result.file, data.get('photo'));
});

test('rejects missing, empty, whitespace-only, non-string and overlong names', () => {
	for (const name of ['', '   ', 'a'.repeat(256)]) {
		assert.ok(readPhotoUpload(form(name)).error);
	}
	const data = form();
	data.delete('name');
	assert.ok(readPhotoUpload(data).error);
	data.set('name', new File(['name'], 'name.txt'));
	assert.ok(readPhotoUpload(data).error);
	assert.equal(readPhotoUpload(form('a'.repeat(255))).error, undefined);
});

test('rejects missing, empty and non-JPEG files with French feedback', () => {
	const data = form();
	data.delete('photo');
	assert.match(readPhotoUpload(data).error ?? '', /sélectionner un fichier JPEG/);
	data.set('photo', 'not a file');
	assert.ok(readPhotoUpload(data).error);
	assert.match(
		readPhotoUpload(form('Photo', new File([], 'empty.jpg', { type: 'image/jpeg' }))).error ?? '',
		/vide/
	);
	assert.match(
		readPhotoUpload(form('Photo', new File(['png'], 'photo.png', { type: 'image/png' }))).error ??
			'',
		/format JPEG/
	);
});

test('matches the upload endpoint’s 20 MB size limit', () => {
	const file = new File([new Uint8Array(20_000_000)], 'photo.jpg', { type: 'image/jpeg' });
	assert.equal(readPhotoUpload(form('Photo', file)).error, undefined);
	const oversized = new File([file, 'x'], 'photo.jpg', { type: 'image/jpeg' });
	assert.match(readPhotoUpload(form('Photo', oversized)).error ?? '', /20 Mo/);
});
