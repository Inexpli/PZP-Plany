export const getSemester = (group: string): number | undefined => {
    const parts = group.split("/");

    const semesterPart = parts[2]; // Sprawdzamy trzeci element (np. "IIst" lub "Ist")

    if (semesterPart === "Ist") {
        return 1;
    } else if (semesterPart === "IIst") {
        return 2;
    }

    return undefined; // Zwracamy undefined, jeśli nie znaleziono semestru
};
