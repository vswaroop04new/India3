import React, { useEffect, useState } from 'react'

import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = (props) => {
  const address = localStorage.getItem('address')

  let auth
  if (address == null) {
    auth = { token: false }
  } else {
    auth = { token: true }
  }

  return auth.token ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoutes
