import React, { useState } from 'react'
import { ethers } from 'ethers'
import { abi2, address2 } from './Govt-Constants'

export default function Government() {
  const [RM, setRM] = useState('')
  const [checkRM, setcheckRM] = useState('')

  async function addRm() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Addrm = new ethers.Contract(address2, abi2, signer)
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    const account = accounts[0]
    console.log(account)
    if (RM === '') {
      alert('Enter Address')
    } else {
      const tx = await Addrm.addRegMan(RM)
      console.log(tx)
      const receipt = await tx.wait(1)
      console.log(receipt)
    }
  }
  async function checkrm() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Addrm = new ethers.Contract(address2, abi2, signer)
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    const account = accounts[0]
    console.log(account)
    if (checkRM === '') {
      alert('Enter Address')
    } else {
      var tx = false
      try {
        tx = await Addrm.getManagerStatus(checkRM)
        console.log(tx)
      } catch (err) {
        console.log(err)
        tx = false
      }

      if (tx) {
        alert('Yes this address belongs to registration amanager')
      } else {
        alert('No this address does not belongs to registration amanager')
      }
    }
  }
  return (
    <div>
      <h1>Government</h1>
      <h2>Add RM</h2>
      <label>Enter Address</label>
      <input type="text" onChange={(e) => setRM(e.target.value)} />
      <button onClick={addRm}> Add RM </button>
      <h2>Check RM</h2>
      <label>Enter Address</label>
      <input type="text" onChange={(e) => setcheckRM(e.target.value)} />
      <button onClick={checkrm}> Check RM </button>
    </div>
  )
}
