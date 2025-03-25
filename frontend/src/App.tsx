import "./App.css";
import {useEffect, useState} from "react";
import {SideBarLeft} from "@/components/SideBarLeft.tsx";
import {MainContent} from "@/components/MainContent.tsx";
import {University} from "../types/University.ts";

// Typy dla obiektów z JSON-a (o który pytasz) - zgodnie z tymi, które podałeś:
type Department = {
    [catedral: string]: TeacherClasses;
};

type TeacherClasses = {
    [teacher: string]: ClassDetails[];
};

type ClassDetails = {
    subject: string;
    activity_type: string;
    groups: string[];
    rooms: string[];
};

function App() {
    const [data, setData] = useState<University | null>(null);
    const [selectedWydzial, setSelectedWydzial] = useState<string>("");
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [teachersForSubject, setTeachersForSubject] = useState<string[]>([]);

    useEffect(() => {
        fetch("/plan.json")
            .then((res) => res.json())
            .then((json: University) => setData(json))
            .catch((error) => console.error("Error fetching plan.json:", error));
    }, []);

    // Funkcja zwracająca unikalne przedmioty z całego JSON-a
    const getAllSubjects = () => {
        if (!data) return [];
        const subjects: Set<string> = new Set();

        // Iteracja przez wszystkie wydziały, katedry, nauczycieli i ich przedmioty
        Object.values(data).forEach((faculty) => {
            Object.values(faculty).forEach((teachersData: TeacherClasses) => {
                Object.values(teachersData).forEach((classes: ClassDetails[]) => {
                    classes.forEach((classDetails) => {
                        const subjectPrefix = classDetails.subject.split("/")[0]; // Pobiera część przed "/"
                        subjects.add(subjectPrefix); // Dodaje do zestawu, aby zapewnić unikalność
                    });
                });
            });
        });

        return Array.from(subjects).sort(); // Zwraca posortowaną listę przedmiotów
    };

    // Funkcja zwracająca nauczycieli dla wybranego przedmiotu
    const getTeachersBySubject = (subject: string | null) => {
        if (!data || !subject) return [];
        const teachers: string[] = [];

        // Iteracja przez wszystkie wydziały, katedry, nauczycieli i ich przedmioty
        Object.entries(data).forEach(([faculty, facultyData]) => {
            Object.entries(facultyData).forEach(([catedral, teachersData]) => {
                Object.entries(teachersData).forEach(([teacher, teacherClasses]) => {
                    teacherClasses.forEach((classDetails) => {
                        const subjectPrefix = classDetails.subject.split("/")[0]; // Pobieramy część przed "/"
                        if (subjectPrefix === subject) {
                            teachers.push(teacher); // Dodajemy nauczyciela, jeśli przedmiot się zgadza
                        }
                    });
                });
            });
        });

        return teachers;
    };

    // Obsługuje zmianę wybranego przedmiotu
    const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const subject = event.target.value;
        setSelectedSubject(subject);
        setTeachersForSubject(getTeachersBySubject(subject)); // Pobieramy nauczycieli dla wybranego przedmiotu
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const subjects = getAllSubjects(); // Pobieramy wszystkie przedmioty

    return (
        <div className="w-screen overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full bg-custom-blue text-white flex p-2 z-20">
                <div className="cursor-pointer" onClick={handleRefresh}>
                    <div className="flex items-center">
                        <img src="/logo.png" alt="logo" className="h-15"/>
                        <img src="/topwrite.png" alt="topwrite" className="h-15"/>
                    </div>
                </div>
            </div>

            <div className="flex flex-row bg-custom-blue min-h-screen pt-16">
                <SideBarLeft propData={data} propSetSelectedWydzial={setSelectedWydzial}/>
                {data && <MainContent propData={data} propSelectedWydzial={selectedWydzial}/>}

                <div className="w-1/3 p-5">
                    {/* Wybór przedmiotu */}
                    <h3 className="text-xl font-semibold text-white">Wybierz przedmiot:</h3>
                    <select
                        className="mt-2 p-2 rounded"
                        value={selectedSubject || ""}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Wybierz przedmiot</option>
                        {subjects.map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
                    </select>

                    {selectedSubject && (
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold text-white">Nauczyciele:</h4>
                            <ul className="mt-2">
                                {teachersForSubject.map((teacher, index) => (
                                    <li key={index} className="text-white">
                                        {teacher}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
