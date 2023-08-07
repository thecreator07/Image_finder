import React, { useState, useEffect, useRef } from 'react';
import axios from "axios"

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Picture from './Tropical island-pana.png';
import { MdKeyboardVoice, MdOutlineSettingsVoice } from "react-icons/md"


function App() {
  const [value, setvalue] = useState("")
  const [result, setresult] = useState([])
  const [dark, setmode] = useState(false)
  const [voicon, setvoicon] = useState(true)
  const [LoadedImages, setLoadedImages] = useState([])
  const [imageSize, setImageSize] = useState('regular');


  const { transcript, resetTranscript } = useSpeechRecognition();


  //  Speech Recognition 
  useEffect(() => {
  
    if (transcript !== '') {
      setvalue(transcript);
      resetTranscript();
    }
  }, [transcript]);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };


  const handlevoicon = () => {
    setvoicon(!voicon)
  }

  console.log(result);
  console.log(transcript)
  // const sizeo = { ...size }
  async function fetchImage() {
    try {
      const responce = await axios.get(`https://api.unsplash.com/search/photos?client_id=i5fAvkcOnvDacNiU8A2bQqaLBmh8ddfW-mwVurgT2lQ&query=${value}`)
      console.log(responce)   //axios give json in responce
      setresult(responce.data.results)
     
    }
    catch (error) {
      console.log(error)
    }
  }

  // basic promise
  // const fetchImage = () => {
  //   fetch(`https://api.unsplash.com/search/photos?client_id=i5fAvkcOnvDacNiU8A2bQqaLBmh8ddfW-mwVurgT2lQ&query=${value}`)
  //     .then(responce => responce.json())
  //     .then(data => setresult(data.results)).catch((err) => {
  //       console.log(err)
  //     }).finally(() => {
  //       console.log("data fetched")
  //     })
  // }



  const handleKeypress = e => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      fetchImage();
    }
  };

  const paralaxref = useRef();

  const [paralaxPosition, setParalaxPosition] = useState(0);
  console.log(paralaxPosition);
  useEffect(() => {
    window.onscroll = () => {
      setParalaxPosition(paralaxref.current?.clientHeight ? window.pageYOffset / paralaxref.current.clientHeight * -window.innerHeight : 0)
      //(returns 0-1 for percent scrolled)*(multiplier for image height)
    }
  }, [])


  const handleSearch = (e) => {
    e.preventDefault();

    // Perform search logic with the value state
    console.log('Searching for:', value);
    setvalue("")
  };
  const handleImageLoad = (id) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, id]);
  };

  const handleDownload = async (url, filename) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data]);
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageSizeChange = (e) => {
    setImageSize(e.target.value);
  };

  return (
    <div className={`m-0  ${dark ? "bg-slate-900" : "bg-zinc-900 "}`}>
      <label className="switch scale-50">
        <input type="checkbox" onChange={() => setmode(!dark)} />
        <span className="slider round"></span>
      </label>
      <form className=' md:m-12 m-2  p-3 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center md:border' onSubmit={handleSearch}>
        <span className={`font-bold hidden md:block text-slate-300`}>IMAGES</span>
        <div className='w-full md:w-3/5 gap-2 pb-2 flex items-center relative'>
          <input className='bg-gray-100 rounded-md p-2 w-full hover:outline-1 hover:outline-red-300 shadow-md border-none text-neutral-700 font-semibold' type="text" placeholder='IMAGES' value={value} onChange={(e) => setvalue(e.target.value)} onKeyDown={handleKeypress} />
          <div className='p-2 absolute top-[5%] right-3' onClick={handlevoicon}>

            {
              voicon ? <MdKeyboardVoice size={25} onClick={startListening} /> : <MdOutlineSettingsVoice size={25} onClick={stopListening} />
            }
          </div>
        </div>
        <div className='flex gap-2 md:gap-10 md:w-auto  w-full items-center'>

          <select value={imageSize} onChange={handleImageSizeChange} className="bg-gray-100 rounded-md p-2 hover:outline-1 hover:outline-red-300 shadow-md border-none text-neutral-700 font-semibold">
            <option value="raw">Raw</option>
            <option value="full">Full</option>
            <option value="regular">Regular</option>
            <option value="small">Small</option>
            <option value="thumb">Thumb</option>
          </select>
          <button className='font-bold  bg-teal-500 backdrop-blur-xl px-5 py-2 rounded-md w-full md:w-auto  hover:shadow-md hover:shadow-green-700 ' onClick={() => fetchImage()}>Search</button>
        </div>
      </form>

      <div className={`bg-cover pt-10 ${result == 0 ? "" : "hidden"}`} ref={paralaxref}>

        <img className={` relative left-[${-0.2 * Math.trunc(paralaxPosition)}]`} src={Picture} alt=" "></img>
      </div>

      <div className='images grid md:grid-cols-2 justify-evenly '>
        {
          result.map((item) => {
            return <div key={item.id} className='flex flex-col justify-center items-center m-2'>
              <span className='image_span' href={item.links.download}>
                <img className={`${LoadedImages.includes(item.id) ? '' : "blur-md"} image`} key={item.id} src={item.urls[imageSize]}
                  onLoad={() => handleImageLoad(item.id)}
                ></img>
                <div  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(item.urls[imageSize], `${item.id}.jpg`);
                  }} className='absolute download text-lg cursor-pointer w-full bg-transparent backdrop-blur-sm text-center  text-yellow-50 bottom-10 rounded-b-lg '>
                  download
                </div>
              </span>
              <p className={`text-base font-medium text-center cursor-pointer imagesfont ${dark ? "text-slate-200" : "text-slate-300 "}`}>{item.alt_description} </p>
            </div>

          })
        }

      </div>
    </div>
  )
}

export default App
