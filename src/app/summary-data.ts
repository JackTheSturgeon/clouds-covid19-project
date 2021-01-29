export class SummaryData {
    // Original values fetched
    newCases: number;
    totalCases: number;
    newDeaths: number;
    totalDeaths: number;
    newRecovered: number;
    totalRecovered: number;

    // Computed values
    activeCases: number;
    recoveryRate: number;
    mortalityRate: number;

    constructor(){
        this.newCases = 0;
        this.totalCases = 0;
        this.newDeaths = 0;
        this.totalDeaths = 0;
        this.newRecovered = 0;
        this.totalRecovered = 0;

        this.activeCases = 0;
        this.recoveryRate = 0;
        this.mortalityRate = 0;
    }

}
