const LINEAR_API_URL = "https://api.linear.app/graphql"

export async function queryLinear<T = any>(query: string, variables = {}) {
  if (!process.env.LINEAR_API_KEY) {
    throw new Error("LINEAR_API_KEY environment variable is not set")
  }

  try {
    const res = await fetch(LINEAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.LINEAR_API_KEY,
      },
      body: JSON.stringify({
        query: query.trim(),
        variables,
      }),
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const json = await res.json()

    if (json.errors) {
      console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2))
      throw new Error(json.errors[0].message)
    }

    if (!json.data) {
      console.error("Invalid response:", JSON.stringify(json, null, 2))
      throw new Error("Invalid API response: no data returned")
    }

    return json.data as T
  } catch (error) {
    console.error("Linear API Error:", error)
    throw error
  }
}

