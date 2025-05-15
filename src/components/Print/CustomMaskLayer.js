// CustomMaskLayer.js
import BaseLayerView2D from "@arcgis/core/views/2d/layers/BaseLayerView2D.js";
import Layer from "@arcgis/core/layers/Layer";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import Handles from "@arcgis/core/core/Handles";
import { watch } from "@arcgis/core/core/reactiveUtils";
import Polygon from "@arcgis/core/geometry/Polygon";
import GeographicTransformation from "@arcgis/core/geometry/operators/support/GeographicTransformation.js";
import GeographicTransformationStep from "@arcgis/core/geometry/operators/support/GeographicTransformationStep.js";
import Map from "@arcgis/core/Map.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

import * as projectOperator from "@arcgis/core/geometry/operators/projectOperator.js";

const CustomLayerView2D = BaseLayerView2D.createSubclass({
  constructor: function () {

    console.log("constructor called")
    // Maps from tile id to the image used by that tile.
    this.tileContexts = new window.Map();
    console.log("tileContexts: ", this.tileContexts)
    // The handles to the property watchers; we need to store them
    // so that we can unwatch the properties when the layer view
    // is detached.
    this.watchHandles = new Handles();

    // Set to true when the images in the tiles have become obsolete
    // and must be regenerated. This is triggered by a change of
    // layer.geometry, layer.color or layer.distance.
    this.needsImageUpdate = false;
  },

  attach: function () {

    console.log("attaching")
    const projectionPromise = projectOperator.load()
    const layerView = this;
    const layer = layerView.layer;

    const handler = ([ id, geometry, distance, color], [oldGeometry, oldDistance, oldColor]) => {
      console.log("handler is called")
      if (!layer.geometry) {
        layerView.projectedGeometry = null;
        layerView.needsImageUpdate = true;
        layerView.requestRender();
        return;
      }

      if (geometry !== oldGeometry) {

        // const 
        // const transformation = new GeographicTransformation({
        //   steps: new GeographicTransformationStep(layer.geometry.spatialReference, layer.tileInfo.spatialReference])
        // })
        projectionPromise.then(() => {
          layerView.projectedGeometry = projectOperator.execute(
                                                                layer.geometry,
                                                                layer.tileInfo.spatialReference,
                                                                //options.geographicTransformation= transformation
          )
          
          
          
          // projection.project(
          //   layer.geometry,
          //   layer.tileInfo.spatialReference,
          //   projection.getTransformation(layer.geometry.spatialReference, layer.tileInfo.spatialReference)
          // );
          layerView.needsImageUpdate = true;
          layerView.requestRender();
        });
      }
      else {
        layerView.needsImageUpdate = true;
        layerView.requestRender();
      }

    }

    // Make sure that the effect is applied automatically at load time.
    console.log("calling handler")
    handler([this.layer.id, this.layer.geometry, this.layer.distance, this.layer.color], [null, null, null]);

    // Update and reapply the effect every time that the `geometry`, `distance`
    // or `color` properties on the layer change.
    this.watchHandles.add([
      reactiveUtils.watch(
        () => [this.layer.id, this.layer.geometry, this.layer.distance, this.layer.color],
        handler
      )
    ])
  },

        // Called to regenerate a tile.
        drawGeometry: function (ctx, bounds) {
          ctx.globalCompositeOperation = "source-over";
          const width = ctx.canvas.width;
          const height = ctx.canvas.height;

          // No geometry; entire map is unmasked.
          if (!this.projectedGeometry) {
            ctx.clearRect(0, 0, width, height);
            return;
          }

          // We mask the entire map; we will "carve" the unmasked area using
          // an operation that subtracts opacity iteratively.
          const c = this.layer.color;
          ctx.fillStyle = "rgba(" + c[0] + ", " + c[1] + ", " + c[2] + ", 1)";
          ctx.fillRect(0, 0, width, height);

          // Every iteration reduces opacity by a constant term and each iteration acts
          // on a progressively smaller region.
          // The factor "3" is fairly arbitrary, but it works well with "destination-out".
          // Lower values would cause a visible discontinuity between the fully illuminated
          // area and the beginning of the shaded area.
          const unmaskTerm = 3 / this.layer.distance;
          ctx.globalCompositeOperation = "destination-out";

          if (
            this.projectedGeometry.type === "polygon" ||
            this.projectedGeometry.type === "polyline" ||
            this.projectedGeometry.type === "extent"
          ) {
            // Polygons, polylines and extents are carved using increasingly thinner lines
            // and a single fill operation at the end.

            // All geometry types are treated as rings.
            const rings =
              this.projectedGeometry.type === "extent"
                ? Polygon.fromExtent(this.projectedGeometry).rings
                : this.projectedGeometry.rings || this.projectedGeometry.paths;

            // Rings are transformed to tile coordinates.
            const transformed = rings.map((ring) => {
              return ring.map((coords) => {
                return [
                  Math.round((width * (coords[0] - bounds[0])) / (bounds[2] - bounds[0])),
                  Math.round(height * (1 - (coords[1] - bounds[1]) / (bounds[3] - bounds[1])))
                ];
              });
            });

            // The rings are drawn as increasingly thinner lines; this produces
            // a blurred edge around the unmasked area, so that transition from
            // unmasked to masked is gradual.
            ctx.lineJoin = "round";

            for (let r = 1; r <= this.layer.distance; ++r) {
              ctx.strokeStyle = "rgba(0, 0, 0, " + unmaskTerm + ")";
              ctx.lineWidth = this.layer.distance + 1 - r;

              for (let i = 0; i < transformed.length; ++i) {
                const ring = transformed[i];

                ctx.beginPath();
                ctx.moveTo(ring[0][0], ring[0][1]);

                for (let j = 1; j < ring.length; ++j) {
                  ctx.lineTo(ring[j][0], ring[j][1]);
                }

                // If it's not a polyline, meaning it's a polygon or an extent,
                // we close the path.
                this.projectedGeometry.type !== "polyline" && ctx.closePath();
                ctx.stroke();
              }
            }

            if (this.projectedGeometry.type !== "polyline") {
              // If it's not a polyline, meaning it's a polygon or an extent,
              // we carve the space occupied by the geometry using a fill
              // operation; this is what fully unmask the geometry.
              ctx.fillStyle = "rgba(0, 0, 0, 1)";

              for (let i = 0; i < transformed.length; ++i) {
                const ring = transformed[i];

                ctx.beginPath();
                ctx.moveTo(ring[0][0], ring[0][1]);

                for (let j = 1; j < ring.length; ++j) {
                  ctx.lineTo(ring[j][0], ring[j][1]);
                }

                ctx.closePath();
                ctx.fill();
              }
            }
          } else if (this.projectedGeometry.type === "point" || this.projectedGeometry.type === "multipoint") {
            // Points an multipoints are carved using increasingly smaller circles.

            // The "point" case is equivalent to a "multipoint" with a single point.
            const points =
              this.projectedGeometry.type === "multipoint"
                ? this.projectedGeometry.points
                : [[this.projectedGeometry.x, this.projectedGeometry.y]];

            // Points are transformed to tile coordinates.
            const transformed = points.map((coords) => {
              return [
                Math.round((width * (coords[0] - bounds[0])) / (bounds[2] - bounds[0])),
                Math.round(height * (1 - (coords[1] - bounds[1]) / (bounds[3] - bounds[1])))
              ];
            });

            // The points are drawn using increasingly smaller circles.
            for (let r = 1; r <= this.layer.distance; ++r) {
              const size = this.layer.distance + 1 - r;
              ctx.fillStyle = "rgba(0, 0, 0, " + unmaskTerm + ")";

              for (let i = 0; i < transformed.length; ++i) {
                const point = transformed[i];
                ctx.beginPath();
                ctx.arc(point[0], point[1], Math.round(size / 2), 0, 360);
                ctx.fill();
              }
            }
          }
        },

        // Creates the images for new tiles that don't have a texture yet, and destroys the images
        // of tiles that are not on screen anymore.
        manageTileImages: function () {
          const gl = this.context;

          const tileIdSet = new Set();

          // Create new images as needed.
          for (let i = 0; i < this.tiles.length; ++i) {
            const tile = this.tiles[i];
            tileIdSet.add(tile.id);

            let ctx = this.tileContexts.get(tile.id);

            if (ctx) {
              if (this.needsImageUpdate) {
                this.drawGeometry(ctx, tile.bounds);
              }
            } else {
              const canvas = document.createElement("canvas");
              canvas.width = this.layer.tileInfo.size[0];
              canvas.height = this.layer.tileInfo.size[1];
              ctx = canvas.getContext("2d");
              this.tileContexts.set(tile.id, ctx);
              this.drawGeometry(ctx, tile.bounds);
            }
          }

          // Destroys unneeded images.
          this.tileContexts.forEach((_, id) => {
            if (!tileIdSet.has(id)) {
              this.tileContexts.delete(id);
            }
          });

          this.needsImageUpdate = false;
        },

        // Example of a render implementation that draws tile boundaries.
        render: function (renderParameters) {
          this.manageTileImages();

          const tileSize = this.layer.tileInfo.size[0];
          const state = renderParameters.state;
          const pixelRatio = state.pixelRatio;
          const width = state.size[0];
          const height = state.size[1];
          const context = renderParameters.context;
          const coords = [0, 0];

          context.clearRect(0, 0, width * pixelRatio, height * pixelRatio);

          // Apply rotation for everything that will be applied to the canvas.
          if (state.rotation !== 0) {
            context.translate(width * pixelRatio * 0.5, height * pixelRatio * 0.5);
            context.rotate((state.rotation * Math.PI) / 180);
            context.translate(-width * pixelRatio * 0.5, -height * pixelRatio * 0.5);
          }

          // Set the style for all the text.
          context.globalAlpha = this.layer.color[3];

          for (let i = 0; i < this.tiles.length; ++i) {
            // Retrieve the current tile and its associated texture.
            const tile = this.tiles[i];
            const ctx = this.tileContexts.get(tile.id);

            const screenScale = (tile.resolution / state.resolution) * pixelRatio;
            state.toScreenNoRotation(coords, tile.coords);
            context.drawImage(ctx.canvas, coords[0], coords[1], tileSize * screenScale, tileSize * screenScale);
          }
        },

        // Destroy the shader program, the buffers and all the tile images.
        detach: function () {
          this.watchHandles.removeAll();
        },

        // Required when using tiling; this methods is called every time that `this.tiles`
        // changes, to give the derived class a chance to perform per-tile work as needed;
        // This is where, for instance, tile data could be fetched from a server.
        tilesChanged: function () { }
      });

const CustomMaskLayer = Layer.createSubclass({

    tileInfo: TileInfo.create({ size: 512, spatialReference: { wkid: 102671 } }),

    constructor: function (params) {
      this.id = params?.id?? 'print-area';
        this.geometry = params?.geometry ?? null;
        this.distance = params?.distance ?? 25;
        this.color = params?.color ?? [0, 0, 0, 0.8];
        this._spatialReference = params?.spatialReference;
    },

    // get tileInfo() {
    //     return TileInfo.create({
    //       size: 512,
    //       spatialReference: this._spatialReference || { wkid: 3857 }
    //     });
    //   },

  createLayerView: function (view) {
    console.log("customeMask Layer Called")
    if (view.type === "2d") {
      console.log("creating custom mask features" )
      return new CustomLayerView2D({
        view,
        layer: this
      });
    }
  },

  properties: {
    id:{},
    geometry: {},
    distance: {},
    color: {}
  }
});

export default CustomMaskLayer;