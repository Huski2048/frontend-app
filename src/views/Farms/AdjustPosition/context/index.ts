import { createContext, useContext } from 'react';

interface PercentageToCloseContextProps {
    percentage: number;
    setPercentage: (value: number) => void;
}

interface AddCollateralContextProps {
    isAddCollateral: boolean;
    handleIsAddCollateral: (value: boolean) => void;
}

interface ConvertToContextProps {
    isConvertTo: boolean;
    handleIsConvertTo: (value: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const PercentageToCloseContext = createContext<PercentageToCloseContextProps>({ percentage: 0, setPercentage: () => { } });
export const usePercentageToCloseContext = () => useContext(PercentageToCloseContext);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const AddCollateralContext = createContext<AddCollateralContextProps>({ isAddCollateral: true, handleIsAddCollateral: () => { } });
export const useAddCollateralContext = () => useContext(AddCollateralContext);

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ConvertToContext = createContext<ConvertToContextProps>({ isConvertTo: true, handleIsConvertTo: () => { } });
export const useConvertToContext = () => useContext(ConvertToContext);