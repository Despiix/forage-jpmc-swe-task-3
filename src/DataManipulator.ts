import { ServerRespond } from './DataStreamer';

// updated to match the schema
export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
    static generateRow(serverRespond: ServerRespond[]): Row {
        // Calculate average prices for ABC and DEF
        const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
        const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
        const ratio = priceABC / priceDEF;
        const upperBound = 1 + 0.10; // Set to +10%
        const lowerBound = 1 - 0.10; // Set to -10%
        // Return a new row which contains the calculated values
        return {
            price_abc: priceABC,
            price_def: priceDEF,
            ratio,
            timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
                       serverRespond[0].timestamp : serverRespond[1].timestamp,
            upper_bound: upperBound,
            lower_bound: lowerBound,
            trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
        };
    }
}

