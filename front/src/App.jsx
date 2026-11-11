import { useState } from "react"

export default function App() {

  const [contador, clique] = useState(0)

  return (
  <>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h2> olha um contador ai</h2>
    <button onClick={() => clique(contador + 1)}>
      Olha um botão ai</button>
    <h2>Olha um contador ai: {contador}</h2>
    </body>
    </html>
  </>
  )
}
