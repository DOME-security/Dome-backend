# Next.js environment exfiltration (inert)

`.env` stores a base64 URL on the reserved `.invalid` domain, and an API route posts the whole
`process.env` to it. Each half alone is a review; together they block.
