// StudyTypeSelector.ts
export const getStudyTypes = () => ["S", "NZ", "NW"];

export const getStudyTypeLabel = (type: string) => {
    switch (type) {
        case "S":
            return "Stacjonarne";
        case "NZ":
            return "Zaoczne";
        case "NW":
            return "Wieczorowe";
        default:
            return "Nieznany";
    }
};

// Funkcja, która znajduje typ studiów na podstawie grup
export const getStudyTypeForGroups = (groups: string[]): string => {
    return groups.length
        ? getStudyTypes().find(type => groups.some(g => g.includes(`/${type}/`))) ?? "S"
        : "S";
};
