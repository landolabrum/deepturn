type JustAlign = 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around';
type fDirection = 'row' | 'column' | 'column-reverse' | 'row-reverse';
interface IDflex {
    display?: 'flex';
    align?: JustAlign;
    justify?: JustAlign;
    gap?: string;
    direction?: fDirection;
    height: string;
}

interface ODflex extends Omit<IDflex, 'align' | 'justify'> {
    'justify-content'?: JustAlign;
    'align-items'?: JustAlign;
    'flex-direction': fDirection;
    width: string;
}

const dFlex = (props?: IDflex): string => {
    const {
        display = 'flex',
        align = 'center',
        justify = 'center',
        gap = '0',
        direction = 'row',
        height='100%'
    } = props || {};

    const context: string = `{ display: ${display}; justify-content: ${justify}; align-items: ${align}; gap: ${gap}; flex-direction: ${direction};width: 100%; height:${height}}`

    // Assuming that we only want to include properties in the JSON that are not default values
    // Object.keys(context).forEach(key => {
    //     // If the value is the default, we don't include it in the output
    //     if (context[key as keyof ODflex] === 'flex' || context[key as keyof ODflex] === 'center' || context[key as keyof ODflex] === '0' || context[key as keyof ODflex] === 'row') {
    //         delete context[key as keyof ODflex];
    //     }
    // });
    return context;
};

export default dFlex;
