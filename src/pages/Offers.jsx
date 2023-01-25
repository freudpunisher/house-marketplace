import {useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection,getDocs,query,where,orderBy,limit,startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers() {
    const [listings,setListings]=useState(null)
    const [loading,setloading]=useState(true)
    const params=useParams()
    useEffect(()=>{
        const fetchListings =async () =>{
            try {
                const listingsRef = collection(db,'listings')

                const q = query(listingsRef,where('offer','==',true),orderBy('timestamp','desc'),limit(10))
                const querySnap= await getDocs(q)
                const listings = []

                querySnap.forEach((doc)=>{
                    console.log(doc.data())
                    return listings.push({
                        id:doc.id,
                        data:doc.data()
                    })
                })
                setListings(listings)
                setloading(false)

            } catch (error) {
                console.log(error)
            }
        }
        fetchListings()
    },[])
  return (
    <div className='category'>
        <header>
            <p className="pageHeader">
            Offers
            </p>
        </header>
        {loading ? <Spinner/> : listings && listings.length > 0 ? <>
        <main>
            <ul className="categoryListings">
                {listings.map((listing) =>(
                    <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
                ))}
            </ul>
        </main>
        </>: <p>there are no current offers</p> }
        </div>
  )
}

export default Offers