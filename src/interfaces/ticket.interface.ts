export interface Ticket {
    price: number;
    flightDuration: number;
    flights: Flight[];
}

export interface Flight {
    cities: Cities;
    departureTime: string;
    departureDate: string;
    arrivalTime: string;
    arrivalDate: string;
    airline: Airlane;
}

export interface Cities {
    departureCity: string;
    departureAirportName: string;
    arrivalCity: string;
    arrivalAirportName: string;
}

export interface Airlane {
    code: string;
    name: string;
}

