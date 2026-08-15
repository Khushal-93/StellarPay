import React from 'react';
import { MockStateProvider } from '../../context/MockStateProvider';
import { DevStateSwitcher } from './DevStateSwitcher';

interface DevStateSwitcherWithProviderProps {
    onPreFillForm?: (recipient: string, amount: string) => void;
}

export const DevStateSwitcherWithProvider: React.FC<
    DevStateSwitcherWithProviderProps
> = ({ onPreFillForm }) => {
    return (
        <MockStateProvider>
            <DevStateSwitcher onPreFillForm={onPreFillForm} />
        </MockStateProvider>
    );
};