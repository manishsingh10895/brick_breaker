import React from 'react';
import { UserInfo } from '../infra/userInfo';

const defaultContextValue = {
    userInfo: {
        name: '',
        address: ''
    },
    saveUserInfo: (info: UserInfo) => { },
    paymentOptionsVisible: false,
    showPaymentOptions: null,
    hidePaymentOptions: null
}

export type GameContextType = {
    userInfo: UserInfo,
    saveUserInfo: (info: UserInfo) => void,
    paymentOptionsVisible: boolean,
    showPaymentOptions: () => void,
    hidePaymentOptions: () => void
};

export default React.createContext<GameContextType>(defaultContextValue);

