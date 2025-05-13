// merchants.config.js
module.exports = {
    deploy:"nirv1",
    merchants: {
      mb1: {
        mid: "mb1",
        name: "deepturn",
        url: "https://deepturn.com",
        stripeId:"acct_1G38IXIodeKZRLDV",
        settings:{
         about:{
          title:'',
          description:'',
         }
        }
      },
      xi1: {
        mid: "xi1",
        name: "xInsurance",
        url: "https://deepturn.com",
        stripeId:"acct_1G38IXIodeKZRLDV",
        settings:{
         about:{
          title:'',
          description:'',
         }
        }
      },
      // ah1: {
      //   mid: "ah1",
      //   name: "aire-hotel",
      //   url: "https://airehotel.com",
      //   stripeId:""
      // },
      nirv1: {
        mid: "nirv1",
        name: "nirvana-energy",
        url: "https://nirvanaenergy.net",
        stripeId:"acct_1OWy0fE8XAGZDdpK",
        settings:{
          about:{ 
            title:'Off-grid specialists' ,
            description:'',
          },
         ecommerce:{
          productListing:{
            layoutStyle:'grid',
            size: 'xl'
          }
         },
        }
      },
    },
  };
  