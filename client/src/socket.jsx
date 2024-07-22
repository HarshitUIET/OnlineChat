import { createContext } from 'react';
import io from 'socket.io-client';
import { useMemo } from 'react';
import { useContext } from 'react';

const SocketContext = createContext();

const getSocket = () => {
    return useContext(SocketContext);
}

const SocketProvider = ({ children }) => {

    const socket = useMemo(()=>io(import.meta.env.VITE_SERVER || 'http://localhost:3000',
    {
        withCredentials: true
    }
    ), []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )

};

export { SocketProvider, getSocket}

