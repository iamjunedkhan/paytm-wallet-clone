import { atom } from 'recoil'

export const userState = atom({
    key: 'userState', // unique ID (with respect to other atoms/selectors)
    default: {
        name: ''
    }, // default value (aka initial value)
});

