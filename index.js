const stripe = require("stripe")(
  "sk_test_51Hn0efLfdjVvBOdZ4MxAV7C7Sv7bp5Jt6e1hKDap7AzX8OK77GQGLOAYZ49DTdwaMAgNFxo6iIiDBCpXL1cwATF400ntZSp1yh"
)

const getSubscriptions = async () => {
  const subscriptions = await stripe.subscriptions.list({
    limit: 3,
    status: "all",
  })

  console.log(subscriptions)
}

getSubscriptions()
