import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference')

  if (!reference) {
    return new Response('Missing reference parameter', { status: 400 })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      console.log("🔄 SSE connection started for reference:", reference)

      // Send initial connection message
      const data = `data: ${JSON.stringify({ status: "connected", reference })}\n\n`
      controller.enqueue(encoder.encode(data))

      // In production, this would:
      // 1. Connect to a real-time database or message queue
      // 2. Listen for webhook events from PayHero
      // 3. Send updates when payment status changes
      
      // For demo, simulate webhook events
      const simulateWebhook = () => {
        const isSuccess = Math.random() > 0.3
        const status = isSuccess ? "completed" : "failed"
        const message = isSuccess ? "Payment completed successfully!" : "Payment failed"
        
        const updateData = {
          status,
          message,
          reference,
          timestamp: new Date().toISOString()
        }
        
        const data = `data: ${JSON.stringify(updateData)}\n\n`
        controller.enqueue(encoder.encode(data))
        
        console.log("📡 SSE update sent:", updateData)
        
        // Close connection after sending update
        setTimeout(() => {
          controller.close()
        }, 1000)
      }

      // Simulate webhook after 3-8 seconds (realistic M-Pesa timing)
      const delay = Math.random() * 5000 + 3000 // 3-8 seconds
      setTimeout(simulateWebhook, delay)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
} 