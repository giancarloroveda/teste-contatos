export default interface Contact {
    id: number;
    type: "email" | "phone";
    description: string;
    person_id: number;
    person_name?: string;
}