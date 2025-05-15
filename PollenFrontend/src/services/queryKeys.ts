// src/constants/queryKeys.js

import { Coordinate } from './pollenService';

export const QUERY_KEYS = {
    // User-related queries
    user: {
        all: ['users', 'all'],
    },

    // Location-related queries
    location: {
        me: ['locations', 'me'],
        list: ['locations', 'list'],
    },

    // Pollen-related queries
    pollen: {
        map: ['pollen', 'map'],
        location: (coordinate?: Coordinate) => [
            'pollen',
            coordinate?.latitude,
            coordinate?.longitude,
        ],
    },

    // Weather-related queries
    weather: {
        forecast: (latitude?: number, longitude?: number) => [
            'weather',
            'forecast',
            latitude,
            longitude,
        ],
    },
};
