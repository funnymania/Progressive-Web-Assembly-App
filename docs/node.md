
## JSONs

Make sure when reading from file (fs.readFile) to provide the proper encoding (utf8), or you may receive back a Buffer object. JSON.parse the data first before sending in a response. 

We dont actually need to use res.json, since this just uses send under the hood, providing the option to specify spaces (res.json(data, 2) sets indent to 2 spaces).