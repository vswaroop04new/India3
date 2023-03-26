import React from 'react'
import './Login.css'
import { useState } from 'react'
import { ethers } from 'ethers'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import { address2, abi2 } from './Govt-Constants.js'

export default function Login() {
  const navigate = useNavigate()
  const [metamask, setmetamask] = useState(false)
  const [addressmm, setaddressmm] = useState('')
  var [tx, settx] = useState(false)

  async function connect() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('metamask')
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      setmetamask(true)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      console.log(await signer.getAddress())
      setaddressmm(await signer.getAddress())
      const address = await signer.getAddress()
      try {
        const Govt = new ethers.Contract(address2, abi2, signer)
        tx = await Govt.getManagerStatus(address)
        console.log(tx)
      } catch (err) {
        console.log(err)
        settx(false)
      }
      if (tx) {
        localStorage.setItem('address', address)
        navigate('/registrar')
      } else {
        navigate('/verifier')
      }
    } else alert('Install metamask')
  }
  return (
    <div>
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Log In </span>

                  <span>Welcome</span>
                </h6>
                <input
                  className="checkbox"
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                />
                <label for="reg-log"></label>
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <div className="card-front">
                      <div className="center-wrap">
                        <div className="insidecont section text-center">
                          <button onClick={connect} className="metamask">
                            Connect With Metamask &nbsp; {'   '}
                            <Icon icon="logos:metamask-icon" />
                          </button>{' '}
                        </div>
                      </div>
                    </div>
                    <div className="card-back">
                      <div className="center-wrap">
                        <div className="cblan section text-center">
                          <h4 className="mb-4 pb-3">Welcome To India3</h4>
                          &nbsp;
                          <p>
                            India3 is a decentralized platform where we can
                            verify the demographic data of a person. This system
                            uses decentralized technology such as blockchain to
                            ensure the accuracy and validity of demographic
                            data, such as name, age, gender, and location
                          </p>
                          &nbsp;
                          <p className="">
                            Please Login with your Metamask Account to continue
                          </p>
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
    </div>
  )
}
