
// merchants.config.js
module.exports = {
  // choose your default build target (must be a key in merchants)
  deploy: "xi1",

  merchants: {
    mb1: {
      mid: "mb1",
      name: "deepturn",
      url: "https://deepturn.com",
      stripeId: "acct_1G38IXIodeKZRLDV",
      settings: {
        optIn: true,
        about: { title: "", description: "" },
        marketing: {
          headerTitle: "Sign up for marketing lists",
          accountHeader: "Deepturn Free Tier",
          accountBody: "Gain free, knowledge of Deepturn's products & services",
          services: [{ name: "google", cost: 100 }, { name: "tiktok" }, { name: "instagram" }],
        },
      },
    },

    xi1: {
      mid: "xi1",
      name: "xInsurance",
      display:"sports",
      url: "https://xsports.media",
      stripeId: "acct_1G38IXIodeKZRLDV",
      settings: {
        about: { title: "", description: "" },
        marketing: {
          headerTitle: "Join xInsurance outreach programs",
          accountHeader: "xInsurance Free Tier",
          accountBody: "Explore xInsurance's insurance products & services and expand your client engagement.",
          services: [{ name: "linkedin", cost: 65 }, { name: "facebook" }],
        },
      },
    },

    nirv1: {
      mid: "nirv1",
      name: "nirvana-energy",
      url: "https://nirvanaenergy.net",
      stripeId: "acct_1OWy0fE8XAGZDdpK",
      settings: {
        optIn: true,
        about: { title: "Off-grid specialists", description: "" },
        contact: [
          {
            email: "sales@nirvanaenergy.net",
            tel: "+16027044648",
            address: "",
            role: "user-contact",
            roleDescription: "",
          },
        ],
        ecommerce: { productListing: { layoutStyle: "grid", size: "xl" } },
        marketing: {
          headerTitle: "Promote sustainable energy solutions",
          accountHeader: "Nirvana Energy Free Tier",
          accountBody: "Learn about Nirvana Energy's off-grid technologies and connect with eco-conscious customers.",
          services: [{ name: "solar", cost: 85 }, { name: "battery" }, { name: "offgrid" }],
        },
      },
    },
  },
};