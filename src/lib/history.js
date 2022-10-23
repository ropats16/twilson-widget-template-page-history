import format from "date-fns/format";

const arweave = window.Arweave.init({
  host: 'arweave.net',
  protocolo: 'https',
  port: 443
})

// creates warp to work with smart contracts
const warp = window.warp.WarpWebFactory.memCached(arweave)

export async function pageHistory(txId) {
  const { owner, title } = getTxInfo(txId)
  const result = await arweave.api.post('graphql', {
    // historyQuery is function to build our query text
    query: historyQuery(owner, title)
  })

  return formatData(result.data)
}

function historyQuery(owner, title) {
  return `
query {
  transactions(
    first: 100, 
    owners: ["${owner}"], 
    tags: [
      {name: "Content-Type", values: ["application/json"]},
      {name: "App-Name", values: ["PermaPages"]},
      {name: "Page-Title", values: ["${title}"]}
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
  return data.transaction.edges.map(
    ({ node }) => {
      function getTag(name) {
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

async function getTxInfo(owner, title) {
  const { data } = await arweave.api.post('graphql', {
    // historyQuery is function to build our query text
    query: `
    query {
      transaction(id:"${txId}") {
        owner {
          address
        }
        tags {
          name
          value
        }
      }
    }
    `
  })

  return {
    owner: data.data.transaction.owner.address,
    title: data.data.transaction.find(t => t.name === 'Page-Title')?.value,
  }
}