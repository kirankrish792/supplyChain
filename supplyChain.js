const crypto = require("crypto");


// Class to represent a Farmer
module.exports.Farmer = class Farmer {
    constructor(name, location, milkAmount) {
        this.name = name;
        this.location = location;
        this.milkAmount = milkAmount;
    }

    sellMilk(processor, milkAmount) {
        if (parseInt(this.milkAmount) < parseInt(milkAmount)) {
            console.log(`Not enough milk available for sale!`);
            return false;
        }
        this.milkAmount =parseInt(this.milkAmount) - parseInt(milkAmount);
        console.log(`Milk sold by ${this.name}`);
        processor.buyMilk(this, milkAmount);
        return true;
    }
    addMilk(milkAdd) {
        this.milkAmount = parseInt(this.milkAmount) + parseInt(milkAdd);
    }
}

// Class to represent a Processor
module.exports.Processor = class Processor {
    constructor(name, location) {
        this.name = name;
        this.location = location;
        this.milkAmount = 0;
        this.milkStock = [];
    }



    buyMilk(farmer, milkAmount) {
        this.milkAmount = parseInt(this.milkAmount) + parseInt(milkAmount);
        this.milkStock.push(
            {
                farmerName: farmer.name,
                location: farmer.location,
                id: crypto.randomBytes(16).toString("hex"),
                amount: milkAmount
            });
        // console.log(`Milk bought by ${this.name}`,this.milkStock);
    }

    sellMilk(distributor, milkID, milkAmount) {
        let index = -1;
        for (let i = 0; i < this.milkStock.length; i++) {
            if (this.milkStock[i].id === milkID) {
                index = i;
                break;
            }
        }
        if (index === -1) {
            console.log(`Milk with ID ${milkID} not found in stock!`);
            return;
        }
        if (parseInt(this.milkStock[index].milkAmount) < parseInt(milkAmount)) {
            console.log(`Not enough milk with ID ${milkID} in stock!`);
            return;
        }
        this.milkAmount = parseInt(this.milkAmount) - parseInt(milkAmount);
        distributor.buyMilk(this, milkID, milkAmount);
    }
}

// Class to represent a Distributor
module.exports.Distributor = class Distributor {
    constructor(name, location) {
        this.name = name;
        this.location = location;
        this.milkAmount = 0;
        this.milkStock = [];
    }


    buyMilk(processor, milkID, milkAmount) {
        this.milkAmount = parseInt(this.milkAmount) + parseInt(milkAmount);
        this.milkStock.push({
            processorName: processor.name,
            location: processor.location,
            id: milkID,
            amount: milkAmount,
        });
    }

    sellMilk(retailer, milkID, milkAmount) {
        let index = -1;
        for (let i = 0; i < this.milkStock.length; i++) {
            if (this.milkStock[i].id === milkID) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            console.log(`Milk with ID ${milkID} not found in stock!`);
            return;
        }
        if (parseInt(this.milkStock[index].milkAmount) < parseInt(milkAmount)) {
            console.log(`Not enough milk with ID ${milkID} in stock!`);
            return;
        }

        this.milkAmount = parseInt(this.milkAmount) - parseInt(milkAmount);
        retailer.buyMilk(this, milkID, milkAmount);
    }
}

// Class to represent a Retailer
module.exports.Retailer = class Retailer {
    constructor(name, location) {
        this.name = name;
        this.location = location;
        this.milkAmount = 0;
        this.milkStock = [];
    }


    buyMilk(distributor, milkID, milkAmount) {
        this.milkAmount = parseInt(this.milkAmount) + parseInt(milkAmount);
        this.milkStock.push({
            distrubuterName: distributor.name,
            location: distributor.location,
            id: milkID,
            amount: milkAmount,
        });
        console.log(`Milk bought by ${this.name}`, this.milkStock);
    }

    sellMilk(milkID, milkAmount) {
        let index = -1;
        console.log(this.milkStock);
        for (let i = 0; i < this.milkStock.length; i++) {
            console.log(this.milkStock[i]);
            if (this.milkStock[i].id === milkID) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            console.log(`Milk with ID ${milkID} not found in stock!`);
            return;
        }
        if (parseInt(this.milkStock[index].milkAmount) < parseInt(milkAmount)) {
            console.log(`Not enough milk with ID ${milkID} in stock!`);
            return;
        }

        this.milkAmount = parseInt(this.milkAmount) - parseInt(milkAmount);
        console.log(`Milk with ${milkID} sold by ${this.name}`);
    }

}

// Class to represent the Supply Chain
module.exports.SupplyChain = class SupplyChain {
    constructor() {
        this.processors = [];
        this.farmers = [];
        this.distributors = [];
        this.retailers = [];
    }

    addFarmer(farmer) {
        this.farmers.push(farmer);
    }

    addProcessor(processor) {
        this.processors.push(processor);
    }

    addDistributor(distributor) {
        this.distributors.push(distributor);
    }

    addRetailer(retailer) {
        this.retailers.push(retailer);
    }
}
/*
! DO NOT MODIFY ANYTHING BELOW THIS LINE
const f1 = new Farmer('Farmer 1', 'Location 1', 100);
const f2 = new Farmer('Farmer 2', 'Location 2', 100);

const p1 = new Processor('Processor 1', 'Location 1');
const p2 = new Processor('Processor 2', 'Location 2');

const d1 = new Distributor('Distributor 1', 'Location 1');
const d2 = new Distributor('Distributor 2', 'Location 2');


const r1 = new Retailer('Retailer 1', 'Location 1');
const r2 = new Retailer('Retailer 2', 'Location 2');

const supplyChain = new SupplyChain();

supplyChain.addFarmer(f1);
supplyChain.addFarmer(f2);

supplyChain.addProcessor(p1);
supplyChain.addProcessor(p2);

supplyChain.addDistributor(d1);
supplyChain.addDistributor(d2);

supplyChain.addRetailer(r1);
supplyChain.addRetailer(r2);


f1.sellMilk(p1, 100);
p1.sellMilk(d1, 1, 100);
d1.sellMilk(r1, 1, 100);
r1.sellMilk(1, 100);
*/



// module.export = { Farmer, Processor, Distributor, Retailer, SupplyChain };