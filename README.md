# react-use-hover

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
npx jest # --any --jest --options
```

## Contributing

PRs welcome! Please ensure you `npm run build` and commit before pushing (to run prettier) and maintain 100% test coverage.