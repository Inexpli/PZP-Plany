import {useState} from "react";
import {getGroups} from "@/components/classes/GroupSelector.ts";
import {University} from "../../../types/University.ts";
import {getStudyTypeForGroups, getStudyTypeLabel, getStudyTypes} from "@/components/classes/StudyTypeSelector.ts"; // Zaimportowanie nowej funkcji

type ClassesProps = {
    propCatedral: string;
    dataCatedral: string;
    propSelectedWydzial: string;
    propData: University;
    isOpen: boolean;
    onToggle: () => void;
};

export const Classes = ({
                            propCatedral,
                            dataCatedral,
                            propSelectedWydzial,
                            propData,
                            isOpen,
                            onToggle
                        }: ClassesProps) => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    const zajecia = propData?.[propSelectedWydzial]?.[dataCatedral] || {};
    const availableGroups = new Set<string>();
    const groupedBySubject: Record<string, Record<string, { rooms: string[] }>> = {};

    Object.entries(zajecia).forEach(([nauczyciel, zajeciaList]) => {
        zajeciaList.forEach((zaj) => {
            const studyType = getStudyTypeForGroups(zaj.groups); // Teraz korzystamy z funkcji w StudyTypeSelector.ts

            if (selectedType && studyType === selectedType) {
                const groups = getGroups(zaj.groups);
                groups.forEach(group => availableGroups.add(group));

                if (!selectedGroup || groups.includes(selectedGroup)) {
                    const subject = zaj.subject || "Nienazwane";
                    if (!groupedBySubject[subject]) groupedBySubject[subject] = {};
                    if (!groupedBySubject[subject][nauczyciel]) groupedBySubject[subject][nauczyciel] = {rooms: []};
                    groupedBySubject[subject][nauczyciel].rooms.push(...zaj.rooms);
                }
            }
        });
    });

    return (
        <div className="my-4">
            <div
                className={`bg-white text-black flex justify-center w-3/5 mx-auto p-4 cursor-pointer rounded-xl text-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 hover:bg-gray-200 ${isOpen ? "scale-110 !bg-custom-blue !text-white" : ""}`}
                onClick={onToggle}>
                {propCatedral}
            </div>
            {isOpen && (
                <div className="p-6 flex flex-col items-center">
                    {/* Logika do wyboru trybu studiów */}
                    <div className="flex gap-4 mb-4">
                        {getStudyTypes().map((type) => (
                            <button key={type}
                                    className={`bg-white text-black px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:scale-105 hover:bg-gray-200 cursor-pointer ${selectedType === type ? "scale-110 !bg-custom-blue !text-white" : ""}`}
                                    onClick={() => {
                                        setSelectedType(type === selectedType ? null : type);
                                        setSelectedGroup(null);
                                    }}>
                                {getStudyTypeLabel(type)}
                            </button>
                        ))}
                    </div>

                    {selectedType && availableGroups.size > 0 && (
                        <div className="flex gap-4 mb-4">
                            {[...availableGroups].map((group) => (
                                <button key={group}
                                        className={`bg-white text-black px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:scale-105 cursor-pointer hover:bg-gray-200 ${selectedGroup === group ? "scale-110 !bg-custom-blue !text-white" : ""}`}
                                        onClick={() => setSelectedGroup(group === selectedGroup ? null : group)}>
                                    {group}
                                </button>
                            ))}
                        </div>
                    )}

                    {selectedType && Object.keys(groupedBySubject).length > 0 ? (
                        <div className="grid grid-cols-2 gap-6">
                            {Object.entries(groupedBySubject).map(([subject, teachers]) => (
                                <div key={subject} className="bg-white text-black p-6 rounded-xl shadow-md w-80">
                                    <h2 className="text-xl text-center font-bold border-b border-black pb-2 mb-2">{subject}</h2>
                                    <ul className="space-y-2">
                                        {Object.entries(teachers).map(([nauczyciel, {rooms}], index) => (
                                            <li key={index} className="text-center">
                                                <p className="font-semibold">{nauczyciel}</p>
                                                <p className="text-sm text-gray-600">Sala: {rooms.join(", ")}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        selectedType &&
                        <p className="text-center text-gray-500">Brak zajęć dla wybranego trybu lub grupy.</p>
                    )}
                </div>
            )}
        </div>
    );
};
