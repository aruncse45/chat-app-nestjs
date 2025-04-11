import io from 'socket.io-client';

export const socket = io('http://localhost:4000', {
    transports: ['websocket'],
});

export const socketInitializer = async () => {
    try {
        await fetch('/api/socket');
        return true;
    } catch (error) {
        console.error('Error initializing socket:', error);
        return false;
    }
};