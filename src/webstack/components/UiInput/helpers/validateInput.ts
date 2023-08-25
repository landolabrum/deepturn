import { ValueType } from "@webstack/models/input";

export function validateInput(value: ValueType | undefined, type?: string) {
    if (!value || typeof value !== "string" || !type) return true;
    switch (type) {
        case "email":
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        // add more cases
        default:
            return true;
    }
}