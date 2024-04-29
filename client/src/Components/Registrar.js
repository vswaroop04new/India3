import React, { useState, useEffect } from 'react'

import axios from 'axios'
import './Verifier.css'

function App2() {
  const [selectedValue, setSelectedValue] = useState('default')

  function handleChange(event) {
    setSelectedValue(event.target.value)
  }

  const [address, setAddress] = useState(0)
  const [loader, setLoader] = useState(false)

  const hideMessage = () => {
    setTimeout(() => {
      setLoader(false)
    }, 10000)
  }
  useEffect(() => {
    hideMessage()
  }, [loader])

  const [balance, setBalance] = useState(0)
  // uint256 adhaarNum, uint256 pin,string memory name, string memory city, string memory dob
  const [adhaarNum, setAdhaarNum] = useState(0)
  const [pin, setPin] = useState(0)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [dob, setdob] = useState('')

  useEffect(() => {
    setAddress(localStorage.getItem('address'))
  }, [])

  async function addtodb() {
    try {
      setLoader(true)
      await axios
        .post(`${process.env.REACT_APP_SERVER_URL}/admin/upload`, {
          address,
          adhaarNum,
          pin,
          name,
          city,
          dob,
        })
        .then((response) => {
          // Handle success
          console.log(response);
          if (response.data.success) {
            setLoader(false);
            alert("Data added to Polybase Succesfully");
          } else {
            setLoader(false);
            alert(`Data not added to Polybase because ${response.data.error}`);
          }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
          setLoader(false);
          alert(`Data not added to Polybase Please Check Logs`);
        });
    } catch (error) {
      console.log(error)
    }
  }

  async function addtodb2() {
    try {
      setLoader(true)

      await axios
        .post(`${process.env.REACT_APP_SERVER_URL}/admin/upload2`, {
          address,
          adhaarNum,
          pin,
          name,
          city,
          dob,
        })
        .then((response) => {
          // Handle success
          console.log(response);
          if (response.data.success) {
            setLoader(false);
            alert("Data added to Polybase Succesfully");
          } else {
            setLoader(false);
            alert(`Data not added to Polybase because ${response.data.error}`);
          }
        })
        .catch((error) => {
          // Handle error
          console.error(error);
          setLoader(false);
          alert(`Data not added to Polybase Please Check Logs`);
        });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="verifier">
      <div class="col-4">
        <h2 class="loader--title">Registration Manager Dashboard</h2>
      </div>
      <article className="cta">
        <div className="cta__text-column">
          <h3 className="balance">Hi</h3>

          <h4> {address} </h4>
        </div>
      </article>

      <label> </label>

      <br />
      <div>
        {loader ? (
          <div class="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <>
            {' '}
            <select value={selectedValue} onChange={handleChange}>
              <option value="Verify Demographic Data">
                Choose an option to Add
              </option>
              <option value="Verify Demographic Data">
                Add Demographic Data{' '}
              </option>
              <option value="option2">Add Financial Income </option>
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
                                <h4>Enter the Demographic Deatils</h4>
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
                                      onChange={(e) =>
                                        setAdhaarNum(e.target.value)
                                      }
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
                                  <button class="btn mt-4" onClick={addtodb}>
                                    {' '}
                                    Add
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
            {selectedValue === 'option2' && (
              <div className="section">
                <div className="container">
                  <div className="row full-height justify-content-center">
                    <div className="col-12 text-center align-self-center py-5">
                      <div className="section pb-5 pt-5 pt-sm-2 text-center">
                        <div className="card-3d-wrap2 mx-auto">
                          <div className="card-3d-wrapper">
                            <div className="card-front2">
                              <div className="center-wrap">
                                <h4>Enter the Financial Deatils</h4>
                                <br />
                                <div className="insidecont section text-center">
                                  <div class="form-group">
                                    PAN
                                    <input
                                      type="email"
                                      name="logemail"
                                      class="form-style"
                                      placeholder="PAN number"
                                      id="logemail"
                                      autocomplete="off"
                                      onChange={(e) =>
                                        setAdhaarNum(e.target.value)
                                      }
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
                                    ITR
                                    <input
                                      onChange={(e) => setCity(e.target.value)}
                                      name="logpass"
                                      class="form-style"
                                      placeholder="Income Tax Returns"
                                      id="logpass"
                                      autocomplete="off"
                                    />
                                    <i class="input-icon uil uil-lock-alt"></i>
                                  </div>
                                  <div class="form-group mt-2">
                                    FY
                                    <input
                                      onChange={(e) => setdob(e.target.value)}
                                      name="logpass"
                                      class="form-style"
                                      placeholder="Financial Year"
                                      id="logpass"
                                      autocomplete="off"
                                    />
                                    <i class="input-icon uil uil-lock-alt"></i>
                                  </div>
                                  <br />
                                  <button class="btn mt-4" onClick={addtodb2}>
                                    {' '}
                                    Add
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
          </>
        )}
      </div>
    </div>
  )
}

export default App2
