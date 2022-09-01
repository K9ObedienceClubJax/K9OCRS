
export const testImageFilename = (filename) => {
    const displayableImageTypes = [
        '.png',
        '.jpg',
        '.jpeg',
        '.bmp',
        '.webp',
    ];

    let result = false;

    displayableImageTypes.forEach(ending => {
        if (filename.endsWith(ending)) {
            result = true;
            return;
        }
    });

    return result;
};
