// utils/scheduleUtils.ts
export const findTeacherForGroup = (group: string, schedule: any): string[] => {
    const result: string[] = [];

    // Przechodzimy przez wszystkie jednostki i kursy
    for (const department in schedule) {
        for (const course in schedule[department]) {
            const teachers = schedule[department][course];

            // Sprawdzamy każdego nauczyciela w danym kursie
            for (const teacherName in teachers) {
                const activities = teachers[teacherName];

                // Sprawdzamy wszystkie zajęcia nauczyciela
                for (const activity of activities) {
                    // Jeśli grupa nauczyciela pasuje do podanej grupy, dodajemy nauczyciela do wyniku
                    if (activity.groups.includes(group)) {
                        result.push(teacherName);
                        break; // Jeśli znaleziono nauczyciela, nie musimy sprawdzać innych zajęć tego nauczyciela
                    }
                }
            }
        }
    }

    return result;
};
