// This file exports a backup JSON definition for the "Parcels Current" feature layer.
// It provides a static configuration for the layer's properties, rendering, and labeling,
// used as a fallback or reference within the Print workflow of CookViewer.
// This ensures consistent rendering and labeling of parcel data in printed maps,
// even if the layer is not visible when zoomed out in the map.
// The id and url are updated in the Print component to match the current layer in the map.
export const parcelCurrent = {
            "id": "1922088cfbf-layer-6",
            "title": "Parcels Current",
            "url": "https://gis.cookcountyil.gov/traditional/rest/services/CookViewer3Parcels/MapServer/0",
            "layerType": "ArcGISFeatureLayer",
            "layerDefinition": {
                "disableDisplayFilter": false,
                "displayFilterInfo": null,
                "definitionExpression": null,
                "drawingInfo": {
                    "labelingInfo": [
                        {
                            "name": "Class 1",
                            "allowOverrun": true,
                            "labelExpressionInfo": {
                                "expression": "\n                var label = \"\"\n\n                if($feature.YMax-$feature.YMin < $feature.XMax-$feature.XMin-20){\n                    label = Mid($feature.PIN10, 0, 2) + \"-\" + Mid($feature.PIN10, 2, 2) + \"-\" + Mid($feature.PIN10, 4, 3) + \"-\" + Mid($feature.PIN10, 7, 3)\n                }\n                else{\n                    label= Mid($feature.PIN10, 0, 2) + \"-\" + Mid($feature.PIN10, 2, 2) + TextFormatting.NewLine + Mid($feature.PIN10, 4, 3) + \"-\"  + Mid($feature.PIN10, 7, 3)\n                }\n                return label\n                \n                ",
                                "title": "Custom"
                            },
                            "labelPlacement": "esriServerPolygonPlacementAlwaysHorizontal",
                            "labelPosition": "curved",
                            "maxScale": 0,
                            "minScale": 8978.252315,
                            "repeatLabel": false,
                            "symbol": {
                                "type": "esriTS",
                                "color": [
                                    255,
                                    255,
                                    255,
                                    255
                                ],
                                "font": {
                                    "family": "Arial Unicode MS",
                                    "size": 11,
                                    "weight": "bold"
                                },
                                "horizontalAlignment": "center",
                                "kerning": true,
                                "haloColor": [
                                    0,
                                    0,
                                    0,
                                    255
                                ],
                                "haloSize": 1.5,
                                "rotated": false,
                                "text": "",
                                "verticalAlignment": "baseline",
                                "xoffset": 0,
                                "yoffset": 0,
                                "angle": 0
                            },
                            "useCodedValues": true
                        }
                    ],
                    "renderer": {
                        "type": "simple",
                        "visualVariables": [
                            {
                                "type": "sizeInfo",
                                "valueExpression": "$view.scale",
                                "valueExpressionTitle": "Custom",
                                "stops": [
                                    {
                                        "size": 2,
                                        "value": 820
                                    },
                                    {
                                        "size": 1,
                                        "value": 2563
                                    },
                                    {
                                        "size": 0.5,
                                        "value": 10253
                                    },
                                    {
                                        "size": 0,
                                        "value": 20506
                                    }
                                ],
                                "target": "outline"
                            }
                        ],
                        "symbol": {
                            "type": "CIMSymbolReference",
                            "symbol": {
                                "type": "CIMPolygonSymbol",
                                "symbolLayers": [
                                    {
                                        "type": "CIMSolidStroke",
                                        "effects": [
                                            {
                                                "type": "CIMGeometricEffectDashes",
                                                "dashTemplate": [
                                                    6.75,
                                                    4.5
                                                ],
                                                "lineDashEnding": "NoConstraint",
                                                "controlPointEnding": "NoConstraint"
                                            }
                                        ],
                                        "enable": true,
                                        "colorLocked": true,
                                        "capStyle": "Butt",
                                        "joinStyle": "Round",
                                        "lineStyle3D": "Strip",
                                        "miterLimit": 10,
                                        "width": 2.25,
                                        "height3D": 1,
                                        "anchor3D": "Center",
                                        "color": [
                                            0,
                                            206,
                                            209,
                                            255
                                        ]
                                    },
                                    {
                                        "type": "CIMSolidFill",
                                        "enable": true,
                                        "color": [
                                            0,
                                            0,
                                            0,
                                            0
                                        ]
                                    }
                                ],
                                "angleAlignment": "Map"
                            }
                        }
                    }
                }
            },
            "credits": "",
            "showLabels": true,
            "opacity": 1,
            "minScale": 0,
            "maxScale": 0
}