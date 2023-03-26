const address2 = '0x228cff58a93607d12afecc61e18353a17674f9ce'

const abi2 = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
    ],
    name: 'addRegMan',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'rm_check',
        type: 'address',
      },
    ],
    name: 'getManagerStatus',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

module.exports = { address2, abi2 }
