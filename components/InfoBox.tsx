import React from 'react'
import Link from 'next/link'

type InfoBoxProps = {
  heading: string
  backgroundColor?: string
  textColor?: string
  buttonInfo: {
    text: string
    link: string
    backgroundColor: string
  }
  children: React.ReactNode
}

const InfoBox = ({
  heading,
  backgroundColor = 'bg-gray-100',
  textColor = 'text-gray-800',
  buttonInfo,
  children,
}: InfoBoxProps) => {
  return (
    <div className={`${backgroundColor} ${textColor} p-6 rounded-lg shadow-md`}>
      <h2 className='text-2xl font-bold'>{heading}</h2>
      <p className='mt-2 mb-4'>{children}</p>
      <Link
        href={buttonInfo.link}
        className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2`}
      >
        {buttonInfo.text}
      </Link>
    </div>
  )
}

export default InfoBox
