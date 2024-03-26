export function convertFileToBase64Web(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string);
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function convertFileToBase64Node(file: File) {
    const buffer = await file.arrayBuffer();

    return Buffer.from(buffer).toString('base64');
}
