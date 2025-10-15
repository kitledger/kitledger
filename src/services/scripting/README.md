# The Scripting Engine

## Separation Layers
This engine has several separation layers that honestly I expect to not need but might need to anyway for example:

* The version layer: Currently V1, but I've seen other similar systems need to keep new versions of their APIs.
* The language folder: This is meant to separate the actual API implementation (api folder) from the JS runtime in the v1 versions. This has the purpose of decoupling in case I need to add a secondary language runtime, like WASM (Plain or Pyodide). I expect to not need this, but I can't guarantee it.
