# Mission & Payload Sandbox

First-order mission and payload trade-offs in the browser, from Earth observation to Mars,
developed and documented with ECSS systems-engineering practices.

> Status: qualified (QR passed, 24 October 2026); all phase-1 requirements verified and validated against published missions. Next: acceptance review and release v1.0.0. Interactive interface in English
> and Italian with Sentinel-2, EnMAP and HiRISE/MRO presets; see the [reviews](docs/ecss/REVIEWS.md)
> and the [Verification Control Document](docs/ecss/VCD.md).

## What it does

Choose an orbit, a payload and a ground link, or start from a real mission (Sentinel-2,
Landsat 8/9, HiRISE on Mars Reconnaissance Orbiter). The sandbox computes ground sampling
distance, swath, revisit, signal-to-noise ratio, data volume and downlink capacity, applies
ESA margin policy to the budgets, and checks everything live against your requirements.
Switch the same mission from Earth to Mars to see why deep-space missions are driven by the link.

## Engineering approach

| ECSS standard | Applied as |
| --- | --- |
| ECSS-E-ST-10-06C, Technical requirements specification | [TS](docs/ecss/TS.md) and the requirement register `requirements/requirements.json` |
| ECSS-E-ST-10-02C Rev.1, Verification | [Verification Plan](docs/ecss/VP.md) and a [VCD](docs/ecss/VCD.md) generated from the tests |
| ECSS-E-ST-10-24C Rev.1, Interface management | [ICD](docs/ecss/ICD.md) between the physics core and the interface |
| ECSS-M-ST-10C, Project planning and implementation | [Life cycle and reviews](docs/ecss/REVIEWS.md), phases 0–F, MDR to AR |
| ECSS-M-ST-40C Rev.1, Configuration and information management | [Configuration and change records](docs/ecss/CM.md) |

Validation against published mission values: [Validation note](docs/ecss/VALIDATION.md).

## Run it

```bash
npm install
npm run dev      # local preview
npm test         # unit tests
npm run vcd      # tests + regenerate the Verification Control Document
npm run build    # production build in dist/
```

## Author

Giovanni Marino · [LinkedIn](https://www.linkedin.com/in/giov-marino)

Physical constants: NASA NSSDCA planetary fact sheets. Mission values: ESA, NASA, USGS and
HiRISE (University of Arizona) public pages, cited in the code next to each value.
