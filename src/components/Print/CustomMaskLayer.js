// CustomMaskLayer.js
import BaseLayerView2D from "@arcgis/core/views/2d/layers/BaseLayerView2D.js";
import Layer from "@arcgis/core/layers/Layer";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import Handles from "@arcgis/core/core/Handles";
import { watch } from "@arcgis/core/core/reactiveUtils";
import Polygon from "@arcgis/core/geometry/Polygon";


import * as projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

const CustomLayerView2D = BaseLayerView2D.createSubclass({
  constructor: function () {
    this.tileContexts = new Map();
    this.watchHandles = new Handles();
    this.needsImageUpdate = false;
  },

  attach: function () {
    const layerView = this;

    const run = async () => {
        console.log("projecting geometry")
        const sr = layerView.layer.tileInfo.spatialReference;
    
        if (!this.layer.geometry) return;
    
        if (!projectOperator.isLoaded()) {
          await projectOperator.load();
        }
    
        const projected = projectOperator.execute(this.layer.geometry, sr);
    
        if (projected) {
          layerView.projectedGeometry = projected;
          layerView.needsImageUpdate = true;
          layerView.requestRender();
        }
      };
    
      run();
  },

  drawGeometry: function (ctx, bounds) {
    console.log("drawGeometry called, bounds:", bounds);
    const width = ctx.canvas.width;
  const height = ctx.canvas.height;

    ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "source-over";

    if (!this.projectedGeometry) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    const c = this.layer.color;
    // ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 1)`;
    // ctx.fillRect(0, 0, width, height);

    const unmaskTerm = 3 / this.layer.distance;
    ctx.globalCompositeOperation = "destination-out";

    const rings = this.projectedGeometry.type === "extent"
      ? Polygon.fromExtent(this.projectedGeometry).rings
      : this.projectedGeometry.rings || this.projectedGeometry.paths;

    const transformed = rings.map((ring) => ring.map(([x, y]) => [
      Math.round((width * (x - bounds[0])) / (bounds[2] - bounds[0])),
      Math.round(height * (1 - (y - bounds[1]) / (bounds[3] - bounds[1])))
    ]));

    ctx.lineJoin = "round";

    for (let r = 1; r <= this.layer.distance; ++r) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${unmaskTerm})`;
      ctx.lineWidth = this.layer.distance + 1 - r;

      transformed.forEach((ring) => {
        ctx.beginPath();
        ctx.moveTo(ring[0][0], ring[0][1]);
        for (let j = 1; j < ring.length; ++j) ctx.lineTo(ring[j][0], ring[j][1]);
        if (this.projectedGeometry.type !== "polyline") ctx.closePath();
        ctx.stroke();
      });
    }

    if (this.projectedGeometry.type !== "polyline") {
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      transformed.forEach((ring) => {
        ctx.beginPath();
        ctx.moveTo(ring[0][0], ring[0][1]);
        for (let j = 1; j < ring.length; ++j) ctx.lineTo(ring[j][0], ring[j][1]);
        ctx.closePath();
        ctx.fill();
      });
    }
  },

  manageTileImages: function () {
    const tileIdSet = new Set();

    for (const tile of this.tiles) {
      tileIdSet.add(tile.id);
      let ctx = this.tileContexts.get(tile.id);

      if (!ctx) {
        const canvas = document.createElement("canvas");
        canvas.width = this.layer.tileInfo.size[0];
        canvas.height = this.layer.tileInfo.size[1];
        ctx = canvas.getContext("2d");
        this.tileContexts.set(tile.id, ctx);
      }

      this.drawGeometry(ctx, tile.bounds);
    }

    for (const [id] of this.tileContexts) {
      if (!tileIdSet.has(id)) {
        this.tileContexts.delete(id);
      }
    }

    this.needsImageUpdate = false;
  },

  render: function (renderParameters) {
    console.log("Custom layer render called");
    this.manageTileImages();

    const { size, pixelRatio, rotation } = renderParameters.state;
    const [width, height] = size;
    const context = renderParameters.context;
    const coords = [0, 0];
    const tileSize = this.layer.tileInfo.size[0];

    context.clearRect(0, 0, width * pixelRatio, height * pixelRatio);

    if (rotation !== 0) {
      context.translate(width * pixelRatio * 0.5, height * pixelRatio * 0.5);
      context.rotate((rotation * Math.PI) / 180);
      context.translate(-width * pixelRatio * 0.5, -height * pixelRatio * 0.5);
    }

    for (const tile of this.tiles) {
      const ctx = this.tileContexts.get(tile.id);
      const screenScale = (tile.resolution / renderParameters.state.resolution) * pixelRatio;
      renderParameters.state.toScreenNoRotation(coords, tile.coords);
      context.drawImage(ctx.canvas, coords[0], coords[1], tileSize * screenScale, tileSize * screenScale);
    }
  },

  detach: function () {
    this.watchHandles.removeAll();
  },

  tilesChanged: function () {}
});

const CustomMaskLayer = Layer.createSubclass({

    
  
    constructor: function (params) {
        this.geometry = params?.geometry ?? null;
        this.distance = params?.distance ?? 25;
        this.color = params?.color ?? [0, 0, 0, 0.8];
        this._spatialReference = params?.spatialReference;
    },

    get tileInfo() {
        return TileInfo.create({
          size: 512,
          spatialReference: this._spatialReference || { wkid: 3857 }
        });
      },

  createLayerView: function (view) {
    console.log("customeMask Layer Called")
    if (view.type === "2d") {
      return new CustomLayerView2D({
        view,
        layer: this
      });
    }
  },

  properties: {
    geometry: {},
    distance: {},
    color: {}
  }
});

export default CustomMaskLayer;