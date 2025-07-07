export default class Validator {
    static isString(value: any) {
        return typeof value === "string";
    }

    static isCpf(value: string) {
        console.log(value);
        return value.replace(/[-.]/g, "").length === 11;
    }

    static isEmail(email: string) {
        return email.includes("@");
    }
}