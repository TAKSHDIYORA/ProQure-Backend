export const generateDocumentNumber = (
    prefix: string
): string => {
    const timestamp = Date.now();

    return `${prefix}-${timestamp}`;
};