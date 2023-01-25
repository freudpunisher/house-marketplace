import {useState,useEffect,useRef} from 'react'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

import {getStorage,ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import {db} from '../firebase.config'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {v4 as uuidv4} from 'uuid'
import {useNavigate} from 'react-router-dom'
import Spinner from '../components/Spinner'
import {toast} from 'react-toastify'


function CreateListing() {
    const [geolocationEnabled, setGeolocationEnabled] = useState(true)
    const [loading,setLoading]=useState(false)
const [formData, setFormData] = useState({
    type:'rent',
    name:'',
    bedrooms:1,
    bathrooms:1,
    parking:false,
    furnished:false,
    address:'gte',
    offer:false,
    regularPrice:0,
    discountedPrice:0,
    images:{},

})

const {type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    }=formData
const auth =getAuth()
const navigate = useNavigate()
const isMounted = useRef(true)


useEffect(()=>{
    if(isMounted){
onAuthStateChanged(auth,(user) =>{
    if (user){
        setFormData({...formData,userRef:user.id})
    } else {
    navigate('/sign-in')
    }
} )
    }
    return ()=>{
        isMounted.current=false
    }
// eslint-disable-next-line react-hooks/exhaustive-deps

},[isMounted])

const onSubmit=async(e)=>{
    e.preventDefault()
    setLoading(true)
    if(discountedPrice>=regularPrice){
setLoading (false)
toast.error('discounted price needs to be less than regular price')
return
    }
    if(images > 6){
    setLoading(false)
    toast.error('Max 6 images')
    return
  }
const storeImage= async (image) => {
  return new Promise((resolve,reject)=>{
    const storage =getStorage()
    const fileName= `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
    const  storageRef = ref(storage,'images/'+fileName)
    const uploadTask = uploadBytesResumable(storageRef,image)


    uploadTask.on('state_changed', 
  (snapshot) => {
    
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject(error)
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      resolve( downloadURL);
    });
  }
);

  })
}
const imgUrls = await Promise.all(
  [...images].map((image)=>storeImage(image))
).catch(()=>{
  setLoading(false)
  toast.error('Images not uploaded')
})
const formDataCopy={
  ...formData,
  timestamp:serverTimestamp(),

}
delete formDataCopy.images
!formDataCopy.offer && delete formDataCopy.discountedPrice
const docRef = await addDoc(collection(db,'listings'),formDataCopy)
setLoading(false)
toast.success('Listing saved')
navigate(`/category/${formData.type}/${docRef.id}`)



  setLoading(false)
  }



const onMutate=(e)=>{
let boolean = null 
if(e.target.value ==='true'){
boolean =true
}
if(e.target.value ==='false'){
    boolean =false 

    }
if(e.target.files){
    setFormData((prevState)=>({
        ...prevState,
        images:e.target.files
    }))
}

if(!e.target.files){
    setFormData((prevState)=>({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value 
    }))
}




}

if(loading){
    return <Spinner/>
}


  return (
    <div className="profile">
        <header>
            <p className="pageHeader">Create a Listing</p>
        </header>
        <main>
            <form onSubmit={onSubmit}>
                <label className="formLabel">Sell/ Rent</label> 
                <div className="formButtons">
                    <button type='button' className={type === 'sale' ? 'formButtonActive' : 'formButton'} id='type' value='sale' onClick={onMutate}>sell</button>
                    <button type='button' className={type === 'rent' ? 'formButtonActive' : 'formButton'} id='type' value='rent' onClick={onMutate}>rent</button>
                </div>

                <label className="formLabel">Name</label> 
               <input 
               type="text" 
               className="formInputName" 
               id='name'
                value={name} 
               onChange={onMutate} 
               maxLength='32'
               minLength='10'
               required
               />




           

            <div className="formRooms flex">
                <div>
                    <label className="formLabel"> Bedrooms</label>
                    <input type="number" className="formInputSmall" id='bedrooms' value={bedrooms} onChange={onMutate} min='1' max='50' required/>
                </div>
                <div>
                    <label className="formLabel"> Bathrooms</label>
                    <input type="number" className="formInputSmall" id='bathrooms' value={bathrooms} onChange={onMutate} min='1' max='50' required/>
                </div>
            </div>
            <label className="formLabel">parking spot</label>
            <div className="formButtons">
                <button
                className={parking ? 'formButtonActive': 'formButton'}
                type='button'
                id = 'parking'
                value={true}
                onClick={onMutate}
                min='1'
                max='50'
                >yes</button>
                <button
                className={!parking && parking !== null ? 'formButtonActive': 'formButton'}
                type='button'
                id = 'parking'
                value={false}
                onClick={onMutate}
                min='1'
                max='50'
                >yes</button>
            </div>



            <label className="formLabel">furnished</label>
            <div className="formButtons">
                <button
                className={furnished ? 'formButtonActive': 'formButton'}
                type='button'
                id = 'furnished'
                value={true}
                onClick={onMutate}
               
                >yes</button>
                <button
                className={!furnished && furnished !== null ? 'formButtonActive': 'formButton'}
                type='button'
                id = 'parking'
                value={false}
                onClick={onMutate}
        
                >No</button>
            </div>
            <label className="formLabel">Adress</label>
            <input 
               type="text" 
               className="formInputName" 
               id='address'
                value={address} 
               onChange={onMutate} 
               maxLength='32'
               minLength='10'
               required
               />


<label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
          </div>
          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type='number'
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}
<label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Create Listing
          </button>
          </form>
        </main>
    </div>
  )
}

export default CreateListing