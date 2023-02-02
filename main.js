const Hapi = require('@hapi/hapi');
const ejs = require('ejs');
const { Farmer, Processor, Distributor, Retailer, SupplyChain } = require('./supplyChain')
// * Create a server with a host and port


const init = async () => {
    const app = Hapi.server({
        port: 3000,
        // ! below value makes conflict while using docker container
        // host: 'localhost'
    })
    await app.start();
    console.log('Server running on %s', app.info.uri);

    // * Register vision plugin

    await app.register(require('@hapi/vision'));
    app.views({
        engines: {
            ejs: ejs
        },
        relativeTo: __dirname,
        path: 'views'
    });

    // Initialize Supplychain

    const supplyChain = new SupplyChain();

    // * Add the route

    app.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return h.view('index', { supplyChain })
        }
    });

    app.route({
        method: "GET",
        path: "/addFarmer",
        handler: (request, h) => {
            return h.view("addFarmer")
        }
    })

    app.route({
        method: "POST",
        path: "/addFarmer",
        handler: (request, h) => {
            const { name, location, milkAmount } = request.payload
            const newFarmer = new Farmer(name, location, milkAmount)
            supplyChain.addFarmer(newFarmer)
            return h.redirect("/")
        }
    })

    app.route({
        method: "GET",
        path: "/addProcessors",
        handler: (request, h) => {
            return h.view("addProcessor")
        }
    })

    app.route({
        method: "POST",
        path: "/addProcessor",
        handler: (request, h) => {
            const { name, location } = request.payload
            const newProcessor = new Processor(name, location)
            supplyChain.addProcessor(newProcessor)
            return h.redirect("/")
        }
    })

    app.route({
        method: "GET",
        path: "/addDistributors",
        handler: (request, h) => {
            return h.view("addDistributor")
        }
    })

    app.route({
        method: "POST",
        path: "/addDistributors",
        handler: (request, h) => {
            const { name, location } = request.payload
            const newDistributor = new Distributor(name, location)
            supplyChain.addDistributor(newDistributor)
            return h.redirect("/")
        }
    })

    app.route({
        method: "GET",
        path: "/addRetailers",
        handler: (request, h) => {
            return h.view("addRetailer")
        }
    })

    app.route({
        method: "POST",
        path: "/addRetailer",
        handler: (request, h) => {
            const { name, location } = request.payload
            const newRetailer = new Retailer(name, location)
            supplyChain.addRetailer(newRetailer)
            return h.redirect("/")
        }
    })

    app.route({
        method: "POST",
        path: "/sellMilk",
        handler: (request, h) => {
            const { toName, fromName, milkAmount, from, milkId } = request.payload
            switch (from) {
                case "farmer":
                    supplyChain.farmers.forEach(farmer => {
                        if (farmer.name === fromName) {
                            supplyChain.processors.forEach(processor => {
                                if (processor.name === toName) {
                                    farmer.sellMilk(processor, milkAmount)
                                }
                            })
                        }
                    })
                    break;
                case "processor":
                    supplyChain.processors.forEach(processor => {
                        if (processor.name === fromName) {
                            supplyChain.distributors.forEach(distributor => {
                                if (distributor.name === toName) {
                                    processor.sellMilk(distributor, milkId, milkAmount)
                                }
                            })
                        }
                    })
                    break;
                case "distributor":
                    supplyChain.distributors.forEach(distributor => {
                        console.log("hello")
                        if (distributor.name === fromName) {
                            supplyChain.retailers.forEach(retailer => {
                                if (retailer.name === toName) {
                                    distributor.sellMilk(retailer, milkId, milkAmount)
                                }
                            })
                        }
                    })
                    break;

                case "retailer":
                    supplyChain.retailers.forEach(retailer => {
                        if (retailer.name === fromName) {
                            retailer.sellMilk(milkId, milkAmount)
                        }
                    })
                    break;

                default:
                    console.log("Incorrect Entry")
            }

            return h.redirect("/")
        }
    })


    app.route({
        method: "GET",
        path: "/sellMilk",
        handler: (request, h) => {
            return h.view("sell", { supplyChain })
        }
    })

    app.route({
        method: "GET",
        path: "/addMilk",
        handler: (request, h) => {
            return h.view("addMilk")
        }
    })

    app.route({
        method: "POST",
        path: "/addMilk",
        handler: (request, h) => {
            const { name, milkAmount } = request.payload
            supplyChain.farmers.forEach(farmer => {
                if (farmer.name === name) {
                    farmer.addMilk(milkAmount)
                }
            })
            return h.redirect("/")
        }
    })

    app.route({
        method: "GET",
        path: "/supplyChain",
        handler: (request, h) => {
            return supplyChain
        }
    })

}

init()
