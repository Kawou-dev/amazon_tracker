"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';
// import { scrapeAndStoreProduct } from '@/lib/actions';
import { FormEvent, useState } from 'react'


const isValidAmazoneLink = (url: string) => {
   try {     
     const parsedURL = new URL(url) ; 
    const hostname = parsedURL.hostname ;     
    if(
        hostname.includes('amazon.com') ||
        hostname.includes('amazon.') ||
        hostname.endsWith('amazon')
        )
        return true
   } catch (error) {
       alert(`Error while parsing url: ${error}`) ; 
    return false
   }
   return false
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazoneLink(searchPrompt) ; 
    if(!isValidLink) return ; 

    const product = scrapeAndStoreProduct(searchPrompt) ; 

    console.log(product)

    
  }

  return (
    <form 
      className="flex flex-wrap gap-4 mt-12" 
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="flex-1 min-w-[200px] w-full p-3 border border-gray-300 rounded-lg shadow-sm text-base text-gray-500 focus:outline-none"
      />

      <button 
        type="submit" 
        className="bg-gray-900 border border-gray-900 rounded-lg shadow-sm px-5 py-3 text-white text-base font-semibold hover:opacity-90 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40"
        disabled={searchPrompt === ''}
      >
        Search
        {/* {isLoading ? 'Searching...' : 'Search'} */}
      </button>
    </form>
  )
}

export default Searchbar