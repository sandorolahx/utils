import { IReactionOptions,reaction } from 'mobx';

export const reactionWithOldValue = <T>(
    expression: () => T,
    effect: (newValue: T, oldValue: T) => void,
    initValue?: T,
    opts?: IReactionOptions
) => {
    let oldValue: T = initValue;
    return reaction(expression, value => {
        effect(value, oldValue);
        oldValue = value;
    }, opts);
};
