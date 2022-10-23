import format from "date-fns/format";

const arweave = window.Arweave.init({
  host: 'arweave.net',
  protocolo: 'https',
  port: 443
})

// creates warp to work with smart contracts
//const warp = window.warp.WarpWebFactory.memCached(arweave)

export async function pageHistory() {
  const code = document.head.querySelector('meta[name="code"]').content
  const owner = document.head.querySelector('meta[name="author"]').content

  const result = await arweave.api.post('graphql', {
    // historyQuery is function to build our query text
    query: historyQuery(owner, code)
  })

  return formatData(result.data)
}

function historyQuery(owner, code) {
  return `
query {
  transactions(
    first: 100, 
    owners: ["${owner}"], 
    tags: [
      {name: "Content-Type", values: ["application/json"]},
      {name: "App-Name", values: ["PermaPages"]},
      {name: "Page-Code", values: ["${code}"]}
    ]
  ) {
    edges {
      node {
        id
        tags {
          name 
          value
        }
      }
    }
  }
}
  `
}

function formatData({ data }) {

  return data.transactions.edges.map(
    ({ node }) => {
      function getTag(tagName) {
        return node.tags.find(tag => tag.name === tagName)?.value
      }

      return {
        webpage: getTag('Webpage'),
        status: getTag('Status') || 'webpage published!',
        timestamp: format(
          new Date(
            getTag('Timestamp')
          ),
          'M/dd/yyyy h:mm a'
        )
      }
    }
  )
}