import type {Game} from './Game';
import type {Client} from './Client';

export interface Prestamo {
    _id:string;
    game:Game;
    client:Client;
    startDate:string;
    endDate:string;
}