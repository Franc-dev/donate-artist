export const PayHeroConfig = {
  Authorization:
    process.env.PAYHERO_AUTH_TOKEN ||
    "Basic SjJpWjd2d1BYc2RpajVxOXBpamY6QlBuMm56eGlLVENGUmtiUjdUTGhSZDV4TkxoUHVHeFRBRHNrejB6Sw==",
  pesapalConsumerKey: process.env.PESAPAL_CONSUMER_KEY || "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW",
  pesapalConsumerSecret: process.env.PESAPAL_CONSUMER_SECRET || "osGQ364R49cXKeOYSpaOnT++rHs=",
  pesapalApiUrl: "https://payments.pesapal.com/pesapalv3/api",
  pesapalCallbackUrl: process.env.NEXT_PUBLIC_BASE_URL + "/api/pesapal-callback",
  pesapalIpnId: process.env.PESAPAL_IPN_ID || "",
}
