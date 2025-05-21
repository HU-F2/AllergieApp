import { createContext, ReactNode, useContext, useState } from 'react';
import { PollenTypes } from '../components/PollenMap';

type SelectedPollenContextType = {
    selectedPollenType: PollenTypes;
    setSelectedPollenType: (pollenType:PollenTypes)=>void;
};

const SelectedPollenContext = createContext<SelectedPollenContextType | null>(null);

type Props = {
    children: ReactNode;
};

export const SelectedPollenProvider = ({ children }: Props) => {
    
    const [selectedPollenType, setSelectedPollenType] = useState(PollenTypes.Birch);

    return (
        <SelectedPollenContext.Provider
            value={{
                selectedPollenType,
                setSelectedPollenType
            }}
        >
            {children}
        </SelectedPollenContext.Provider>
    );
};

export const useSelectedPollenContext = (): SelectedPollenContextType => {
    const context = useContext(SelectedPollenContext);
    if (!context) {
        throw new Error(
            'useSelectedPollenContext must be used within a SelectedPollenProvider'
        );
    }
    return context;
};
