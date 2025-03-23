'use server'

import { queryLinear } from "@/lib/linear"

export async function LinearTest() {
  try {
    const data = await queryLinear(`
      query {
        viewer {
          id
          name
          email
          organization {
            id
            name
          }
        }
      }
    `)

    return (
      <div className="p-4 space-y-4">
        <div className="bg-card rounded-lg p-4">
          <h3 className="font-medium mb-2">Connection Status</h3>
          <p className="text-sm text-green-500">✓ Successfully connected to Linear API</p>
        </div>
        <div className="bg-card rounded-lg p-4">
          <h3 className="font-medium mb-2">Account Details</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg space-y-4">
        <div>
          <h3 className="font-medium mb-2">Connection Error</h3>
          <p className="text-sm">Failed to connect to Linear API: {errorMessage}</p>
        </div>
        <div className="text-sm space-y-2">
          <p className="font-medium">Troubleshooting steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Verify your LINEAR_API_KEY is set in your environment variables</li>
            <li>Ensure the API key starts with &apos;lin_&apos;</li>
            <li>Check if the API key has the necessary permissions</li>
            <li>Try generating a new API key in Linear settings</li>
          </ol>
        </div>
      </div>
    )
  }
}

