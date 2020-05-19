var vega_geneHeatmap = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A small multiples view of 2D density heatmaps of automobile statistics.",
  "width": 250,
  "height": 250,
  "padding": 5,
  "autosize": "pad",
  "signals": [
    {
      "name": "bandwidthX",
      "value": -1,
      "bind": {
        "input": "range",
        "min": -1,
        "max": 100,
        "step": 1
      }
    },
    {
      "name": "bandwidthY",
      "value": -1,
      "bind": {
        "input": "range",
        "min": -1,
        "max": 100,
        "step": 1
      }
    },
    {
      "name": "resolve",
      "value": "shared",
      "bind": {
        "input": "select",
        "options": [
          "independent",
          "shared"
        ]
      }
    },
    {
      "name": "counts",
      "value": true,
      "bind": {
        "input": "checkbox"
      }
    },
    {
      "name": "smooth",
      "value": false,
      "bind": {
        "input": "checkbox"
      }
    },
    {
      "name": "cellSize",
      "value": 4,
      "bind": {
        "input": "select",
        "options": [
          1,
          2,
          4,
          8,
          16
        ]
      }
    },
    {
      "name": "title",
      "value": "Density",
      "update": "[if(resolve == 'shared', 'Global' + if(counts, ' Count', ' Prob.'), 'Local Density'), '(Normalized)']"
    }
  ],
  "data": [
    {
      "name": "source",
      "url": "data/cells.json",
      "transform": [
        {
          "type": "filter",
          "expr": "datum.x != null && datum.y != null"
        }
      ]
    },
    {
      "name": "density",
      "source": "source",
      "transform": [
        {
          "type": "kde2d",
          "groupby": [
            "health"
          ],
          "size": [
            {
              "signal": "width"
            },
            {
              "signal": "height"
            }
          ],
          "x": {
            "expr": "scale('x', datum.x)"
          },
          "y": {
            "expr": "scale('y', datum.y)"
          },
          "weight": {
            "field": "gene"
          },
          "bandwidth": {
            "signal": "[bandwidthX, bandwidthY]"
          },
          "cellSize": {
            "signal": "cellSize"
          },
          "counts": {
            "signal": "counts"
          }
        },
        {
          "type": "heatmap",
          "field": "grid",
          "resolve": {
            "signal": "resolve"
          },
          "color": {
            "expr": "scale('density', datum.$value / datum.$max)"
          },
          "opacity": 1
        }
      ]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {
        "data": "source",
        "field": "x"
      },
      "range": "width"
    },
    {
      "name": "y",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {
        "data": "source",
        "field": "y"
      },
      "range": "height"
    },
    {
      "name": "density",
      "type": "linear",
      "zero": true,
      "domain": [
        0,
        1
      ],
      "range": {
        "scheme": "Greys"
      }
    }
  ],
  "axes": [
    {
      "scale": "y",
      "domain": false,
      "orient": "left",
      "titlePadding": 5,
      "title": "y",
      "offset": 2
    }
  ],
  "legends": [
    {
      "fill": "density",
      "title": {
        "signal": "title"
      },
      "gradientLength": {
        "signal": "height - 28"
      }
    }
  ],
  "layout": {
    "bounds": "flush",
    "columns": 3,
    "padding": 10
  },
  "marks": [
    {
      "type": "group",
      "from": {
        "facet": {
          "name": "facet",
          "data": "density",
          "groupby": "health"
        }
      },
      "sort": {
        "field": "datum.health",
        "order": "ascending"
      },
      "title": {
        "text": {
          "signal": "parent.health"
        },
        "frame": "group"
      },
      "encode": {
        "update": {
          "width": {
            "signal": "width"
          },
          "height": {
            "signal": "height"
          }
        }
      },
      "axes": [
        {
          "scale": "x",
          "domain": false,
          "orient": "bottom",
          "tickCount": 5,
          "labelFlush": true,
          "title": "x"
        }
      ],
      "marks": [
        {
          "type": "image",
          "from": {
            "data": "facet"
          },
          "encode": {
            "update": {
              "x": {
                "value": 0
              },
              "y": {
                "value": 0
              },
              "image": {
                "field": "image"
              },
              "width": {
                "signal": "width"
              },
              "height": {
                "signal": "height"
              },
              "aspect": {
                "value": false
              },
              "smooth": {
                "signal": "smooth"
              }
            }
          }
        }
      ]
    }
  ],
  "config": {}
};
