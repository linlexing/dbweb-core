const labelMatch = /^[0-9]{2}\./;
export function clearText(val: string) {
    if (labelMatch.test(val)) {
        return val.substr(3);
    }
    return val;
}
