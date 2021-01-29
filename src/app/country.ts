export class Country {

    countryName: string;
    newCases: number;
    totalCases: number;
    newDeaths: number;
    totalDeaths: number;
    newRecovered: number;
    totalRecovered: number;

    constructor()
        {
            this.countryName = "";
            this.newCases = 0;
            this.totalCases = 0;
            this.newDeaths = 0;
            this.totalDeaths = 0;
            this.newRecovered = 0;
            this.totalRecovered = 0;
    }
}
