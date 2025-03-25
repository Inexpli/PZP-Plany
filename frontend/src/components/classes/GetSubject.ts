export const getSubject = (group: string): string | undefined => {
    return group.split("/")[0]; // Zwraca pierwszą część przed "/"
};
