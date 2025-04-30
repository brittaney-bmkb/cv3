import { useEffect, useRef } from "react";

import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Extent from "@arcgis/core/geometry/Extent";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import Color from "@arcgis/core/Color";
import Point from "@arcgis/core/geometry/Point";
import UseAppContext from "../../contexts/AppContext";

const DEFAULT_DPI = 96;

const PrintAreaBox = ({ mapView, selectedLayout, active, setBoxExtent, vm }) => {
  const printGraphicsLayer = useRef(null);
  const boxGraphic = useRef(null);
  const moving = useRef(false);

  const { arcgisMapRef } = UseAppContext()

  useEffect(() => {
    if (!mapView) return;

    if (!printGraphicsLayer.current) {
      printGraphicsLayer.current = new GraphicsLayer({ id: "printGraphicsLayer" });
      mapView.map.add(printGraphicsLayer.current);
    }

    const mapElement = arcgisMapRef?.current;

    if (active && mapElement) {
      console.log("New layout: ", selectedLayout)
      drawPrintAreaBox(selectedLayout);

      const listener = (event) => {
        drawPrintAreaBox(selectedLayout);
      };

      mapElement.addEventListener("arcgisViewChange", listener);

      return () => {
        mapElement.removeEventListener("arcgisViewChange", listener);
        clearGraphics();
      };
    } else {
      clearGraphics();
    }
  }, [mapView, selectedLayout, active, arcgisMapRef.current]);

  const clearGraphics = () => {
    if (printGraphicsLayer.current) {
      printGraphicsLayer.current.removeAll();
    }
  }

  const drawPrintAreaBox = async (layoutName) => {
    if (!mapView || !printGraphicsLayer.current) return;
  
    printGraphicsLayer.current.removeAll();
  
    const center = mapView.extent.center;
    const screenCenter = mapView.toScreen(center);
  
    // // Get layout template size in points (1 inch = 72 points)
    // let widthPts = 612; // 8.5in * 72
    // let heightPts = 792; // 11in * 72

    let width = 21.59; // default A4 in cm
    let height = 27.94;
    let units = "CENTIMETER";
  
    // Try to get actual layout size from template
    console.log("looking for layout: ", layoutName)
    const selectedTemplate = vm?.printServiceTemplates?.items.find((t ) =>{
      console.log("layouts: ", t.layout)
      return  t.layout === layoutName
    }
      
    );

    console.log("found template: ", selectedTemplate)
  
    if (selectedTemplate?.layoutTemplateInfo?.pageSize && selectedTemplate.layoutTemplateInfo.pageUnits) {
      width = selectedTemplate.layoutTemplateInfo.pageSize[0];
      height = selectedTemplate.layoutTemplateInfo.pageSize[1];
      units = selectedTemplate.layoutTemplateInfo.pageUnits;
    }

    // Convert to screen units (assuming 96 DPI)
    const dpi = 96;
    const convertToInches = (value, unit) => {
      switch (unit.toUpperCase()) {
        case "CENTIMETER": return value / 2.54;
        case "MILLIMETER": return value / 25.4;
        case "POINT": return value / 72;
        case "INCH":
        default: return value;
      }
    };

    const widthInches = convertToInches(width, units);
    const heightInches = convertToInches(height, units);

    const widthPts = widthInches * 72;
    const heightPts = heightInches * 72;

    const adjustWidth = 0;
    const adjustHeight = -10;
    const divisor = 2.75; // taken from 3.x code — preserves scaling
    
    const screenUL = {
      x: screenCenter.x - (widthPts / divisor) + adjustWidth,
      y: screenCenter.y - (heightPts / divisor) + adjustHeight
    };
  
    const screenLR = {
      x: screenCenter.x + (widthPts / divisor) + adjustWidth,
      y: screenCenter.y + (heightPts / divisor) + adjustHeight
    };
  
    const mapUL = mapView.toMap(screenUL);
    const mapLR = mapView.toMap(screenLR);
  
    const extent = new Extent({
      xmin: mapUL.x,
      xmax: mapLR.x,
      ymin: mapLR.y,
      ymax: mapUL.y,
      spatialReference: mapView.spatialReference
    });
  
    const box = new Graphic({
      geometry: extent,
      symbol: new SimpleFillSymbol({
        color: [255, 0, 128, 0.1],
        outline: new SimpleLineSymbol({
          color: [255, 0, 128, 0.7],
          width: 2
        })
      })
    });
  
    printGraphicsLayer.current.add(box);
    boxGraphic.current = box;
  
    if (setBoxExtent) {
      setBoxExtent(extent);
    }
  
    setupMoveHandler();
  };
  

  const setupMoveHandler = () => {
    if (!mapView || !boxGraphic.current) return;

    mapView.on("drag", (event) => {
      if (!moving.current) return;

      event.stopPropagation();

      const start = mapView.toMap({ x: event.origin.x, y: event.origin.y });
      const end = mapView.toMap({ x: event.x, y: event.y });

      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const extent = boxGraphic.current.geometry;

      const movedExtent = new Extent({
        xmin: extent.xmin + dx,
        xmax: extent.xmax + dx,
        ymin: extent.ymin + dy,
        ymax: extent.ymax + dy,
        spatialReference: extent.spatialReference
      });

      boxGraphic.current.geometry = movedExtent;

      if (setBoxExtent) {
        setBoxExtent(movedExtent);
      }
    });

    mapView.on("drag-start", (event) => {
      if (event.button !== 0) return; // Only left click

      // Detect if clicked inside the box
      mapView.hitTest(event).then((response) => {
        if (response.results.some(r => r.graphic === boxGraphic.current)) {
          moving.current = true;
        }
      });
    });

    mapView.on("drag-end", () => {
      moving.current = false;
    });
  }

  return null; // Invisible component
}

export default PrintAreaBox;
