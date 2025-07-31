"use client"

import { FormEvent, Fragment, useState } from 'react'
import Image from 'next/image'
import { addUserEmailToProduct } from '@/lib/actions'
// import { addUserEmailToProduct } from '@/lib/actions'

interface Props {
  productId: string
}

const Modal = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await addUserEmailToProduct(productId, email);

    setIsSubmitting(false)
    setEmail('')
    closeModal()
  }

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button type="button" className="px-5 py-3 text-white text-base font-semibold border border-secondary bg-black rounded-lg mt-8 hover:bg-opacity-80 transition" onClick={openModal}>
        Track
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.1)] bg-opacity-30 z-50 transition-opacity duration-300 ease-out">
          {/* Modal container */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              {/* Modal content */}
              <div className={`
                transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all
                ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
                duration-300 ease-out
                w-full max-w-md
              `}>
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="p-3 border border-gray-200 rounded-10">
                      <Image 
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        width={28}
                        height={28}
                      />
                    </div>

                    <Image 
                      src="/assets/icons/x-close.svg"
                      alt="close"
                      width={24}
                      height={24}
                      className="cursor-pointer"
                      onClick={closeModal}
                    />
                  </div>

                  <h4 className="text-secondary text-lg leading-6 font-semibold mt-4">
                    Stay updated with product pricing alerts right in your inbox!
                  </h4>

                  <p className="text-sm text-gray-600 mt-2">
                    Never miss a bargain again with our timely alerts!
                  </p>
                </div>

                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="px-5 py-3 mt-3 flex items-center gap-2 border border-gray-300 rounded-[27px]">
                    <Image 
                      src="/assets/icons/mail.svg"
                      alt='mail'
                      width={18}
                      height={18}
                    />

                    <input 
                      required
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className='flex-1 pl-1 text-gray-500 text-base focus:outline-none rounded-[27px] shadow-sm'
                    />
                  </div>

                  <button type="submit"
                    className="px-5 py-3 text-red-500 text-base font-semibold border border-secondary bg-secondary rounded-lg mt-8 hover:bg-opacity-80 transition"
                  >
                    {isSubmitting ? 'Submitting...' : 'Track'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Modal