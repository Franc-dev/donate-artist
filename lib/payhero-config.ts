export const PayHeroConfig = {
  Authorization: process.env.PAYHERO_AUTH_TOKEN,
  pesapalConsumerKey: process.env.PESAPAL_CONSUMER_KEY,
  pesapalConsumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
  pesapalApiUrl: "https://payments.pesapal.com/pesapalv3/api",
  pesapalCallbackUrl: process.env.NEXT_PUBLIC_BASE_URL + "/api/pesapal-callback",
  pesapalIpnId: process.env.PESAPAL_IPN_ID || "",
}
