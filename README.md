# react-use-hover [![Build Status](https://travis-ci.com/andrewbranch/react-use-hover.svg?branch=master)](https://travis-ci.com/andrewbranch/react-use-hover) [![NPM Version](https://img.shields.io/npm/v/react-use-hover.svg)](https://www.npmjs.com/package/react-use-hover) [![Minified size](https://img.shields.io/bundlephobia/min/react-use-hover.svg)](https://www.npmjs.com/package/react-use-hover) [![Greenkeeper badge](https://badges.greenkeeper.io/andrewbranch/react-use-hover.svg)](https://greenkeeper.io/)

A React state hook to determine whether a React element is being hovered.

## Installation

```
npm install react-use-hover
```

## Usage

```js
import useHover from 'react-use-hover';

function Tooltip() {
  const [isHovering, hoverProps] = useHover();
  return (
    <>
      <span {...hoverProps} aria-describedby="overlay">Hover me</span>
      <Overlay visible={isHovering} role="tooltip" id="overlay">
        I’m a lil popup or something!
      </Overlay>
    </>
  );
}
```

### Options

```js
useHover({
  mouseEnterDelayMS,
  mouseLeaveDelayMS
})
```

- **`mouseEnterDelayMS: number = 200`**. The number of milliseconds to delay before setting the `isHovering` state to `true`. (Mousing back out during this delay period will cancel the state change.)
- **`mouseLeaveDelayMS: number = 0`**. The number of milliseconds to delay before setting the `isHovering` state to `false`. (Mousing back in during this period will cancel the state change.)

## Testing

```bash
# Run once, with coverage
npm run test

# Watch mode
npm run test -- --watch

# Do whatever you want
npx jest src # --any --jest --options
```

## Contributing

PRs welcome! Please ensure you `npm run build` and commit before pushing (to run prettier) and maintain 100% test coverage.