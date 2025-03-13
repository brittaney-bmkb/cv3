import { useEffect, useState } from 'react'
import './App.css'

import '@esri/calcite-components/dist/calcite/calcite.css';

import { AppProvider } from './contexts/AppContext'

// import PanelMobile from './components/Panel/Panel'

import Layout from './Layout'

//Calcite Components
import "@esri/calcite-components/dist/components/calcite-shell";
import "@esri/calcite-components/dist/components/calcite-shell-panel";
import "@esri/calcite-components/dist/components/calcite-panel";
import "@esri/calcite-components/dist/components/calcite-block";
import "@esri/calcite-components/dist/components/calcite-block-section";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@esri/calcite-components/dist/components/calcite-action-group";
import "@esri/calcite-components/dist/components/calcite-action-bar";
import "@esri/calcite-components/dist/components/calcite-action";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-list";
import "@esri/calcite-components/dist/components/calcite-list-item-group";
import "@esri/calcite-components/dist/components/calcite-list-item";
import "@esri/calcite-components/dist/components/calcite-link";

function App() {

  const [mapVisible, setMapVisible] = useState(true)
  const [screenWidth, setScreenWidth] = useState(true)
  const [componentHeight, setComponentHeight] = useState(window.innerHeight);

  function handleClick(){
    setMapVisible(!mapVisible)
  }

  useEffect(() => {
    const handleResize = () => {
        ////console.log("Resize event triggered");
        const width = window.innerWidth
        ////console.log("window width: ", width)
        setScreenWidth(width)
        setComponentHeight(window.innerHeight);
    }

    // const resizeOps = () => {
    //   //console.log("Setting inner window height: ", window.innerHeight)
    //   document.documentElement.style.setProperty("--doc-height", `${window.innerHeight}px`);
    // };

    window.addEventListener('resize', handleResize);
    //window.addEventListener("resize", resizeOps);

    handleResize();
    //resizeOps();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      //window.removeEventListener('resize', resizeOps);
    };

    //window.innerHeight
  }, [window.innerWidth, window.innerWidth]);

  return (
    <AppProvider>
      <Layout/>
    </AppProvider>
  )
}

export default App
