import queryString from 'query-string';

type Params = Record<string, unknown>;

const isFilled = (value: unknown) =>
    value !== undefined && value !== null && value !== '';

export const buildParams = (params: Params): string => {
    const cleanedParams = Object.entries(params).reduce<Params>(
        (acc, [key, value]) => {
            if (Array.isArray(value)) {
                const items = value.filter(isFilled);
                if (items.length > 0) acc[key] = items;
            } else if (isFilled(value)) {
                acc[key] = value;
            }
            return acc;
        },
        {}
    );

    const result = queryString.stringify(cleanedParams, {
        arrayFormat: 'none',
    });

    return result ? `?${result}` : '';
};
