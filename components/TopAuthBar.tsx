'use client'
import React, { useState } from 'react'

export default function TopAuthBar(){ 
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('idle')

  async function startOTP(){
    try{
      // frontend placeholder: call API to send OTP via server (Twilio/Firebase)
      const res = await fetch('/api/auth/send-otp', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({ phone })
      })
      if(res.ok) setStep('otp-sent')
      else throw new Error('failed to request otp')
    }catch(e){
      console.error(e)
      alert('Unable to send OTP. Check console.')
    }
  }

  async function verifyOTP(){
    try{
      const res = await fetch('/api/auth/verify-otp', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body: JSON.stringify({ phone, code })
      })
      if(res.ok){
        alert('Logged in (server session created)')
        setStep('done')
      } else {
        const txt = await res.text()
        alert('Verify failed: ' + txt)
      }
    }catch(e){
      console.error(e)
    }
  }

  return (
    <div style={{display:'flex',gap:8,alignItems:'center',padding:8,background:'#fff'}}>
      <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder='+91 9XXXXXXXXX' />
      <button onClick={startOTP}>Send OTP</button>
      {step === 'otp-sent' && (
        <>
          <input value={code} onChange={e=>setCode(e.target.value)} placeholder='Enter OTP' />
          <button onClick={verifyOTP}>Verify OTP</button>
        </>
      )}
    </div>
  )
}
