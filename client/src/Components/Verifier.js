import React, { useState, useEffect } from 'react'
import { abi, address } from '../Constant.js'
import { ethers } from 'ethers'
import axios from 'axios'
import './Verifier.css'

const host = 'http://localhost:3000'

function App2() {
  const [selectedValue, setSelectedValue] = useState('default')

  function handleChange(event) {
    setSelectedValue(event.target.value)
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const Uid = new ethers.Contract(address, abi, signer)

  const [amt, setAmt] = useState(0)
  const [reciept, setreciept] = useState(0)

  const [balance, setBalance] = useState(0)
  // uint256 adhaarNum, uint256 pin,string memory name, string memory city, string memory dob
  const [adhaarNum, setAdhaarNum] = useState(0)
  const [pin, setPin] = useState(0)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [dob, setdob] = useState('')

  async function addbalance() {
    // console.log(Uid);
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    const account = accounts[0]
    console.log(account)
    const tx = await Uid.addBalance({ value: ethers.utils.parseEther(amt) })
    console.log(tx)
    const receipt = await tx.wait(6)
    console.log(receipt)
    setreciept('1')
  }
  useEffect(() => {
    async function getbalance() {
      // console.log(Uid);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const account = accounts[0]
      console.log(account)
      // get account balance
      const tx = await Uid.getBalance(account)
      // convert into ether
      const etherBalance = ethers.utils.formatEther(tx.toString())
      console.log(etherBalance)
      setBalance(etherBalance)
    }
    getbalance()
  }, [reciept])

  async function verify() {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })

    const account = accounts[0]
    console.log(adhaarNum, pin, name, city, dob)
    const tx = await Uid.verify(adhaarNum, pin, name, city, dob)
    console.log(tx)
    const receipt = await tx.wait(1)
    console.log(receipt)
    const senderU = receipt.events[0].args.sender
    const sender = senderU.toLowerCase()
    console.log(sender)
    const Upin = receipt.events[0].args.Upin
    console.log(Upin)
    const hash = receipt.events[0].args.hash
    console.log(hash)

    console.log(sender)
    try {
      await axios
        .post('http://localhost:3000/admin/upload', {
          sender,
          adhaarNum,
          pin,
          name,
          city,
          dob,
        })
        .then((response) => {
          // Handle success
          console.log(response)
        })
        .catch((error) => {
          // Handle error
          console.error(error)
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="verifier">
      <div class="col-4">
        <div class="cell"></div>

        <h2 class="loader--title">Verifier Dashboard</h2>
      </div>
      <article className="cta">
        <div className="cta__text-column">
          <h3 className="balance">Balance</h3>
          <h4 className="current balance">{balance} ETH </h4>

          <input
            placeholder="Enter amount"
            type="text"
            onChange={(e) => setAmt(e.target.value)}
          />
          <br />
          <button onClick={addbalance} class="button-five">
            <i class="fas fa-plus"></i>
          </button>
          <h4 className="balance">Add Balance</h4>
        </div>
      </article>

      <label> </label>

      <br />
      <div>
        <select value={selectedValue} onChange={handleChange}>
          <option value="Verify Demographic Data">
            Choose an option to Verify
          </option>
          <option value="Verify Demographic Data">
            Verify Demographic Data{' '}
          </option>
          <option value="option2">Verify 2 </option>
        </select>
        {selectedValue === 'Verify Demographic Data' && (
          <div className="section">
            <div className="container">
              <div className="row full-height justify-content-center">
                <div className="col-12 text-center align-self-center py-5">
                  <div className="section pb-5 pt-5 pt-sm-2 text-center">
                    <div className="card-3d-wrap2 mx-auto">
                      <div className="card-3d-wrapper">
                        <div className="card-front2">
                          <div className="center-wrap">
                            <h4>Enter the Details to Verify</h4>
                            <br />
                            <div className="insidecont section text-center">
                              <div class="form-group">
                                UID
                                <input
                                  type="email"
                                  name="logemail"
                                  class="form-style"
                                  placeholder="Uid"
                                  id="logemail"
                                  autocomplete="off"
                                  onChange={(e) => setAdhaarNum(e.target.value)}
                                />
                                <i class="input-icon uil uil-at"></i>
                              </div>
                              <div class="form-group mt-2">
                                PIN
                                <input
                                  onChange={(e) => setPin(e.target.value)}
                                  name="logpass"
                                  class="form-style"
                                  placeholder="Pin"
                                  id="logpass"
                                  autocomplete="off"
                                />
                                <i class="input-icon uil uil-lock-alt"></i>
                              </div>
                              <div class="form-group mt-2">
                                Nam
                                <input
                                  onChange={(e) => setName(e.target.value)}
                                  name="logpass"
                                  class="form-style"
                                  placeholder="Name"
                                  id="logpass"
                                  autocomplete="off"
                                />
                                <i class="input-icon uil uil-lock-alt"></i>
                              </div>
                              <div class="form-group mt-2">
                                City
                                <input
                                  onChange={(e) => setCity(e.target.value)}
                                  name="logpass"
                                  class="form-style"
                                  placeholder="City"
                                  id="logpass"
                                  autocomplete="off"
                                />
                                <i class="input-icon uil uil-lock-alt"></i>
                              </div>
                              <div class="form-group mt-2">
                                Dob
                                <input
                                  onChange={(e) => setdob(e.target.value)}
                                  name="logpass"
                                  class="form-style"
                                  placeholder="Date of Birth"
                                  id="logpass"
                                  autocomplete="off"
                                />
                                <i class="input-icon uil uil-lock-alt"></i>
                              </div>
                              <br />
                              <button class="btn mt-4" onClick={verify}>
                                {' '}
                                Verify
                              </button>
                              <br />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedValue === 'option1' && <div>Option 1 selected</div>}
      </div>
    </div>
  )
}

export default App2
