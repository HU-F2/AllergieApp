export const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
    });
};