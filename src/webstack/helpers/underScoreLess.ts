export default function underScoreLess(inputString: string) {
    // The replace() method with regex can be used to replace all occurrences
    // The regex /_/g matches all occurrences of underscore
    // The regex /__/g matches all occurrences of double underscore
    // We chain replace methods to first replace double underscores, then single ones
    const result = inputString.replace(/__/g, ' ').replace(/_/g, ' ');
    return result;
}